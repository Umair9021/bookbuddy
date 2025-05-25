// components/ProductLayout.tsx
'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';


export default function ProductLayout() {

  const searchParams =useSearchParams();

  const books = {
    id: searchParams.get('id'),
    title: searchParams.get('title'),
    price: searchParams.get('price'),
    description: searchParams.get('description'),
    image: searchParams.get('image') || '/img.jfif',
    
  }
  const addToCart = () => {
    alert(`Added Zip Tote Basket to your bag!`);
  };

  const bookCondition = 'Like New'; // Example condition
  const bookCategory = 'Fiction / Fantasy';

  return (
    <div className="min-h-screen flex flex-col bg-muted">
          <Navbar />
    <div className=" max-w-7xl mx-auto ml-80 px-4 py-12 ">
      <div className=" flex flex-col justify-center md:flex-row gap-6">
        {/* Image Gallery - Left Side */}
        <div className="md:w-100">
          <div className="bg-gray-100 border border-gray-100 rounded-lg overflow-hidden">
            <Image
              src={books.image} // Replace with your actual image path
              alt={bookCategory.title || 'Book image'}
              width={600}
              height={800}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Details - Right Side */}
        <div className="md:w-1/3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{books.title}</h1>
          
          {/* Price and Rating */}
          <div className="mb-4">
            <span className="text-2xl font-semibold text-gray-900">Rs {books.price}</span>
            
            <div className="mt-2 flex items-center">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          
          {/* Product Description */}
          <p className="text-gray-600 mb-6 w-90">{books.description}</p>
          
          {/* Book Condition and Category */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900">Condition:</span>
              <span className="text-gray-600">{bookCondition}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Category:</span>
              <span className="text-gray-600">{bookCategory}</span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="mb-8">
              <button
                onClick={addToCart}
                className="flex-1 bg-blue-600 w-90 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors"
              >
                Add to bag
              </button>
            </div>
          </div> 
        </div>
      </div>
      
      <Footer />
      </div>
  );
}