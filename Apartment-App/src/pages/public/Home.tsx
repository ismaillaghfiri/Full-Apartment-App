import Navbar from "../../components/public/Navbar";
import Hero from "../../components/public/Hero";
import ProjectTypes from "../../components/public/ProjectTypes";
import Services from "../../components/public/Services";
import Footer from "../../components/public/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProjectTypes />
      <Services />
      <Footer />
    </div>
  );
};

export default Home;
