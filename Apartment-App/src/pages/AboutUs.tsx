import React from 'react';
import Navbar from '../components/public/Navbar';

const AboutUs: React.FC = () => {
  const stats = [
    { number: '15+', label: 'Years Experience' },
    { number: '1000+', label: 'Properties Sold' },
    { number: '500+', label: 'Happy Clients' },
    { number: '50+', label: 'Team Members' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative h-[60vh] bg-gray-900">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
              alt="Real Estate Office"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About Our Company
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl">
              We are dedicated to providing exceptional real estate services and helping our clients find their perfect property.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center transform transition-all duration-300 hover:scale-105">
                  <div className="text-4xl font-bold text-blue-600">{stat.number}</div>
                  <div className="mt-2 text-lg text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  Our mission is to provide exceptional real estate services while maintaining the highest standards of professionalism and integrity. We strive to understand our clients' needs and exceed their expectations in every transaction.
                </p>
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Expert Market Knowledge</h4>
                        <p className="mt-1 text-gray-600">Deep understanding of local real estate markets and trends</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Personalized Service</h4>
                        <p className="mt-1 text-gray-600">Tailored approach to meet your specific needs and preferences</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Extensive Portfolio</h4>
                        <p className="mt-1 text-gray-600">Wide range of properties to choose from across different categories</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 lg:mt-0">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
                    alt="Our Team"
                    className="rounded-xl shadow-xl w-full h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Our Professional Team</h3>
                    <p className="text-white/90">Dedicated experts committed to your real estate success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-blue-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-600">We conduct our business with honesty, transparency, and ethical practices.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-blue-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600">We strive for excellence in every aspect of our service delivery.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="bg-blue-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Client Focus</h3>
                <p className="text-gray-600">We put our clients' needs first and build lasting relationships.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 