import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import axios from "axios";

const AdminDashboard: React.FC = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [activeProjectCount, setActiveProjectCount] = useState(0);
  const [responsableCount, setResponsableCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch total projects count
        const projectsCountResponse = await axios.get(
          "http://localhost:5000/api/projects/count",
          { headers }
        );
        setProjectCount(projectsCountResponse.data.count);

        // Fetch responsables and count them
        const responsablesResponse = await axios.get(
          "http://localhost:5000/api/users/responsables",
          { headers }
        );
        setResponsableCount(responsablesResponse.data.length);

        // Fetch all projects to count active ones
        const allProjectsResponse = await axios.get(
          "http://localhost:5000/api/projects",
          { headers }
        );
        const activeProjects = allProjectsResponse.data.filter(
          (project: any) =>
            project.etat === "En Construction" || project.etat === "Pret et Ouvert"
        );
        setActiveProjectCount(activeProjects.length);

      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <AdminLayout>
      <div className="flex justify-center p-6">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Projects
              </h2>
              <p className="text-3xl font-bold text-blue-600">{projectCount}</p>
              <p className="text-sm text-gray-500 mt-1">Total Projects</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Active Projects
              </h2>
              <p className="text-3xl font-bold text-green-600">{activeProjectCount}</p>
              <p className="text-sm text-gray-500 mt-1">Projects in Progress</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Responsables
              </h2>
              <p className="text-3xl font-bold text-purple-600">{responsableCount}</p>
              <p className="text-sm text-gray-500 mt-1">Total Responsables</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
