import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import AdminLayout from "../../components/AdminLayout";

interface Responsable {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  city: string;
  type: string;
  price: number;
  numberOfApartments: number;
  etat: string;
  coverImage: {
    url: string;
    publicId: string;
  } | null;
  gallery: Array<{
    url: string;
    publicId: string;
  }>;
  features: {
    parking: boolean;
    gym: boolean;
    swimmingPool: boolean;
    security: boolean;
    playground: boolean;
    restaurant: boolean;
    cafe: boolean;
    mosque: boolean;
    shoppingArea: boolean;
    greenSpaces: boolean;
  };
  responsable: string;
}

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    city: "",
    type: "Eco-Standing",
    price: 0,
    numberOfApartments: 0,
    etat: "En Construction",
    coverImage: null,
    gallery: [],
    features: {
      parking: false,
      gym: false,
      swimmingPool: false,
      security: false,
      playground: false,
      restaurant: false,
      cafe: false,
      mosque: false,
      shoppingArea: false,
      greenSpaces: false,
    },
    responsable: "",
  });

  useEffect(() => {
    fetchResponsables();
  }, []);

  const fetchResponsables = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/users/responsables",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResponsables(response.data);

      // Set the first responsable as default if available
      if (response.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          responsable: response.data[0]._id,
        }));
      }
    } catch (err: any) {
      console.error("Failed to fetch responsables:", err);
      setError("Failed to load responsables. Please try again.");
    }
  };

  const onCoverDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploadingImages(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      formData.append("upload_preset", "realestate_app");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dh0zexskw/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.secure_url || !response.data.public_id) {
        throw new Error("Invalid response from Cloudinary");
      }

      setFormData((prev) => ({
        ...prev,
        coverImage: {
          url: response.data.secure_url,
          publicId: response.data.public_id,
        },
      }));
    } catch (err) {
      console.error("Error uploading cover image:", err);
      setError("Failed to upload cover image. Please try again.");
    } finally {
      setUploadingImages(false);
    }
  }, []);

  const onGalleryDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadingImages(true);
    setError("");

    try {
      const uploadPromises = acceptedFiles.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "realestate_app");

        return axios.post(
          `https://api.cloudinary.com/v1_1/dh0zexskw/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      });

      const responses = await Promise.all(uploadPromises);
      const newImages = responses.map((response) => {
        if (!response.data.secure_url || !response.data.public_id) {
          throw new Error("Invalid response from Cloudinary");
        }
        return {
          url: response.data.secure_url,
          publicId: response.data.public_id,
        };
      });

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newImages],
      }));
    } catch (err) {
      console.error("Error uploading gallery images:", err);
      setError("Failed to upload gallery images. Please try again.");
    } finally {
      setUploadingImages(false);
    }
  }, []);

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps } =
    useDropzone({
      onDrop: onCoverDrop,
      accept: { "image/*": [] },
      maxFiles: 1,
    });

  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
  } = useDropzone({
    onDrop: onGalleryDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: checkbox.checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "price" || name === "numberOfApartments"
            ? Number(value)
            : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please authenticate to continue");
        return;
      }

      // Validate required fields
      if (
        !formData.name ||
        !formData.description ||
        !formData.city ||
        !formData.type ||
        !formData.price ||
        !formData.numberOfApartments ||
        !formData.etat ||
        !formData.responsable
      ) {
        setError("Please fill in all required fields");
        return;
      }

      // Create a new object with the correct data structure
      const projectData = {
        name: formData.name,
        description: formData.description,
        city: formData.city,
        type: formData.type,
        price: Number(formData.price),
        numberOfApartments: Number(formData.numberOfApartments),
        etat: formData.etat,
        features: formData.features,
        responsable: formData.responsable,
        coverImage: formData.coverImage || null,
        gallery: formData.gallery || [],
      };

      console.log("Sending project data:", projectData);

      const response = await axios.post(
        "http://localhost:5000/api/projects",
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/admin/projects");
    } catch (error: any) {
      console.error(
        "Error creating project:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        setError("Please authenticate to continue");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while creating the project");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Create New Project</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Eco-Standing">Eco-Standing</option>
                  <option value="Moyen-Standing">Moyen-Standing</option>
                  <option value="Haut-Standing">Haut-Standing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Apartments
                </label>
                <input
                  type="number"
                  name="numberOfApartments"
                  value={formData.numberOfApartments}
                  onChange={handleChange}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="etat"
                  value={formData.etat}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="En Construction">En Construction</option>
                  <option value="Pret et Ouvert">Pret et Ouvert</option>
                  <option value="Fermer">Fermer</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <div
                {...getCoverRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
              >
                <input {...getCoverInputProps()} />
                {formData.coverImage ? (
                  <div>
                    <img
                      src={formData.coverImage.url}
                      alt="Cover"
                      className="mx-auto h-40 object-cover rounded"
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Drag and drop a cover image, or click to select
                  </p>
                )}
              </div>
            </div>

            {/* Gallery Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Images
              </label>
              <div
                {...getGalleryRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
              >
                <input {...getGalleryInputProps()} />
                <p className="text-gray-600">
                  Drag and drop gallery images, or click to select
                </p>
              </div>
              {formData.gallery.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {formData.gallery.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Gallery ${index + 1}`}
                        className="h-24 w-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            gallery: prev.gallery.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Features
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(formData.features).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={key}
                      name={key}
                      checked={value}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={key}
                      className="ml-2 text-sm text-gray-700 capitalize"
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Responsable
              </label>
              <select
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a responsable</option>
                {responsables.map((resp) => (
                  <option key={resp._id} value={resp._id}>
                    {resp.firstName} {resp.lastName} ({resp.email})
                  </option>
                ))}
              </select>
              {responsables.length === 0 && (
                <p className="mt-2 text-sm text-yellow-600">
                  No responsables available. Please create a responsable first.
                </p>
              )}
            </div>

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/projects")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading
                  ? "Creating..."
                  : uploadingImages
                  ? "Uploading Images..."
                  : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewProject;
