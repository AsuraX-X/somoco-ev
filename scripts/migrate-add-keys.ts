import { client } from "@/sanity/lib/client";

/**
 * Migration script to add _key properties to array items in existing vehicle documents
 * Run this once to fix all existing documents that are missing _key properties
 */

// Helper function to generate unique keys
const generateKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

async function migrateVehicles() {
  try {
    console.log("Starting migration...");

    // Fetch all vehicle documents
    const vehicles = await client.fetch(`*[_type == "event"]`);
    console.log(`Found ${vehicles.length} vehicles to check`);

    let updatedCount = 0;

    for (const vehicle of vehicles) {
      let needsUpdate = false;
      const patches: any = {};

      // Check and fix specifications
      if (vehicle.specifications) {
        const specs: any = {};

        [
          "keyParameters",
          "bodyParameters",
          "engineParameters",
          "motorParameters",
          "wheelBrakeParameters",
          "keyConfigurations",
        ].forEach((section) => {
          if (
            vehicle.specifications[section] &&
            Array.isArray(vehicle.specifications[section])
          ) {
            const items = vehicle.specifications[section].map((item: any) => {
              if (!item._key) {
                needsUpdate = true;
                return { ...item, _key: generateKey() };
              }
              return item;
            });
            specs[section] = items;
          }
        });

        if (needsUpdate) {
          patches.specifications = {
            ...vehicle.specifications,
            ...specs,
          };
        }
      }

      // Check and fix images
      if (vehicle.images && Array.isArray(vehicle.images)) {
        const imagesNeedKeys = vehicle.images.some((img: any) => !img._key);
        if (imagesNeedKeys) {
          needsUpdate = true;
          patches.images = vehicle.images.map((img: any) => ({
            ...img,
            _key: img._key || generateKey(),
          }));
        }
      }

      // Apply patches if needed
      if (needsUpdate) {
        console.log(`Updating vehicle: ${vehicle.name} (${vehicle._id})`);
        await client.patch(vehicle._id).set(patches).commit();
        updatedCount++;
      }
    }

    console.log(`Migration complete! Updated ${updatedCount} vehicles.`);
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateVehicles()
  .then(() => {
    console.log("✅ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  });
