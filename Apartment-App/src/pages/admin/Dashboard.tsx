import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/UserContext";
import AdminLayout from "../../components/AdminLayout";
import { FaBuilding, FaUsers, FaCalendarAlt } from "react-icons/fa";

interface DashboardStats {
  projects: number;
  users: number;
  visits: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [projectsRes, usersRes, visitsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/projects/count", config),
        axios.get("http://localhost:5000/api/users/count", config),
        axios.get("http://localhost:5000/api/visits/count", config),
      ]);

      setStats({
        projects: projectsRes.data.count,
        users: usersRes.data.count,
        visits: visitsRes.data.count,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Projects
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.projects}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaBuilding size={24} color="#3b82f6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.users}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaUsers size={24} color="#10b981" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visits</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.visits}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaCalendarAlt size={24} color="#f59e0b" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
