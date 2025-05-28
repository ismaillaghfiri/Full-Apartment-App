import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ResponsableSidebar from "../../components/ResponsableSidebar";
import { useAuth } from "../../contexts/AuthContext";
import "../../dashboard.css";

interface Project {
  _id: string;
  name: string;
  city: string;
  type: string;
  price: number;
  numberOfApartments: number;
  etat: string;
  description: string;
  coverImage?: {
    url: string;
  };
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

const ResponsableProjects: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/projects/responsable",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch projects");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <ResponsableSidebar />
      <div className="flex-1 p-6">
        

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          My Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                {project.coverImage?.url ? (
                  <img
                    src={project.coverImage.url}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">—</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span className="font-medium">{project.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{project.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">
                      {project.price.toLocaleString()} DH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Units:</span>
                    <span className="font-medium">
                      {project.numberOfApartments}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.etat === "En Construction"
                        ? "bg-yellow-100 text-yellow-800"
                        : project.etat === "Pret et Ouvert"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {project.etat}
                  </span>

                  <button
                    onClick={() =>
                      navigate(`/responsable/projects/${project._id}/edit`)
                    }
                    className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsableProjects;
