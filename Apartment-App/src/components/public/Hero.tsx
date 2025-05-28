import { Link } from "react-router-dom";
import heroImage from "../../assets/images/herosection-bg.jpg";

const Hero = () => {
  return (
    <div className=" h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
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
    </div>
  );
};

export default Hero;
