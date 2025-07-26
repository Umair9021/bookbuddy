"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import getImageSrc from '@/utils/getImageSrc';

const navigation = [
  { name: "All Books", href: "/books", current: false, filter: null },
  { name: "First Year", href: "/books", current: false, filter: "First Year" },
  { name: "Second Year", href: "/books", current: false, filter: "Second Year" },
  { name: "Third Year", href: "/books", current: false, filter: "Third Year" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ITEMS_PER_PAGE = 16;
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const filterParam = filter ? `?filter=${filter}` : "";
        const response = await fetch(`/api/books${filterParam}`);
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        } else {
          throw new Error(`Failed to fetch books: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [filter]);

  const updatednavigation = navigation.map((item) => ({
    ...item,
    current: item.filter === filter || (!filter && item.filter === null),
  }));

  const filteredbooks = filter
    ? books.filter((book) => {
        if (filter === "First Year") return book.category === "First Year";
        if (filter === "Second Year") return book.category === "Second Year";
        if (filter === "Third Year") return book.category === "Third Year";
        return true;
      })
    : books;

  const totalPages = Math.ceil(filteredbooks.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = filteredbooks.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`/books?${params.toString()}`, { scroll: false });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      end = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      start = Math.max(totalPages - 3, 2);
    }

    if (start > 2) {
      pages.push("ellipsis-left");
    }

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (end < totalPages - 1) {
      pages.push("ellipsis-right");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Loading state
  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <Navbar />
        <div className="bg-white flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Books</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-muted">
        <Navbar />
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-15 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
            <h2 className="text-3xl mb-7 font-bold tracking-tight text-gray-900 text-center hover:underline">
              {filter ? `${filter} Books` : "All Books Collection"}
            </h2>

            <div className="mx-auto ">
              <div className="relative flex h-20 items-center justify-between">
                <div className="hidden md:flex flex-1">
                  <nav className="flex space-x-1 gap-2">
                    {updatednavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={`${item.href}${
                          item.filter ? `?filter=${item.filter}` : ""
                        }`}
                        aria-current={item.current ? "page" : undefined}
                        className={classNames(
                          item.current
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                            : "text-gray-700 bg-gray-100 border border-black-500 hover:bg-gray-200 hover:text-gray-900",
                          "relative px-4 py-2.5 rounded-full  text-sm font-medium transition-all duration-300 ease-in-out",
                          "group overflow-hidden"
                        )}
                      >
                        {/* Animated underline effect for hover */}
                        {item.current && (
                          <span className="absolute inset-x-1 -bottom-px h-0.5 bg-white/80 rounded-full"></span>
                        )}
                        <span className="relative z-10 flex items-center">
                          {item.name}
                          {!item.current && (
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Show message if no books found */}
            {books.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No books found.</p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {currentBooks.map((book) => (
                  <div key={book._id} className="group relative">
                    {/* ✅ FIXED - Simplified link with correct id */}
                    <Link href={`/booklayout?id=${book._id}`}>
                      <img
                        alt={book.title || "Book cover"}
                        src={getImageSrc(book.pictures?.[0] || "")}
                        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                      />

                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">{book.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {book.brand}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Rs {book.price}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Only show pagination if there are books and multiple pages */}
        {books.length > 0 && totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => {
                if (page === "ellipsis-left" || page === "ellipsis-right") {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <Footer />
      </div>
    </>
  );
}