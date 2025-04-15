import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { useDropzone } from "react-dropzone";

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

const EditProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    city: "",
    type: "",
    price: 0,
    numberOfApartments: 0,
    etat: "",
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
      } catch (err: any) {
        console.error("Failed to fetch responsables:", err);
        setError("Failed to load responsables. Please try again.");
      }
    };

    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/projects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFormData({
          ...response.data,
          responsable: response.data.responsable?._id || "",
        });
      } catch (err) {
        setError("Failed to fetch project details");
        console.error(err);
      }
    };

    fetchResponsables();
    if (id) {
      fetchProject();
    }
  }, [id]);

  const onCoverDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploadingImages(true);

    try {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      formData.append("upload_preset", "realestate_app");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dh0zexskw/image/upload`,
        formData
      );

      setFormData((prev) => ({
        ...prev,
        coverImage: {
          url: response.data.secure_url,
          publicId: response.data.public_id,
        },
      }));
    } catch (err) {
      setError("Failed to upload cover image");
    } finally {
      setUploadingImages(false);
    }
  }, []);

  const onGalleryDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadingImages(true);

    try {
      const uploadPromises = acceptedFiles.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "realestate_app");

        return axios.post(
          `https://api.cloudinary.com/v1_1/dh0zexskw/image/upload`,
          formData
        );
      });

      const responses = await Promise.all(uploadPromises);
      const newImages = responses.map((response) => ({
        url: response.data.secure_url,
        publicId: response.data.public_id,
      }));

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newImages],
      }));
    } catch (err) {
      setError("Failed to upload gallery images");
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

      const response = await axios.put(
        `http://localhost:5000/api/projects/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/admin/projects");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("Please authenticate to continue");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Une erreur s'est produite lors de la modification du projet");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (publicId: string, isGallery: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/projects/${id}/delete-image`,
        { publicId, isGallery },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (isGallery) {
        setFormData((prev) => ({
          ...prev,
          gallery: prev.gallery.filter((img) => img.publicId !== publicId),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          coverImage: null,
        }));
      }
    } catch (err) {
      setError("Failed to delete image");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Edit Project</h1>
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
                  <div className="relative">
                    <img
                      src={formData.coverImage.url}
                      alt="Cover"
                      className="mx-auto h-40 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteImage(formData.coverImage!.publicId, false)
                      }
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2"
                    >
                      ×
                    </button>
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
                        onClick={() => handleDeleteImage(image.publicId, true)}
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

            {/* Add Responsable Selection before the submit button */}
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

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/projects")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading
                  ? "Updating..."
                  : uploadingImages
                  ? "Uploading Images..."
                  : "Update Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditProject;
