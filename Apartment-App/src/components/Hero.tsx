import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/hero-bg.jpg')`,
          filter: "brightness(0.9)",
        }}
      />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-8 leading-tight">
              Find the right Home
              <br />
              at the right price
            </h1>
            <Link
              to="/projects"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Discover More
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
    </div>
  );
};

export default Hero;
