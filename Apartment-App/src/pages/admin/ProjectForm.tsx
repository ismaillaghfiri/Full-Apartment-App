// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import AdminLayout from "../../components/AdminLayout";

// interface ProjectFormData {
//   title: string;
//   description: string;
//   location: {
//     city: string;
//     address: string;
//     coordinates?: {
//       lat: number;
//       lng: number;
//     };
//   };
//   price: number;
//   type: "Eco-Standing" | "Moyen-Standing" | "Haut-Standing";
//   status: "Prêt et Ouvert" | "En construction" | "fermer";
//   features: {
//     greenSpace: boolean;
//     gym: boolean;
//     market: boolean;
//     cafe: boolean;
//     restaurants: boolean;
//     parking: boolean;
//     security: boolean;
//     swimmingPool: boolean;
//     playground: boolean;
//   };
//   specifications: {
//     bedrooms: number;
//     bathrooms: number;
//     area: number;
//     floors: number;
//   };
//   responsable: string;
//   images?: Array<{
//     url: string;
//     publicId: string;
//     isMain: boolean;
//   }>;
//   isFeatured?: boolean;
// }

// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
// }

// const ProjectForm: React.FC = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [responsables, setResponsables] = useState<User[]>([]);
//   const [formData, setFormData] = useState<ProjectFormData>({
//     title: "",
//     description: "",
//     location: {
//       city: "",
//       address: "",
//     },
//     price: 0,
//     type: "Eco-Standing",
//     status: "Prêt et Ouvert",
//     features: {
//       greenSpace: false,
//       gym: false,
//       market: false,
//       cafe: false,
//       restaurants: false,
//       parking: false,
//       security: false,
//       swimmingPool: false,
//       playground: false,
//     },
//     specifications: {
//       bedrooms: 0,
//       bathrooms: 0,
//       area: 0,
//       floors: 0,
//     },
//     responsable: "",
//   });

//   useEffect(() => {
//     const fetchResponsables = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "http://localhost:5000/api/users/responsables",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setResponsables(response.data);
//       } catch (err) {
//         setError("Failed to fetch responsables");
//         console.error("Error fetching responsables:", err);
//       }
//     };

//     const fetchProject = async () => {
//       if (id) {
//         try {
//           const token = localStorage.getItem("token");
//           const response = await axios.get(
//             `http://localhost:5000/api/projects/${id}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           setFormData(response.data);
//         } catch (err) {
//           setError("Failed to fetch project");
//           console.error("Error fetching project:", err);
//         }
//       }
//     };

//     fetchResponsables();
//     if (id) {
//       fetchProject();
//     }
//   }, [id]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value, type } = e.target;

//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent as keyof ProjectFormData],
//           [child]:
//             type === "checkbox"
//               ? (e.target as HTMLInputElement).checked
//               : value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === "number" ? Number(value) : value,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (id) {
//         await axios.put(`http://localhost:5000/api/projects/${id}`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         await axios.post("http://localhost:5000/api/projects", formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }
//       navigate("/admin/projects");
//     } catch (err) {
//       setError("Failed to save project");
//       console.error("Error saving project:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="p-6">
//         <h1 className="text-2xl font-semibold mb-6">
//           {id ? "Edit Project" : "Create New Project"}
//         </h1>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Type
//               </label>
//               <select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               >
//                 <option value="Eco-Standing">Eco-Standing</option>
//                 <option value="Moyen-Standing">Moyen-Standing</option>
//                 <option value="Haut-Standing">Haut-Standing</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 City
//               </label>
//               <input
//                 type="text"
//                 name="location.city"
//                 value={formData.location.city}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Address
//               </label>
//               <input
//                 type="text"
//                 name="location.address"
//                 value={formData.location.address}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Price
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Status
//               </label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               >
//                 <option value="Prêt et Ouvert">Prêt et Ouvert</option>
//                 <option value="En construction">En construction</option>
//                 <option value="fermer">Fermer</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Responsable
//               </label>
//               <select
//                 name="responsable"
//                 value={formData.responsable}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               >
//                 <option value="">Select Responsable</option>
//                 {responsables.map((user) => (
//                   <option key={user._id} value={user._id}>
//                     {user.firstName} {user.lastName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               rows={4}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Specifications
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Bedrooms
//                   </label>
//                   <input
//                     type="number"
//                     name="specifications.bedrooms"
//                     value={formData.specifications.bedrooms}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Bathrooms
//                   </label>
//                   <input
//                     type="number"
//                     name="specifications.bathrooms"
//                     value={formData.specifications.bathrooms}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Area (m²)
//                   </label>
//                   <input
//                     type="number"
//                     name="specifications.area"
//                     value={formData.specifications.area}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Floors
//                   </label>
//                   <input
//                     type="number"
//                     name="specifications.floors"
//                     value={formData.specifications.floors}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Features
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {Object.entries(formData.features).map(([key, value]) => (
//                   <div key={key} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name={`features.${key}`}
//                       checked={value}
//                       onChange={handleChange}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label className="ml-2 block text-sm text-gray-900">
//                       {key.charAt(0).toUpperCase() + key.slice(1)}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={() => navigate("/admin/projects")}
//               className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               {loading ? "Saving..." : id ? "Update Project" : "Create Project"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </AdminLayout>
//   );
// };

// export default ProjectForm;
