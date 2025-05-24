// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import AdminLayout from "../../components/AdminLayout";
// import { FaPlus, FaEdit, FaTrash, FaEnvelope, FaPhone } from "react-icons/fa";

// interface Project {
//   _id: string;
//   name: string;
//   city: string;
// }

// interface Responsable {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   workingStatus: "Working" | "Not yet";
//   assignedProjects: Project[];
// }

// const Responsables: React.FC = () => {
//   const navigate = useNavigate();
//   const [responsables, setResponsables] = useState<Responsable[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchResponsables();
//   }, []);

//   const fetchResponsables = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("Fetching responsables...");
//       const response = await axios.get(
//         "http://localhost:5000/api/users/responsables",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Responsables data:", response.data);
//       setResponsables(response.data);
//     } catch (err: any) {
//       console.error("Error fetching responsables:", err);
//       setError(err.response?.data?.message || "Failed to fetch responsables");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Are you sure you want to delete this responsable?")) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:5000/api/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       await fetchResponsables();
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to delete responsable");
//     }
//   };

//   const getStatusColor = (status: string) => {
//     return status === "Working"
//       ? "bg-green-100 text-green-800"
//       : "bg-yellow-100 text-yellow-800";
//   };

//   if (loading) {
//     return (
//       <AdminLayout>
//         <div className="flex items-center justify-center h-32">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout>
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-semibold">Responsables</h1>
//           <button
//             onClick={() => navigate("/admin/responsables/new")}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Add New Responsable
//           </button>
//         </div>

//         {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Assigned Projects
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {responsables.map((responsable) => (
//                   <tr key={responsable._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {responsable.firstName} {responsable.lastName}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">
//                         {responsable.email}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">
//                         {responsable.phone}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
//                           responsable.workingStatus
//                         )}`}
//                       >
//                         {responsable.workingStatus}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         {responsable.assignedProjects?.length > 0 ? (
//                           <div className="space-y-1">
//                             {responsable.assignedProjects.map((project) => (
//                               <div
//                                 key={project._id}
//                                 className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
//                               >
//                                 {project.name} - {project.city}
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           <span className="text-gray-400">
//                             No projects assigned
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button
//                         onClick={() =>
//                           navigate(
//                             `/admin/responsables/${responsable._id}/edit`
//                           )
//                         }
//                         className="text-blue-600 hover:text-blue-900 mr-4"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(responsable._id)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {responsables.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="px-6 py-4 text-center text-sm text-gray-500"
//                     >
//                       No responsables found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default Responsables;
