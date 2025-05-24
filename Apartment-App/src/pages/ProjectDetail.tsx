import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  MdSecurity,
  MdSportsGymnastics,
  MdPool,
  MdChildCare,
  MdRestaurant,
  MdLocalCafe,
  MdMosque,
  MdShoppingBag,
  MdPark,
  MdLocalParking
} from "react-icons/md";

interface Project {
  _id: string;
  name: string;
  city: string;
  type: string;
  price: number;
  etat: string;
  numberOfApartments?: number;
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

interface VisitFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState<VisitFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

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

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.date
    ) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    try {
      if (!project?._id) {
        throw new Error("Project ID is required");
      }
      await axios.post(`http://localhost:5000/api/visits`, {
        ...formData,
        project: project._id,
      });
      setFormSuccess("Votre visite a été réservée avec succès !");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        date: "",
      });
    } catch (err) {
      setFormError(
        "Erreur lors de la réservation de la visite. Veuillez réessayer."
      );
    }
  };

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

  // Combine all images (cover + gallery)
  const allImages = [
    ...(project.coverImage && project.coverImage.url
      ? [project.coverImage]
      : []),
    ...(project.galleryImages && Array.isArray(project.galleryImages)
      ? project.galleryImages
      : []),
  ];
  console.log("Gallery Images:", allImages);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section with Cover Image */}
      <div className="relative h-[70vh] mt-16">
        <img
          src={allImages[currentImage]?.url}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
            <div className="text-white">
              <h1 className="text-6xl font-bold mb-4">{project.name}</h1>
              <p className="text-4xl mb-4">{project.city}</p>
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 bg-blue-600 text-white rounded-full">
                  {project.typeStanding || project.type}
                </span>
                <span className="px-4 py-2 bg-green-500 text-white rounded-full">
                  {project.etat}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Price Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Prix</h2>
                  <p className="text-4xl font-bold text-red-600 mt-2">
                    {project.price.toLocaleString()} DHS
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Galerie Photos</h2>
              <div className="relative">
                <img
                  src={allImages[currentImage]?.url}
                  alt={`Project photo ${currentImage + 1}`}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImage((prev) =>
                          prev > 0 ? prev - 1 : allImages.length - 1
                        )
                      }
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
                      aria-label="Previous image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6 text-blue-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImage((prev) =>
                          prev < allImages.length - 1 ? prev + 1 : 0
                        )
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
                      aria-label="Next image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6 text-blue-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </button>
                  </>
                )}
                <div className="flex justify-center mt-4 gap-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-3 h-3 rounded-full border-2 ${
                        currentImage === index
                          ? "bg-blue-600 border-blue-600"
                          : "bg-gray-300 border-gray-400"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Descriptif du projet</h2>
              <p className="text-gray-700 mb-6">{project.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* <h3 className="text-xl font-semibold mb-4">
                    Caractéristiques
                  </h3> */}
                  <ul className="space-y-2">
                    <li>
                      <strong>Type de Standing:</strong>{" "}
                      {project.typeStanding || project.type}
                    </li>
                    <li>
                      <strong>Type de logement:</strong>{" "}
                      {project.typeLogement || "Appartement"}
                    </li>
                    <li>
                      <strong>Type Immeuble:</strong>{" "}
                      {project.typeImmeuble || "R+2"}
                    </li>
                  </ul>
                </div>
                <div>
                  {/* <h3 className="text-xl font-semibold mb-4">Détails</h3> */}
                  <ul className="space-y-2">
                    <li>
                      <strong>Adresse:</strong> {project.city}
                    </li>
                    <li>
                      <strong>Nombre d'appartements:</strong>{" "}
                      {project.numberOfApartments}
                    </li>
                    <li>
                      <strong>Statut:</strong> {project.etat}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">Équipements</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(project.features).map(
                  ([key, value]) => {
                    // Map feature keys to their corresponding icons
                    const featureIcons: { [key: string]: JSX.Element | null } = {
                      security: <MdSecurity className="w-6 h-6 text-blue-600" />,
                      gym: <MdSportsGymnastics className="w-6 h-6 text-blue-600" />,
                      swimmingPool: <MdPool className="w-6 h-6 text-blue-600" />,
                      playground: <MdChildCare className="w-6 h-6 text-blue-600" />,
                      restaurant: <MdRestaurant className="w-6 h-6 text-blue-600" />,
                      cafe: <MdLocalCafe className="w-6 h-6 text-blue-600" />,
                      mosque: <MdMosque className="w-6 h-6 text-blue-600" />,
                      shoppingArea: <MdShoppingBag className="w-6 h-6 text-blue-600" />,
                      greenSpaces: <MdPark className="w-6 h-6 text-blue-600" />,
                      parking: <MdLocalParking className="w-6 h-6 text-blue-600" />
                    };

                    const icon = featureIcons[key];

                    return (
                      value && icon && (
                        <div key={key} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {/* Render the dynamic icon */}
                            {icon}
                          </div>
                          <span className="text-gray-700">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                      )
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Visit Reservation Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Réserver une visite</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de visite
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {formError && (
                  <div className="text-red-600 text-sm">{formError}</div>
                )}
                {formSuccess && (
                  <div className="text-green-600 text-sm">{formSuccess}</div>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Réserver maintenant
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
