
"use client";

import { Search, Upload, BookOpen, MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import images from "@/app/data";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext, 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";


const YearCarousel = ({title,filter }) => {
  return (
     
    <div className="w-full py-5">
      <div className="flex flex-col items-center w-full px-4">
        <h3 className="text-2xl font-bold text-primary mb-4 hover:underline">
          {title}
        </h3>
        <div className="w-full max-w-6xl mx-auto bg-gray-100 rounded-xl shadow-sm p-6">
          <Carousel className="w-full">
            <CarouselContent className="-ml-1">
              {images.map((img, idx) => (
                <CarouselItem
                  key={img.id || idx}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
              {/* View More Card as last item */}
              <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Link href={`/books?filter=${filter}`}>
                    <Card className="hover:shadow-md transition-shadow h-full">
                      <CardContent className="flex aspect-square items-center justify-center p-6 bg-primary/5 hover:bg-primary/10 transition-colors">
                        <div className="text-center">
                          <p className="font-semibold text-lg">View More</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {title}
                          </p>
                          <ChevronRight className="w-6 h-6 mx-auto mt-2 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        {/* Top Section: Welcome + 4 Blocks */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-8 items-stretch">
          {/* Left: Welcome Text */}
          <div className="md:w-2/5 w-full flex flex-col justify-center md:justify-start mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Welcome to BookBuddy
            </h1>
            <p className="text-base text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
              BookBuddy is your trusted marketplace for diploma students.
              Effortlessly sell your old textbooks to fellow learners. Discover
              affordable, quality books from your campus community. Save money,
              reduce waste, and support sustainable learning. Join
              BookBuddy—where every book finds a new home!
            </p>
          </div>
          {/* Right: 4 Large Blocks */}
          <div className="md:w-3/5 w-full flex flex-col">
            <div className="grid grid-cols-2 grid-rows-2 gap-6 h-full min-h-[200px]">
               <Link
                href="/search"
                className="w-50 ml-60 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center"
              >
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-center">
                  Search Any Book
                </h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Find exactly what you need
                </p>
              </Link>

              {/* Upload Book */}
              <Link href="/upload" className="w-50 ml-20 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-center">
                  Upload Book
                </h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Sell your used textbooks
                </p>
              </Link>

              {/* See All Books */}
              <Link
                href="/books"
                className="w-50 ml-60 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center"
              >
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-center">
                  See All Books
                </h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Browse our full collection
                </p>
              </Link>

              <div className="w-50 ml-20 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <MessageSquare className="w-6 h-6 text-primary" />{" "}
                  {/* Changed icon to chat */}
                </div>
                <h3 className="font-semibold text-lg text-center">
                  Start Chatting
                </h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Get instant help or answers
                </p>
              </div>
            </div>
          </div>
        </div>

        <YearCarousel  title="First Year Books" filter="laptops"/>
        <YearCarousel  title="Second Year Books" filter="mens-shirts"/>
        <YearCarousel  title="Third Year Books" filter="fragrances"/>
      </main>
      <Footer />
    </div>
  );
}