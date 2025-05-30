import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import ResponsableSidebar from "../../components/ResponsableSidebar";
import {
  MdSecurity,
  MdSportsGymnastics,
  MdPool,
  MdChildCare,
  MdRestaurant,
  MdLocalCafe,
  MdMosque,
  MdShoppingBag,
  MdPark,
  MdLocalParking,
} from "react-icons/md";

interface Project {
  _id: string;
  name: string;
  city: string;
  type: string;
  price: number;
  numberOfApartments: number;
  etat: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
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
}

const ViewProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/projects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProject(response.data);
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            err.response.data.error || "Failed to fetch project details"
          );
        } else {
          setError("Failed to fetch project details");
        }
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const updatedProject: Partial<Project> = {
        name: formData.name || "",
        city: formData.city || "",
        type: formData.type || "",
        price: formData.price || 0,
        numberOfApartments: formData.numberOfApartments || 0,
        etat: formData.etat || "",
        description: formData.description || "",
        features: {
          parking: formData.features?.parking || false,
          gym: formData.features?.gym || false,
          swimmingPool: formData.features?.swimmingPool || false,
          security: formData.features?.security || false,
          playground: formData.features?.playground || false,
          restaurant: formData.features?.restaurant || false,
          cafe: formData.features?.cafe || false,
          mosque: formData.features?.mosque || false,
          shoppingArea: formData.features?.shoppingArea || false,
          greenSpaces: formData.features?.greenSpaces || false,
        },
      };

      const response = await axios.put(
        `http://localhost:5000/api/projects/${id}`,
        updatedProject,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        // Update both project and formData with the response data from the PUT request
        const latestProjectData = response.data;
        setProject(latestProjectData);
        setFormData(latestProjectData);

        // Show success message
        alert("Project updated successfully!");

        // Navigate after successful update and state update
        navigate("/responsable/projects");
      }
    } catch (err) {
      console.error("Update error:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Failed to update project");
      } else {
        setError("Failed to update project");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => {
        const currentFeatures = prev.features || {
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
        };
        return {
          ...prev,
          features: {
            ...currentFeatures,
            [name]: checkbox.checked,
          },
        };
      });
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFeatureChange = (featureName: string) => {
    setFormData((prev) => {
      const currentFeatures = prev.features || {
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
      };
      return {
        ...prev,
        features: {
          ...currentFeatures,
          [featureName]:
            !currentFeatures[featureName as keyof typeof currentFeatures],
        },
      };
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project || !formData) return <div>Project not found</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <ResponsableSidebar />
      <div className="flex-1 py-6 px-8" style={{ paddingLeft: "30rem" }}>
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Project</h1>
          <button
            onClick={() => navigate("/responsable/projects")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Projects
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 mx-auto max-w-lg w-full"
        >
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Moyen-Standing">Moyen-Standing</option>
                  <option value="Haut-Standing">Haut-Standing</option>
                  <option value="Economique">Economique</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Apartments
                </label>
                <input
                  type="number"
                  name="numberOfApartments"
                  value={formData.numberOfApartments || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="etat"
                  value={formData.etat || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="En Construction">En Construction</option>
                  <option value="Pret et Ouvert">Pret et Ouvert</option>
                  <option value="Termine">Termine</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.features || {}).map(([key, value]) => {
                  // Map feature keys to their corresponding icons
                  const featureIcons: { [key: string]: JSX.Element } = {
                    security: <MdSecurity size={20} color="#4F46E5" />,
                    gym: <MdSportsGymnastics size={20} color="#4F46E5" />,
                    swimmingPool: <MdPool size={20} color="#4F46E5" />,
                    playground: <MdChildCare size={20} color="#4F46E5" />,
                    restaurant: <MdRestaurant size={20} color="#4F46E5" />,
                    cafe: <MdLocalCafe size={20} color="#4F46E5" />,
                    mosque: <MdMosque size={20} color="#4F46E5" />,
                    shoppingArea: <MdShoppingBag size={20} color="#4F46E5" />,
                    greenSpaces: <MdPark size={20} color="#4F46E5" />,
                    parking: <MdLocalParking size={20} color="#4F46E5" />,
                  };

                  return (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={key}
                        checked={value}
                        onChange={() => handleFeatureChange(key)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center space-x-2">
                        {featureIcons[key]}
                        <label htmlFor={key} className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/responsable/projects")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {saving ? "Saving..." : "Update Project"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewProject;
