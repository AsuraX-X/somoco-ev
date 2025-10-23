"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Parameter {
  name: string;
  value: string;
}

interface VehicleFormData {
  brand: string;
  name: string;
  type: string;
  description: string;
  specifications: {
    keyParameters: Parameter[];
    bodyParameters: Parameter[];
    engineParameters: Parameter[];
    motorParameters: Parameter[];
    wheelBrakeParameters: Parameter[];
    keyConfigurations: Parameter[];
  };
}

interface UploadedImage {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
}

interface SanityImage extends UploadedImage {
  _key?: string;
}

// Helper function to generate unique keys
const generateKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<VehicleFormData>({
    brand: "",
    name: "",
    type: "",
    description: "",
    specifications: {
      keyParameters: [],
      bodyParameters: [],
      engineParameters: [],
      motorParameters: [],
      wheelBrakeParameters: [],
      keyConfigurations: [],
    },
  });

  const [images, setImages] = useState<SanityImage[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [activeSection, setActiveSection] = useState<
    keyof VehicleFormData["specifications"] | null
  >(null);
  const [currentParam, setCurrentParam] = useState<Parameter>({
    name: "",
    value: "",
  });

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vehicles/${vehicleId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch vehicle");
      }

      setFormData({
        brand: data.data.brand || "",
        name: data.data.name || "",
        type: data.data.type || "",
        description: data.data.description || "",
        specifications: data.data.specifications
          ? {
              keyParameters: (data.data.specifications.keyParameters || []).map(
                (p: any) => ({
                  ...p,
                  _key: p._key || generateKey(),
                })
              ),
              bodyParameters: (
                data.data.specifications.bodyParameters || []
              ).map((p: any) => ({
                ...p,
                _key: p._key || generateKey(),
              })),
              engineParameters: (
                data.data.specifications.engineParameters || []
              ).map((p: any) => ({
                ...p,
                _key: p._key || generateKey(),
              })),
              motorParameters: (
                data.data.specifications.motorParameters || []
              ).map((p: any) => ({
                ...p,
                _key: p._key || generateKey(),
              })),
              wheelBrakeParameters: (
                data.data.specifications.wheelBrakeParameters || []
              ).map((p: any) => ({
                ...p,
                _key: p._key || generateKey(),
              })),
              keyConfigurations: (
                data.data.specifications.keyConfigurations || []
              ).map((p: any) => ({
                ...p,
                _key: p._key || generateKey(),
              })),
            }
          : {
              keyParameters: [],
              bodyParameters: [],
              engineParameters: [],
              motorParameters: [],
              wheelBrakeParameters: [],
              keyConfigurations: [],
            },
      });

      // Load existing images
      if (data.data.images && data.data.images.length > 0) {
        // Ensure all images have _key
        const imagesWithKeys = data.data.images.map((img: SanityImage) => ({
          ...img,
          _key: img._key || generateKey(),
        }));
        setImages(imagesWithKeys);
        // Generate previews for existing images using Sanity CDN
        const previews = data.data.images.map((img: SanityImage) => {
          const ref = img.asset._ref;
          // Parse the Sanity asset reference (format: image-{id}-{dimensions}-{format})
          const parts = ref.split("-");
          const id = parts[1];
          const format = parts[parts.length - 1];
          const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
          const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
          return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${parts[2]}.${format}`;
        });
        setImagePreviews(previews);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load vehicle",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addParameter = (section: keyof VehicleFormData["specifications"]) => {
    if (!currentParam.name || !currentParam.value) {
      alert("Please fill in both parameter name and value");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [section]: [
          ...prev.specifications[section],
          {
            ...currentParam,
            _key: generateKey(), // Add unique key for Sanity
          },
        ],
      },
    }));
    setCurrentParam({ name: "", value: "" });
  };

  const removeParameter = (
    section: keyof VehicleFormData["specifications"],
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [section]: prev.specifications[section].filter((_, i) => i !== index),
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    try {
      const uploadedImages: UploadedImage[] = [];
      const previews: string[] = [];

      for (const file of Array.from(files)) {
        // Create preview
        const reader = new FileReader();
        const previewPromise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        previews.push(await previewPromise);

        // Upload to Sanity
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload image");
        }

        // Add _key to uploaded image
        uploadedImages.push({
          ...data.data,
          _key: generateKey(),
        });
      }

      setImages((prev) => [...prev, ...uploadedImages]);
      setImagePreviews((prev) => [...prev, ...previews]);
      setMessage({
        type: "success",
        text: `${uploadedImages.length} image(s) uploaded successfully!`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to upload images",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: images,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update vehicle");
      }

      setMessage({ type: "success", text: "Vehicle updated successfully!" });

      setTimeout(() => {
        router.push("/admin/vehicles");
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  const SpecificationSection = ({
    title,
    section,
  }: {
    title: string;
    section: keyof VehicleFormData["specifications"];
  }) => (
    <div className="border border-[#333] rounded bg-primary p-3">
      <button
        type="button"
        onClick={() =>
          setActiveSection(activeSection === section ? null : section)
        }
        className="w-full flex justify-between items-center font-medium text-sm text-white"
      >
        <span>
          {title} ({formData.specifications[section].length})
        </span>
        <span className="text-green-500">
          {activeSection === section ? "−" : "+"}
        </span>
      </button>

      {activeSection === section && (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Parameter name"
              value={currentParam.name}
              onChange={(e) =>
                setCurrentParam((prev) => ({ ...prev, name: e.target.value }))
              }
              className="px-3 py-2 bg-[#252525] border border-[#333] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              placeholder="Value"
              value={currentParam.value}
              onChange={(e) =>
                setCurrentParam((prev) => ({ ...prev, value: e.target.value }))
              }
              className="px-3 py-2 bg-[#252525] border border-[#333] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>
          <button
            type="button"
            onClick={() => addParameter(section)}
            className="w-full bg-green-500 text-white py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors"
          >
            Add Parameter
          </button>

          {formData.specifications[section].length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="font-medium text-xs text-gray-400">
                Current parameters:
              </p>
              {formData.specifications[section].map((param, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-[#252525] p-2 rounded border border-[#333]"
                >
                  <span className="text-sm text-gray-300">
                    <strong className="text-white">{param.name}:</strong>{" "}
                    {param.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeParameter(section, index)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
        <p className="mt-4 text-gray-400">Loading vehicle...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#252525] rounded-lg p-6 border border-[#333]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Vehicle</h2>
          <button
            onClick={() => router.push("/admin/vehicles")}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to list
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-3 rounded border ${
              message.type === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-white">
              Basic Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-300">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className="w-full px-3 py-2 bg-primary border border-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="e.g., Tesla, BYD, NIO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-300">
                  Vehicle Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 bg-primary border border-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="e.g., Model 3, Seal, ET7"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-300">
                  Type
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full px-3 py-2 bg-primary border border-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="e.g., Sedan, SUV, Hatchback"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-primary border border-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
                  rows={3}
                  placeholder="Brief description of the vehicle"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-white">Images</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-300">
                  Upload New Images{" "}
                  {images.length > 0 && `(${images.length} current)`}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2 bg-primary border border-[#333] rounded text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-500 file:text-white hover:file:bg-green-600 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {uploading && (
                  <p className="text-sm text-gray-400 mt-2">
                    Uploading images...
                  </p>
                )}
              </div>

              {imagePreviews.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Current images (hover to remove):
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Image ${index + 1}`}
                          className="w-full h-32 object-cover rounded border border-[#333]"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-primary border border-[#333] rounded p-6 text-center">
                  <p className="text-gray-400 text-sm">
                    No images yet. Upload some above.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-white">
              Specifications
            </h2>
            <div className="space-y-2">
              <SpecificationSection
                title="Key Parameters"
                section="keyParameters"
              />
              <SpecificationSection
                title="Body Parameters"
                section="bodyParameters"
              />
              <SpecificationSection
                title="Engine Parameters"
                section="engineParameters"
              />
              <SpecificationSection
                title="Motor Parameters"
                section="motorParameters"
              />
              <SpecificationSection
                title="Wheel Brake Parameters"
                section="wheelBrakeParameters"
              />
              <SpecificationSection
                title="Key Configurations"
                section="keyConfigurations"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-500 text-white py-2.5 rounded font-medium hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/vehicles")}
              className="px-6 py-2.5 border border-[#333] text-gray-300 rounded hover:bg-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-[#333]">
          <p className="text-sm text-gray-400">
            To manage images, use the{" "}
            <a
              href="/studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400"
            >
              Sanity Studio
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
