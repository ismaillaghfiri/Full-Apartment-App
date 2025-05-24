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
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Projects Management
              </h1>
            </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  My Projects
                </h2>

        <div style={{ overflowX: "auto" }}>
          <table className="main-table" style={{ tableLayout: "auto", width: "100%" }}>
            <thead>
                    <tr>
                <th style={{ width: 90 }}>Cover</th>
                <th>Name</th>
                <th>City</th>
                <th>Type</th>
                <th>Price</th>
                <th>Units</th>
                <th>Status</th>
                <th style={{ width: 120 }}>Actions</th>
                    </tr>
                  </thead>
            <tbody>
                    {projects.map((project) => (
                <tr key={project._id}>
                  <td>
                    {project.coverImage?.url ? (
                      <img
                        src={project.coverImage.url}
                        alt={project.name}
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 6,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 6,
                          background: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ color: "#bbb", fontSize: 18 }}>—</span>
                          </div>
                    )}
                        </td>
                  <td style={{ fontWeight: 500 }}>{project.name}</td>
                  <td>{project.city}</td>
                  <td>{project.type}</td>
                  <td>{project.price.toLocaleString()} DH</td>
                  <td>{project.numberOfApartments}</td>
                  <td>
                          <span
                      style={{
                        display: "inline-block",
                        padding: "2px 10px",
                        borderRadius: 12,
                        fontSize: 13,
                        background:
                          project.etat === "En Construction"
                            ? "#fef3c7"
                            : project.etat === "Pret et Ouvert"
                            ? "#d1fae5"
                            : "#fee2e2",
                        color:
                          project.etat === "En Construction"
                            ? "#b45309"
                            : project.etat === "Pret et Ouvert"
                            ? "#065f46"
                            : "#b91c1c",
                      }}
                          >
                      {project.etat}
                          </span>
                        </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() =>
                          navigate(`/responsable/projects/${project._id}/edit`)
                            }
                        className="btn"
                        style={{ padding: "6px 14px", fontSize: 14 }}
                          >
                        Edit
                          </button>
                    </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {projects.length === 0 && (
            <div style={{ textAlign: "center", color: "#888", padding: 32 }}>
              No projects found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsableProjects;
