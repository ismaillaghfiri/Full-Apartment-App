import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../dashboard.css";

interface Responsable {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  profileImage?: {
    url: string;
  };
}

const AdminResponsables: React.FC = () => {
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResponsables();
  }, []);

  const fetchResponsables = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/users/responsables",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponsables(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch responsables");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this responsable?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResponsables(responsables.filter((r) => r._id !== id));
      } catch (err) {
        setError("Failed to delete responsable");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            Responsables Management
          </h2>
          <button
            onClick={() => (window.location.href = "/admin/responsables/new")}
            className="btn"
          >
            + New Responsable
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            className="main-table"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr>
                <th style={{ width: 90 }}>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responsables.map((responsable) => (
                <tr key={responsable._id}>
                  <td>
                    {responsable.profileImage?.url ? (
                      <img
                        src={responsable.profileImage.url}
                        alt={`${responsable.firstName} ${responsable.lastName}`}
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: "50%",
                          background: "#e0e7ef",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#2563eb",
                            fontWeight: 700,
                            fontSize: 18,
                          }}
                        >
                          {responsable.firstName[0]}
                        </span>
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {responsable.firstName} {responsable.lastName}
                  </td>
                  <td>{responsable.email}</td>
                  <td>{responsable.phone}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {responsable.role}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() =>
                          (window.location.href = `/admin/responsables/${responsable._id}/edit`)
                        }
                        className="btn"
                        style={{ padding: "6px 14px", fontSize: 14 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(responsable._id)}
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
          {responsables.length === 0 && (
            <div style={{ textAlign: "center", color: "#888", padding: 32 }}>
              No responsables found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminResponsables;
