import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">About Us</h1>

        {/* Section 1 - Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            We are a passionate team dedicated to delivering innovative solutions to our customers. With a focus on quality, creativity, and collaboration, we strive to exceed expectations and make a meaningful impact in the industry.
          </p>
        </div>

        {/* Section 2 - Vision and Mission */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be a leader in the industry by providing exceptional services and building lasting relationships with our clients.
            </p>
          </div>
          {/* Mission */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To empower businesses by delivering innovative, reliable, and user-friendly solutions that drive success and growth.
            </p>
          </div>
        </div>

        {/* Section 3 - Team */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Meet Our Team</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our team consists of highly skilled professionals from diverse backgrounds who work together to achieve great results.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {/* Team Members */}
            {['John Doe', 'Jane Smith', 'Michael Lee', 'Emily Davis'].map((name, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow p-4 w-40 text-center">
                <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full text-white flex items-center justify-center text-xl font-bold">
                  {name[0]}
                </div>
                <p className="text-gray-800 font-medium mt-2">{name}</p>
                <p className="text-sm text-gray-500">Position</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
