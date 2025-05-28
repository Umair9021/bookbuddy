"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import books from "@/app/bookdata";
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

const navigation = [
  { name: "All Books", href: "/books", current: false, filter: null },
  { name: "First Year", href: "/books", current: false, filter: "laptops" },
  {
    name: "Second Year",
    href: "/books",
    current: false,
    filter: "mens-shirts",
  },
  { name: "Third Year", href: "/books", current: false, filter: "fragrances" },
  // { name: 'Recently Uploaded', href: '/books', current: false, filter: 'recent'},
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ITEMS_PER_PAGE = 16;

export default function AllBooksPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const updatednavigation = navigation.map((item) => ({
    ...item,
    current: item.filter === filter || (!filter && item.filter === null),
  }));

  const filteredbooks = filter
    ? books.filter((book) => {
        if (filter === "laptops") return book.category === "laptops";
        if (filter === "mens-shirts") return book.category === "mens-shirts";
        if (filter === "fragrances") return book.category === "fragrances";
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

  return (
    <>
      <div className="min-h-screen flex flex-col bg-muted">
        <Navbar />
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-15 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
            <h2 className="text-3xl mb-7 font-bold tracking-tight text-gray-900 text-center hover:underline">
              {filter
                ? `${
                    filter === "laptops"
                      ? "Laptops"
                      : filter === "fragrances"
                      ? "Fragrances"
                      : "Mens-Shirts"
                  } Collection`
                : "All Books Collection"}
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

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {currentBooks.map((book) => (
                <div key={book.id} className="group relative">
                  <Link
                    href={{
                      pathname: "/booklayout",
                      query: {
                        id: book.id,
                        title: book.title,
                        price: book.price,
                        description: book.description,
                        image: book.images[0],
                      },
                    }}
                  >
                    <img
                      alt={book.title}
                      src={book.images[0]}
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
                        ${book.price}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

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

        <Footer />
      </div>
    </>
  );
}
