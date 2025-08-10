import React from 'react';
import { Button } from './ui/button';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Responsive grid: 1 col on mobile, 2 on sm, 4 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* BookSwap Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">BookSwap</h3>
            <p className="text-gray-400 text-sm">
              The trusted marketplace for diploma students to buy and sell used textbooks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Browse Books
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Sell Books
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  How It Works
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Safety Guidelines
                </Button>
              </li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="font-bold text-lg mb-4">Departments</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Computer Science
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Electrical Engineering
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Civil Engineering
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Mechanical Engineering
                </Button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Help Center
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Contact Us
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Terms of Service
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                  Privacy Policy
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 BookSwap. All rights reserved. Made with ❤️ for diploma students.
          </p>
        </div>
      </div>
    </footer>
  );
}
