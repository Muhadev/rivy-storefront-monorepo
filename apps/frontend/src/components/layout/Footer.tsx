import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-bold text-green-400"
            >
              <Leaf className="h-6 w-6" />
              <span>Rivy</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Leading the clean energy revolution with innovative solar panels, batteries, 
              inverters, and wind turbines. Building a sustainable future for generations to come.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=1" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Solar Panels
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=2" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Batteries
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=3" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Inverters
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/help" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link 
                  to="/warranty" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Clean Energy Ave, Eco City, EC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  support@rivy.com
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
              <p className="text-gray-400 text-xs mb-3">
                Stay updated with our latest products and offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:border-green-400 text-white"
                />
                <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-r-md hover:bg-green-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Rivy Clean Energy. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              to="/privacy" 
              className="text-gray-400 hover:text-green-400 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-400 hover:text-green-400 text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              to="/cookies" 
              className="text-gray-400 hover:text-green-400 text-sm transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}