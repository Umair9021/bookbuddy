'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SearchPage() {
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    // Navigate to search results page with query
    router.push(`/search-results?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <form onSubmit={handleSearch} className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search for books by title, author, or ISBN..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
              <button 
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search size={24} />
              </button>
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Search Books
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}