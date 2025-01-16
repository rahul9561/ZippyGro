import { Link } from "react-router-dom";
import Logo from '../assets/sec-logonew.png'
const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-8 mt-5">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-400 text-sm">
              Your trusted e-commerce platform for quality products and exceptional services. We bring the best to you.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-green-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to='/shop'>
                  Shop
                </Link>
                
              </li>
              <li>
                <Link to="/about" className="hover:text-green-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
  
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-green-500">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
  
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for updates on new arrivals and exclusive deals.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full py-2 px-3 rounded-l-lg focus:outline-none"
              />
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-r-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
  
        <div className="border-t border-gray-700 mt-8 py-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 px-6">
            <p className="text-xl flex">© 2024   <img src={Logo} alt="" style={{height:"35px"}} />. All Rights Reserved.</p>
      
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  