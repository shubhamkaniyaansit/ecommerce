import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="pt-12 bg-black text-white  pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ecommerce</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop shop for all your fashion needs. Quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary">
                <FaFacebookF />
              </a>
              <a href="#" className="text-white hover:text-primary">
                <FaTwitter />
              </a>
              <a href="#" className="text-white hover:text-primary">
                <FaInstagram />
              </a>
              <a href="#" className="text-white hover:text-primary">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-primary">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-primary">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-300 hover:text-primary">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to get updates on our latest offers!
            </p>
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-white text-black px-4 py-2 rounded-r hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="text-gray-300 text-sm">
              Contact us: info@ecommerce.com
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Ecommerce Clone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;