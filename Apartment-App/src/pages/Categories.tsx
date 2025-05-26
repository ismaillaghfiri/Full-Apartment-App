import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/public/Navbar';

const Categories: React.FC = () => {
  const propertyTypes = [
    {
      id: 1,
      title: 'Apartments',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      count: 150
    },
    {
      id: 2,
      title: 'Houses',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
      count: 85
    },
    {
      id: 3,
      title: 'Villas',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      count: 45
    },
    {
      id: 4,
      title: 'Commercial',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
      count: 60
    }
  ];

  const standingCategories = [
    {
      id: 1,
      title: 'Haut Standing',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      description: 'Luxury properties with premium amenities and exclusive locations',
      count: 35
    },
    {
      id: 2,
      title: 'Moyen Standing',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      description: 'Quality properties with good amenities and convenient locations',
      count: 120
    },
    {
      id: 3,
      title: 'Eco Standing',
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
      description: 'Sustainable and energy-efficient properties with modern design',
      count: 75
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20">
        {/* Property Types Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Types</h1>
              <p className="text-xl text-gray-600 mb-12">Explore our wide range of real estate options</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {propertyTypes.map((category) => (
                <Link 
                  to={`/projects?category=${category.title.toLowerCase()}`}
                  key={category.id}
                  className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="object-cover w-full h-64"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-semibold text-white mb-2">{category.title}</h3>
                        <p className="text-white/80">{category.count} properties</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Standing Categories Section */}
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Property Standing</h2>
              <p className="text-xl text-gray-600 mb-12">Discover properties based on their standing and quality</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {standingCategories.map((category) => (
                <Link 
                  to={`/projects?standing=${category.title.toLowerCase().replace(' ', '-')}`}
                  key={category.id}
                  className="group relative overflow-hidden rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="object-cover w-full h-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="text-3xl font-bold text-white mb-3">{category.title}</h3>
                        <p className="text-white/90 mb-4">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">{category.count} properties</span>
                          <span className="text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
                            View Properties →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories; 