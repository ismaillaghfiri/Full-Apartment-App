import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/public/Navbar";

const Categories: React.FC = () => {
  const propertyTypes = [
    {
      id: 1,
      title: "Apartments",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      count: 150,
    },
    {
      id: 2,
      title: "Houses",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      count: 85,
    },
    {
      id: 3,
      title: "Villas",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      count: 45,
    },
    {
      id: 4,
      title: "Commercial",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
      count: 60,
    },
  ];

  const projectTypes = [
    {
      id: 1,
      name: "Eco-Standing",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      link: "/projects?type=eco-standing",
    },
    {
      id: 2,
      name: "Haut-Standing",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      link: "/projects?type=haut-standing",
    },
    {
      id: 3,
      name: "Moyen-Standing",
      image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b",
      link: "/projects?type=moyen-standing",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Property Types Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Property Types
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((category) => (
              <Link
                to={`/projects?category=${category.title.toLowerCase()}`}
                key={category.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">{category.count} properties</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Project Types Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">
            Project Standing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectTypes.map((type) => (
              <div
                key={type.id}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 w-full flex justify-between items-center">
                    <h3 className="text-white text-xl font-semibold">
                      {type.name}
                    </h3>
                    <Link
                      to={type.link}
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;
