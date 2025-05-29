// components/Footer.jsx
import { BookOpen, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <h3 className="text-xl font-bold">BookBuddy</h3>
            </div>
            <p className="text-primary-foreground/80">
              Your trusted marketplace for diploma students to buy and sell textbooks.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-foreground/80 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-foreground/80 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-foreground/80 transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/search" className="hover:text-primary-foreground/80 transition">Search Books</Link></li>
              <li><Link href="/upload" className="hover:text-primary-foreground/80 transition">Upload Books</Link></li>
              <li><Link href="/#" className="hover:text-primary-foreground/80 transition">Browse All</Link></li>
              <li><Link href="/#" className="hover:text-primary-foreground/80 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <p>support@bookbuddy.edu</p>
                <p className="text-sm text-primary-foreground/80">Typically replies within 24 hours</p>
              </div>
            </div>
            <div className="pt-2">
              <p>123 Campus Drive</p>
              <p>Education City, EC 10101</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Updated</h4>
            <p className="text-primary-foreground/80">
              Subscribe to our newsletter for the latest book arrivals and deals.
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button 
                type="submit" 
                className="bg-white text-primary px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} BookBuddy. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/#" className="text-primary-foreground/60 hover:text-primary-foreground/80 text-sm transition">
              Privacy Policy
            </Link>
            <Link href="/#" className="text-primary-foreground/60 hover:text-primary-foreground/80 text-sm transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}