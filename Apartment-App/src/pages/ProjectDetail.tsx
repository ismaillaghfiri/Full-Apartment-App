import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Project {
  _id: string;
  name: string;
  city: string;
  type: string;
  price: number;
  status: string;
  description: string;
  coverImage: {
    url: string;
  };
  galleryImages: Array<{
    url: string;
  }>;
  features: {
    parking: boolean;
    gym: boolean;
    swimmingPool: boolean;
    security: boolean;
    playground: boolean;
    restaurant: boolean;
    cafe: boolean;
    mosque: boolean;
    shoppingArea: boolean;
    greenSpaces: boolean;
  };
  consistance?: string;
  superficieMin?: string;
  superficieMax?: string;
  typeStanding?: string;
  typeLogement?: string;
  typeImmeuble?: string;
  adresseProjet?: string;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/projects/${id}`
        );
        setProject(response.data);
      } catch (err) {
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading project details...</div>
        </div>
        <Footer />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-600">Error: {error}</div>
        </div>
        <Footer />
      </div>
    );

  if (!project)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Project not found</div>
        </div>
        <Footer />
      </div>
    );

  const allImages = [project.coverImage, ...(project.galleryImages || [])];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] mt-16">
        <img
          src={allImages[currentImage]?.url}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
            <div className="text-white">
              <h1 className="text-6xl font-bold mb-4">{project.name}</h1>
              <p className="text-4xl">{project.city}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">{project.city}</h2>
            <div className="text-right">
              <p className="text-sm mb-1">à partir de</p>
              <p className="text-4xl font-bold text-red-600">
                {project.price.toLocaleString()} DHS
              </p>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <h3 className="text-2xl mr-4">{project.name}</h3>
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
              {project.status}
            </span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Photos Réelles de Nos Appartements
          </h2>
          <div className="relative">
            <img
              src={allImages[currentImage]?.url}
              alt="Current"
              className="w-full h-[500px] object-cover rounded-lg"
            />
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev > 0 ? prev - 1 : allImages.length - 1
                )
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
            >
              ←
            </button>
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev < allImages.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
            >
              →
            </button>
            <div className="flex justify-center mt-4 gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full ${
                    currentImage === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Descriptif du projet :</h2>
          <p className="text-gray-700 mb-6">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p>
                <strong>Type de Standing:</strong>{" "}
                {project.typeStanding || project.type}
              </p>
              <p>
                <strong>Type de logement:</strong>{" "}
                {project.typeLogement || "Appartement"}
              </p>
              <p>
                <strong>Type Immeuble:</strong> {project.typeImmeuble || "R+2"}
              </p>
              <p>
                <strong>Superficie min:</strong> {project.superficieMin || "91"}{" "}
                m²
              </p>
              <p>
                <strong>Superficie max:</strong>{" "}
                {project.superficieMax || "140"} m²
              </p>
            </div>
            <div>
              <p>
                <strong>Consistance:</strong>{" "}
                {project.consistance ||
                  "Grand salon, 2 à 3 chambres, Cuisine équipée, 2 salles de bain, WC, balcons et grande terrasse"}
              </p>
              <p>
                <strong>Adresse du projet:</strong>{" "}
                {project.adresseProjet || "Avenue Mohammed VI - Agdal"}
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Equipements du projet :</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(project.features).map(
              ([key, value]) =>
                value && (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
