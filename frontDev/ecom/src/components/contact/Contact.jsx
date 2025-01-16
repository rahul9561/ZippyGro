import React from 'react';

const ContactUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Contact Us</h1>

        {/* Intro Section */}
        <p className="text-center text-gray-600 mb-8">
          We’d love to hear from you! Reach out to us via the form below or the provided contact details.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Feel free to contact us directly for any inquiries or support.
            </p>
            <ul className="space-y-4">
              <li>
                <span className="font-bold">Phone:</span> +91 12345 67890
              </li>
              <li>
                <span className="font-bold">Email:</span> contact@company.com
              </li>
              <li>
                <span className="font-bold">Address:</span> 123 Business Street, Bhubaneswar, India
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
            <form className="space-y-4" method='post'>
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  id="name"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:outline-none p-2"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full border-solid border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:outline-none p-2"
                  placeholder="Enter your email"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="message">
                  Your Message
                </label>
                <textarea
                  id="message"
                  className="w-full border-solid border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-500 focus:outline-none p-2"
                  placeholder="Write your message"
                  rows="4" required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
