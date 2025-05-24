"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import books from "@/app/bookdata";
import Link from 'next/link'
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

const ITEMS_PER_PAGE = 16;

export default function AllBooksPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const router = useRouter();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const filteredbooks = filter?books.filter(book=>{
    if(filter === 'laptops') return book.category === 'laptops';
    if(filter === 'mens-shirts') return book.category === 'mens-shirts';
    if(filter === 'fragrances') return book.category === 'fragrances';
    return true;
  }):books;


  // Calculate total pages
  const totalPages = Math.ceil(filteredbooks.length / ITEMS_PER_PAGE);

  // Get current page items
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = filteredbooks.slice(startIndex, endIndex);

  // Handle page change with URL update because it does not do full page load
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.push(`/books?${params.toString()}`, { scroll: false });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Adjust based on your design

    // Always include first page
    pages.push(1);

    // Calculate start and end of visible range
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if we're near the start or end
    if (currentPage <= 3) {
      end = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      start = Math.max(totalPages - 3, 2);
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('ellipsis-left');
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis-right');
    }

    // Always include last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-15 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
          <h2 className="text-3xl mb-7 font-bold tracking-tight text-gray-900 text-center hover:underline">
            {
              filter? `${filter === 'laptops' ? 'Laptops' :
                filter === 'fragrances' ? 'Fragrances' :
                'Mens-Shirts'} Collection`
              : 'All Books Collection'
          }
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {currentBooks.map((book) => (
              <div key={book.id} className="group relative">
                <img
                  alt={book.title}
                  src={book.images[0]}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/books/${book.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {book.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{book.brand}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${book.price}
                  </p>
                </div>
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
            if (page === 'ellipsis-left' || page === 'ellipsis-right') {
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
  );
}