import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  FaCalendar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import ResponsableSidebar from "../../components/ResponsableSidebar";

interface Visit {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  project: {
    _id: string;
    name: string;
    city: string;
    type: string;
  };
}

const ResponsableVisits: React.FC = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/visits/responsable",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVisits(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch visits");
      setLoading(false);
    }
  };

  const updateVisitStatus = async (
    visitId: string,
    newStatus: Visit["status"]
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/visits/${visitId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchVisits(); // Refresh visits after update
    } catch (err) {
      setError("Failed to update visit status");
    }
  };

  const handleDelete = async (visitId: string) => {
    if (!window.confirm("Are you sure you want to delete this visit?")) {
      return;
    }

    setDeleteLoading(visitId);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/visits/${visitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchVisits(); // Refresh visits after deletion
    } catch (err) {
      setError("Failed to delete visit");
    } finally { 
      setDeleteLoading(null);
    }
  };

  const getStatusColor = (status: Visit["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ResponsableSidebar />
      <div className="flex-1 ml-64">
        <div className="py-6 px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Visits Management
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Visits
                </h2>
                <button
                  onClick={() => navigate("/responsable/visits/new")}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add New Visit
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visits.map((visit) => (
                    <tr key={visit._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {visit.firstName} {visit.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {visit.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {visit.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {visit.project.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {visit.project.city}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(visit.date), "MMM dd, yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            visit.status
                          )}`}
                        >
                          {visit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {visit.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateVisitStatus(visit._id, "Confirmed")
                              }
                              className="text-green-600 hover:text-green-900 mx-2"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                updateVisitStatus(visit._id, "Cancelled")
                              }
                              className="text-red-600 hover:text-red-900 mx-2"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() =>
                            navigate(`/responsable/visits/${visit._id}/edit`)
                          }
                          className="text-blue-600 hover:text-blue-900 mx-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(visit._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deleteLoading === visit._id}
                        >
                          {deleteLoading === visit._id ? "..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visits.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No visit requests found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsableVisits;
