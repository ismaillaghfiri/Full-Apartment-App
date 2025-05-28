// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import heroBg from "../assets/images/hero-bg.jpg";
// import projectsBg from "../assets/images/projects-bg.jpg";
// import logo from "../assets/images/dari-logo.png";

// const Home: React.FC = () => {
//   const navigate = useNavigate();

//   const handleTypeClick = (type: string) => {
//     navigate(`/projects?type=${encodeURIComponent(type)}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       {/* Hero Section */}
//       <div
//         className="relative h-[600px] bg-cover bg-center"
//         style={{ backgroundImage: `url(${heroBg})` }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50">
//           <div className="container mx-auto px-4 h-full flex flex-col justify-center">
//             <h1 className="text-4xl md:text-6xl text-white font-bold mb-6">
//               Find Your Dream Home
//             </h1>
//             <p className="text-xl text-white mb-8">
//               Discover the perfect property in Morocco's most desirable
//               locations
//             </p>
//             <Link
//               to="/projects"
//               className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors inline-block"
//             >
//               Browse Properties
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Project Types Section */}
//       <div className="container mx-auto px-4 py-16">
//         <h2 className="text-3xl font-bold text-center mb-12">
//           Our Project Types
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div
//             onClick={() => handleTypeClick("Eco-Standing")}
//             className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
//           >
//             <div className="p-6">
//               <h3 className="text-xl font-semibold mb-4">Eco-Standing</h3>
//               <p className="text-gray-600">
//                 Affordable and sustainable living spaces starting from 25,000 DH
//               </p>
//             </div>
//           </div>
//           <div
//             onClick={() => handleTypeClick("Moyen-Standing")}
//             className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
//           >
//             <div className="p-6">
//               <h3 className="text-xl font-semibold mb-4">Moyen-Standing</h3>
//               <p className="text-gray-600">
//                 Comfortable living spaces starting from 500,000 DH
//               </p>
//             </div>
//           </div>
//           <div
//             onClick={() => handleTypeClick("Haut-Standing")}
//             className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
//           >
//             <div className="p-6">
//               <h3 className="text-xl font-semibold mb-4">Haut-Standing</h3>
//               <p className="text-gray-600">
//                 Luxury living spaces starting from 1,000,000 DH
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="bg-gray-100 py-16">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Why Choose Us
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h3 className="text-xl font-semibold mb-4">Expert Guidance</h3>
//               <p className="text-gray-600">
//                 Our experienced team will help you find the perfect property
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h3 className="text-xl font-semibold mb-4">Prime Locations</h3>
//               <p className="text-gray-600">
//                 Properties in Morocco's most desirable areas
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h3 className="text-xl font-semibold mb-4">Quality Assurance</h3>
//               <p className="text-gray-600">
//                 We ensure the highest standards in all our properties
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Home;
