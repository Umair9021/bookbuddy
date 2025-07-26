
"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import getImageSrc from '@/utils/getImageSrc';
import React, { useEffect, useState } from "react";

export default function ProductLayout() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [book, setbook] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/books/${id}`)
        .then((res) => res.json())
        .then((data) => setbook(data))
        .catch((err) => console.error("Failed to fetch book", err));
    }
  }, [id]);

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <Navbar />
        <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center space-y-6">
            {/* Circular Progress */}
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-indigo-600"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  style={{
                    animation: 'spin 2s linear infinite'
                  }}
                />
              </svg>
              {/* BookBuddy Icon in Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">BookBuddy</h3>
              <p className="text-gray-600">Loading your data...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <div className=" max-w-7xl mx-auto ml-50 px-4 py-12 ">
        <div className=" flex flex-col justify-center md:flex-row gap-6">
          {/* Image Gallery - Left Side */}
          <div className="md:w-100">
            <div className="bg-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              <Image
                src={getImageSrc(book?.pictures[0])}
                alt={book.title || "Book image"}
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
              {book.title}
            </h1>

            {/* Price and Rating */}
            <div className="mb-4">
              <span className="text-2xl font-semibold text-gray-900">
                Rs {book.price}$
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
            <p className="text-gray-600 mb-6 w-90">{book.description}</p>

            {/* Book Condition and Category */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Condition
                </h3>
                <p className="text-lg font-medium text-gray-800 flex items-center">
                  {book.condition}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Category
                </h3>
                <p className="text-lg w-70 font-medium text-gray-800 flex items-center">
                  {book.category}
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
