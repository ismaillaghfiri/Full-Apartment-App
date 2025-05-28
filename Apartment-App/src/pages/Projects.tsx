// import { useState, useMemo } from "react";
// import Navbar from "../components/Navbar";
// import { Link } from "react-router-dom";
// import logo from "../assets/images/dari-logo.png";
// import projectsBg from "../assets/images/projects/projects-bg.jpg";

// // Import project images
// import alyassamine from "../assets/images/projects/alyassamine.jpg";
// import assalam from "../assets/images/projects/assalam.png";
// import massylia from "../assets/images/projects/massylia.jpg";
// import alanbar from "../assets/images/projects/alanbar.jpg";
// import babdoukala from "../assets/images/projects/babdoukala.jpg";
// import riadgarden from "../assets/images/projects/riadgarden.jpg";

// interface Project {
//   id: string;
//   title: string;
//   location: string;
//   price: string;
//   type: string;
//   image: string;
//   status: "available" | "reserved" | "sold";
//   description: string;
// }

// const Projects = () => {
//   const [location, setLocation] = useState("");
//   const [type, setType] = useState("");
//   const [priceRange, setPriceRange] = useState("");

//   const projects: Project[] = [
//     {
//       id: "1",
//       title: "AL YASSAMINE",
//       location: "RABAT",
//       price: "From 530,000 DH",
//       type: "medium",
//       image: alyassamine,
//       status: "available",
//       description: "A beautiful residential complex in the heart of Rabat.",
//     },
//     {
//       id: "2",
//       title: "ASSALAM",
//       location: "AGADIR",
//       price: "From 400,000 DH",
//       type: "economic",
//       image: assalam,
//       status: "available",
//       description: "Affordable housing project with modern amenities.",
//     },
//     {
//       id: "3",
//       title: "MASSYLIA",
//       location: "TANGER",
//       price: "From 850,000 DH",
//       type: "high",
//       image: massylia,
//       status: "reserved",
//       description: "Luxury apartments with panoramic views of the ocean.",
//     },
//     {
//       id: "4",
//       title: "AL ANBAR",
//       location: "MARRAKECH",
//       price: "From 1,370,000 DH",
//       type: "high",
//       image: alanbar,
//       status: "available",
//       description: "Premium residences in the prestigious Gueliz district.",
//     },
//     {
//       id: "5",
//       title: "BAB DOUKALA",
//       location: "SIDI RAHAL",
//       price: "From 1,500,000 DH",
//       type: "high",
//       image: babdoukala,
//       status: "sold",
//       description: "Exclusive villas with private gardens and pools.",
//     },
//     {
//       id: "6",
//       title: "RIAD GARDEN",
//       location: "RABAT",
//       price: "From 530,000 DH",
//       type: "medium",
//       image: riadgarden,
//       status: "available",
//       description: "Modern apartments surrounded by lush gardens.",
//     },
//   ];

//   const filteredProjects = useMemo(() => {
//     return projects.filter((project) => {
//       // Location filter
//       if (
//         location &&
//         project.location.toLowerCase() !== location.toLowerCase()
//       ) {
//         return false;
//       }

//       // Type filter
//       if (type && project.type !== type) {
//         return false;
//       }

//       // Price range filter
//       if (priceRange) {
//         const price = parseInt(project.price.replace(/[^0-9]/g, ""));
//         const [min, max] = priceRange.split("-").map(Number);
//         if (max) {
//           if (price < min || price > max) {
//             return false;
//           }
//         } else {
//           // For "1500000+" case
//           if (price < min) {
//             return false;
//           }
//         }
//       }

//       return true;
//     });
//   }, [projects, location, type, priceRange]);

//   return (
//     <div className="min-h-screen">
//       <Navbar />

//       {/* Hero Section with Search Filters */}
//       <section className="relative h-[50vh] bg-gray-900 mt-16">
//         <img
//           src={projectsBg}
//           alt="Projects background"
//           className="w-full h-full object-cover opacity-50"
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/30">
//           <div className="absolute inset-0 flex flex-col items-center justify-center">
//             <div className="text-center text-white px-4 mb-8">
//               <h1 className="text-4xl md:text-5xl font-bold mb-4">
//                 Our Projects
//               </h1>
//               <p className="text-xl text-gray-200">
//                 Find your perfect home from our carefully selected projects
//               </p>
//             </div>

//             {/* Search Filters */}
//             <div className="w-full max-w-5xl mx-auto px-4">
//               <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Location
//                   </label>
//                   <select
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value="">All Locations</option>
//                     <option value="rabat">Rabat</option>
//                     <option value="agadir">Agadir</option>
//                     <option value="tanger">Tanger</option>
//                     <option value="marrakech">Marrakech</option>
//                     <option value="temara">Temara</option>
//                     <option value="sidi rahal">Sidi Rahal</option>
//                   </select>
//                 </div>

<<<<<<< HEAD
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="economic">Economic Standing</option>
                    <option value="medium">Medium Standing</option>
                    <option value="high">High Standing</option>
                  </select>
                </div>
=======
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Type
//                   </label>
//                   <select
//                     value={type}
//                     onChange={(e) => setType(e.target.value)}
//                     className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value="">All Types</option>
//                     <option value="economic">Economic</option>
//                     <option value="medium">Medium Standing</option>
//                     <option value="high">High Standing</option>
//                   </select>
//                 </div>
>>>>>>> 3967f37501f28bc54b53ddd0bfffe186cb9efc0a

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Price Range
//                   </label>
//                   <select
//                     value={priceRange}
//                     onChange={(e) => setPriceRange(e.target.value)}
//                     className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value="">Any Price</option>
//                     <option value="0-500000">Up to 500,000 DH</option>
//                     <option value="500000-1000000">
//                       500,000 - 1,000,000 DH
//                     </option>
//                     <option value="1000000-1500000">
//                       1,000,000 - 1,500,000 DH
//                     </option>
//                     <option value="1500000">Above 1,500,000 DH</option>
//                   </select>
//                 </div>

//                 <button
//                   onClick={() => {}}
//                   className="bg-blue-600 text-white h-[42px] mt-auto rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Search
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Projects Grid */}
//       <section className="py-16 px-4 md:px-8">
//         <div className="max-w-7xl mx-auto">
//           {filteredProjects.length === 0 ? (
//             <div className="text-center py-12">
//               <h3 className="text-2xl font-semibold text-gray-900 mb-4">
//                 No Projects Found
//               </h3>
//               <p className="text-gray-600">
//                 Try adjusting your filters to find more projects.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {filteredProjects.map((project) => (
//                 <div
//                   key={project.id}
//                   className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
//                 >
//                   <div className="relative h-64">
//                     <img
//                       src={project.image}
//                       alt={project.title}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   </div>
//                   <div className="p-6">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-900 mb-1">
//                           {project.title}
//                         </h3>
//                         <p className="text-gray-600">{project.location}</p>
//                       </div>
//                       <p className="text-blue-600 font-semibold">
//                         {project.price}
//                       </p>
//                     </div>
//                     <Link
//                       to={`/projects/${project.id}`}
//                       className="block w-full text-center bg-gray-100 text-blue-600 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
//                     >
//                       Learn More
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 md:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             {/* Logo and Description */}
//             <div className="col-span-1">
//               <div className="flex items-center gap-2 mb-4">
//                 <img src={logo} alt="DARI Logo" className="h-8" />
//               </div>
//               <p className="text-gray-400">
//                 We help you find your Dream House at the best price in the best
//                 locations across Morocco.
//               </p>
//               <div className="mt-6 flex gap-4">
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   <svg
//                     className="h-6 w-6"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                   </svg>
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   <svg
//                     className="h-6 w-6"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
//                   </svg>
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   <svg
//                     className="h-6 w-6"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
//                   </svg>
//                 </a>
//               </div>
//             </div>

//             {/* Navigation */}
//             <div>
//               <h4 className="text-lg font-semibold mb-4">Navigation</h4>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     to="/about"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     About Us
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/blog"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     Blog
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/terms"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     Terms of Use
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/privacy"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     Privacy Policy
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Featured Locations */}
//             <div>
//               <h4 className="text-lg font-semibold mb-4">Featured Locations</h4>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     to="/projects?location=kenitra"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     Kenitra
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/projects?location=rabat"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     Rabat
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/projects?location=casablanca"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     Casablanca
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/projects?location=sale"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     Salé
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/projects?location=temara"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     Témara
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Help */}
//             <div>
//               <h4 className="text-lg font-semibold mb-4">Help</h4>
//               <ul className="space-y-2">
//                 <li>
//                   <Link
//                     to="/faq"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     FAQ
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/contact"
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     Contact Us
//                   </Link>
//                 </li>
//               </ul>
//               <div className="mt-6">
//                 <h4 className="text-lg font-semibold mb-4">
//                   Subscribe to Our Newsletter
//                 </h4>
//                 <div className="flex">
//                   <input
//                     type="email"
//                     placeholder="Email Address"
//                     className="flex-1 px-4 py-2 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <button className="bg-blue-600 px-6 py-2 rounded-r-md hover:bg-blue-700 transition-colors">
//                     Subscribe
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
//             <p>&copy; 2024 DARI. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Projects;
