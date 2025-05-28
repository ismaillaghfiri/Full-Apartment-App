import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import AdminLayout from "../../components/AdminLayout";
import "../../dashboard.css";

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
          },
        }
      );

      console.log("Project created:", response.data);

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
      <div>
        <div className="form-card">
          <h1 className="form-title">Create New Project</h1>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="form-error text-center mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Type</option>
                  <option value="Moyen-Standing">Moyen-Standing</option>
                  <option value="Haut-Standing">Haut-Standing</option>
                  <option value="Economique">Economique</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Price (DH)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Number of Apartments</label>
                <input
                  type="number"
                  name="numberOfApartments"
                  value={formData.numberOfApartments}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Status</label>
                <select
                  name="etat"
                  value={formData.etat}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Status</option>
                  <option value="En Construction">En Construction</option>
                  <option value="Pret et Ouvert">Pret et Ouvert</option>
                  <option value="Termine">Termine</option>
                </select>
              </div>
            </div>

            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="form-textarea"
            />

            {/* Cover Image Upload */}
            <label className="form-label">Cover Image</label>
            <div style={{ marginBottom: 18 }}>
              <div
                {...getCoverRootProps()}
                style={{
                  border: "2px dashed #d1d5db",
                  borderRadius: 8,
                  padding: 24,
                  textAlign: "center",
                  cursor: "pointer",
                  background: "#f9fafb",
                }}
              >
                <input {...getCoverInputProps()} />
                {formData.coverImage ? (
                  <div>
                    <img
                      src={formData.coverImage.url}
                      alt="Cover"
                      style={{
                        display: "block",
                        margin: "0 auto",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <p style={{ marginTop: 8, color: "#666", fontSize: 14 }}>
                      Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <p style={{ color: "#666", fontSize: 14 }}>
                    Drag and drop a cover image, or click to select
                  </p>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            <label className="form-label">Gallery Images</label>
            <div>
              <div
                {...getGalleryRootProps()}
                style={{
                  border: "2px dashed #d1d5db",
                  borderRadius: 8,
                  padding: 24,
                  textAlign: "center",
                  cursor: "pointer",
                  background: "#f9fafb",
                }}
              >
                <input {...getGalleryInputProps()} />
                <p style={{ color: "#666", fontSize: 14 }}>
                  Drag and drop gallery images, or click to select
                </p>
              </div>
              {formData.gallery.length > 0 && (
                <div
                  style={{
                    marginTop: 16,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                  }}
                >
                  {formData.gallery.map((image, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={image.url}
                        alt={`Gallery ${index + 1}`}
                        style={{
                          height: 64,
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            gallery: prev.gallery.filter((_, i) => i !== index),
                          }));
                        }}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: 24,
                          height: 24,
                          cursor: "pointer",
                          transform: "translate(50%, -50%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          lineHeight: 1,
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <label className="form-label">Features</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
                marginBottom: 18,
              }}
            >
              {Object.entries(formData.features).map(([key, value]) => (
                <div
                  key={key}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    id={key}
                    name={key}
                    checked={value}
                    onChange={handleChange}
                    className="form-input"
                    style={{ width: 18, height: 18, marginRight: 8 }}
                  />
                  <label
                    htmlFor={key}
                    style={{ textTransform: "capitalize", fontSize: 15 }}
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                </div>
              ))}
            </div>

            {/* Responsable Selection */}
            <div style={{ marginBottom: 18 }}>
              <label className="form-label">Responsable</label>
              <select
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select a responsable</option>
                {responsables.map((responsable) => (
                  <option key={responsable._id} value={responsable._id}>
                    {responsable.firstName} {responsable.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/admin/projects")}
                className="btn secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="btn"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewProject;
