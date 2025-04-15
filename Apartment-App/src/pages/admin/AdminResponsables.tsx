import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

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
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Responsables Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage all your responsables in one place
            </p>
          </div>
          <Link
            to="/admin/responsables/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-sm transition-all duration-150 ease-in-out flex items-center gap-2"
          >
            Add New Responsable
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {responsables.map((responsable) => (
                  <tr
                    key={responsable._id}
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                          {responsable.profileImage?.url ? (
                            <img
                              src={responsable.profileImage.url}
                              alt={`${responsable.firstName} ${responsable.lastName}`}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUser size={20} color="#3B82F6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {responsable.firstName} {responsable.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {responsable.email}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {responsable.phone}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {responsable.role}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span
                        className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${
                          responsable.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {responsable.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex gap-3">
                        <Link
                          to={`/admin/responsables/${responsable._id}/edit`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-150 ease-in-out inline-flex items-center"
                        >
                          <div className="mr-2">
                            <FaEdit size={16} />
                          </div>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(responsable._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-150 ease-in-out inline-flex items-center"
                        >
                          <div className="mr-2">
                            <FaTrash size={16} />
                          </div>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminResponsables;
