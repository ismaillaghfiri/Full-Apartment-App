import { Link } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  image: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg">
      <div
        className="aspect-w-16 aspect-h-9 bg-cover bg-center"
        style={{ backgroundImage: `url(${project.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
        <div className="w-full flex justify-between items-center">
          <h3 className="text-white text-xl font-semibold">{project.title}</h3>
          <Link
            to={`/projects/${project.id}`}
            className="bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
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
  );
};

const ProjectsSection = () => {
  // Sample projects data - replace with actual data from your API
  const projects = [
    {
      id: "1",
      title: "Eco-Standing",
      image: "/eco-standing.jpg",
    },
    {
      id: "2",
      title: "Hout-Standing",
      image: "/hout-standing.jpg",
    },
    {
      id: "3",
      title: "Moyen-Standing",
      image: "/moyen-standing.jpg",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Projects</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
