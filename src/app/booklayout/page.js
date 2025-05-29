
"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";

export default function ProductLayout() {
  const searchParams = useSearchParams();

  const books = {
    id: searchParams.get("id"),
    title: searchParams.get("title"),
    price: searchParams.get("price"),
    description: searchParams.get("description"),
    image: searchParams.get("image") || "/img.jfif",
  };

  const bookCondition = "Good";
  const bookCategory = "First Year Book";

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <div className=" max-w-7xl mx-auto ml-50 px-4 py-12 ">
        <div className=" flex flex-col justify-center md:flex-row gap-6">
          {/* Image Gallery - Left Side */}
          <div className="md:w-100">
            <div className="bg-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              <Image
                src={books.image} 
                alt={bookCategory.title || "Book image"}
                width={600}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>

          {/* Book Details - Right Side */}
          <div className="md:w-1/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {books.title}
            </h1>

            {/* Price and Rating */}
            <div className="mb-4">
              <span className="text-2xl font-semibold text-gray-900">
                Rs {books.price}
              </span>

              <div className="mt-2 flex items-center">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </div>

            {/* Book Description */}
            <p className="text-gray-600 mb-6 w-90">{books.description}</p>

            {/* Book Condition and Category */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Condition
                </h3>
                <p className="text-lg font-medium text-gray-800 flex items-center">
                  {bookCondition}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Category
                </h3>
                <p className="text-lg w-70 font-medium text-gray-800 flex items-center">
                  {bookCategory}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <button
                className="flex-1 bg-blue-600 w-40 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors"
              >
                Chat with Owner
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
