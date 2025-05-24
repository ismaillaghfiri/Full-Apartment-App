import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import projectsBg from "../../assets/images/projects-bg.jpg";

interface Project {
  _id: string;
  name: string;
  city: string;
  type: string;
  price: number;
  coverImage: {
    url: string;
  };
}

interface Filters {
  location: string;
  type: string;
  priceRange: string;
}

const Projects: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>({
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "",
    priceRange: searchParams.get("priceRange") || "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      filterProjects();
    }
  }, [filters, projects]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      console.log("Fetched projects:", response.data); // Debug log
      setProjects(response.data);
      // Apply filters immediately after fetching projects
      if (filters.type || filters.location || filters.priceRange) {
        filterProjects();
      } else {
        setFilteredProjects(response.data);
      }
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];
    console.log("Current filters:", filters); // Debug log
    console.log("Projects before filtering:", filtered); // Debug log

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(
        (project) =>
          project.city.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter((project) => {
        console.log(
          "Project type:",
          project.type,
          "Filter type:",
          filters.type
        ); // Debug log
        return project.type.toLowerCase() === filters.type.toLowerCase();
      });
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter((project) => {
        if (max) {
          return project.price >= min && project.price <= max;
        } else {
          return project.price >= min;
        }
      });
    }

    console.log("Filtered projects:", filtered); // Debug log
    setFilteredProjects(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL parameters
    const params = new URLSearchParams();
    if (filters.location) params.set("location", filters.location);
    if (filters.type) params.set("type", filters.type);
    if (filters.priceRange) params.set("priceRange", filters.priceRange);
    setSearchParams(params);
    filterProjects();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar />

      {/* Hero Section with Search */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${projectsBg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            {/* <h1 className="text-4xl md:text-5xl text-white font-bold mb-8 ">
              Find Your Perfect Home
            </h1> */}

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Location</option>
                    <option value="RABAT">Rabat</option>
                    <option value="AGADIR">Agadir</option>
                    <option value="TANGER">Tanger</option>
                    <option value="MARRAKECH">Marrakech</option>
                    <option value="TEMARA">Temara</option>
                  </select>
                </div>
                <div>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Type</option>
                    <option value="Eco-Standing">Eco-Standing</option>
                    <option value="Moyen-Standing">Moyen-Standing</option>
                    <option value="Haut-Standing">Haut-Standing</option>
                  </select>
                </div>
                <div>
                  <select
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Price Range</option>
                    <option value="25000-500000">25,000 - 500,000 DH</option>
                    <option value="500000-1000000">
                      500,000 - 1,000,000 DH
                    </option>
                    <option value="1000000-999999999">1,000,000+ DH</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className=" mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Projects</h2>
        <div className="mb-8 text-center">
          {filteredProjects.length > 0 && (
            <p className="text-gray-600">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center">Loading projects...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center text-gray-600">
            No projects found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <img
                    src={project.coverImage?.url || "/placeholder.jpg"}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {project.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      {project.city}
                    </div>
                    <div className="text-blue-600 font-semibold">
                      {project.price.toLocaleString()} DH
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Projects;
