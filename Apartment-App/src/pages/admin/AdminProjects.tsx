import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { FaEdit, FaTrash, FaPlus, FaBuilding } from "react-icons/fa";
import "../../dashboard.css";

interface Project {
  _id: string;
  name: string;
  description: string;
  city: string;
  type: string;
  price: number;
  numberOfApartments: number;
  etat: string;
  responsable: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  coverImage?: {
    url: string;
  };
}

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (err) {
      setError("Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projects.filter((project) => project._id !== id));
      } catch (err) {
        setError("Failed to delete project");
        console.error("Error deleting project:", err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <AdminLayout>
      <div className="table-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: "1.35rem", fontWeight: 600, margin: 0 }}>
            Projects Management
          </h2>
          <button
            onClick={() => (window.location.href = "/admin/projects/new")}
            className="btn"
          >
            + New Project
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            className="main-table"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr>
                <th style={{ width: 90 }}>Cover</th>
                <th>Name</th>
                <th>City</th>
                <th>Type</th>
                <th>Price</th>
                <th>Units</th>
                <th>Status</th>
                <th>Responsable</th>
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
                    {project.responsable ? (
                      `${project.responsable.firstName} ${project.responsable.lastName}`
                    ) : (
                      <span style={{ color: "#bbb" }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() =>
                          (window.location.href = `/admin/projects/${project._id}/edit`)
                        }
                        className="btn"
                        style={{ padding: "6px 14px", fontSize: 14 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="btn secondary"
                        style={{ padding: "6px 14px", fontSize: 14 }}
                      >
                        Delete
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
    </AdminLayout>
  );
};

export default AdminProjects;
