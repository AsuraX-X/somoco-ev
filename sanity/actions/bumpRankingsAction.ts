import { DocumentActionComponent } from "sanity";
import { useClient } from "sanity";
import { useCallback, useState } from "react";

// Custom document action to automatically reorder vehicles when ranking changes
export const ReorderVehiclesAction: DocumentActionComponent = (props) => {
  const { id, type, draft, published, onComplete } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const [isRunning, setIsRunning] = useState(false);

  const currentDoc = (draft || published) as { ranking?: number } | null;
  const newRanking = currentDoc?.ranking;

  const handleReorder = useCallback(async () => {
    if (newRanking === undefined || newRanking === null) {
      onComplete();
      return;
    }

    setIsRunning(true);

    try {
      // Find all vehicles with ranking >= newRanking (excluding current document)
      const vehiclesToUpdate = await client.fetch<
        Array<{ _id: string; ranking: number }>
      >(
        `*[_type == "event" && ranking >= $ranking && _id != $currentId && !(_id in path("drafts.**"))]{ _id, ranking }`,
        { ranking: newRanking, currentId: id.replace("drafts.", "") }
      );

      if (vehiclesToUpdate.length > 0) {
        // Create a transaction to update all affected vehicles
        const transaction = client.transaction();

        vehiclesToUpdate.forEach((vehicle) => {
          transaction.patch(vehicle._id, {
            set: { ranking: vehicle.ranking + 1 },
          });
        });

        await transaction.commit();
      }

      onComplete();
    } catch (error) {
      console.error("Failed to reorder vehicles:", error);
    } finally {
      setIsRunning(false);
    }
  }, [client, id, newRanking, onComplete]);

  // Only show for vehicle documents (schema name is "event")
  if (type !== "event") {
    return null;
  }

  return {
    label: isRunning ? "Reordering..." : "Save & Reorder Others",
    disabled: isRunning || newRanking === undefined,
    title:
      "Save this vehicle and automatically bump up rankings of vehicles at or below this position",
    onHandle: handleReorder,
  };
};
