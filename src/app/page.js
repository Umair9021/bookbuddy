'use client';

import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import images from './data';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const books = useSelector((state) => state.books.books);

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        {/* Top Section: Welcome + 4 Blocks */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-8 items-stretch">
          {/* Left: Welcome Text */}
          <div className="md:w-2/5 w-full flex flex-col justify-center md:justify-start mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Welcome to BookBuddy</h1>
            <p className="text-base text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
              BookBuddy is your trusted marketplace for diploma students.
              Effortlessly sell your old textbooks to fellow learners.
              Discover affordable, quality books from your campus community.
              Save money, reduce waste, and support sustainable learning.
              Join BookBuddy—where every book finds a new home!
            </p>
          </div>
          {/* Right: 4 Large Blocks */}
          <div className="md:w-3/5 w-full flex flex-col ">
            <div className="grid grid-cols-2 grid-rows-2 gap-6 h-full min-h-[200px]">
              <div className="ml-50 bg-white rounded-xl shadow-lg flex items-center justify-center font-semibold text-base min-h-[70px] md:min-h-[90px] lg:min-h-[100px] px-2 max-w-xs w-3/5 mx-auto transition-all">Block 1</div>
              <div className="bg-white rounded-xl shadow-lg flex items-center justify-center font-semibold text-base min-h-[70px] md:min-h-[90px] lg:min-h-[100px] px-2 max-w-xs w-3/5 mx-auto transition-all">Block 2</div>
              <div className="ml-50 bg-white rounded-xl shadow-lg flex items-center justify-center font-semibold text-base min-h-[70px] md:min-h-[90px] lg:min-h-[100px] px-2 max-w-xs w-3/5 mx-auto transition-all">Block 3</div>
              <div className="bg-white rounded-xl shadow-lg flex items-center justify-center font-semibold text-base min-h-[70px] md:min-h-[90px] lg:min-h-[100px] px-2 max-w-xs w-3/5 mx-auto transition-all">Block 4</div>
            </div>
          </div>
        </div>
        {/* Centered Big Boxes Section */}
        <div className="flex flex-col items-center mt-18">
          <div className="flex flex-col md:flex-row w-full justify-around">
            {/* First Carousel with Heading */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold text-primary mb-4 hover:underline">First Year Books</h3>
              <Carousel className="w-full md:w-96 h-48 max-w-xs relative">
                <CarouselContent>
                  {images.map((img, idx) => (
                    <CarouselItem key={img.id || idx} className="h-full flex items-center justify-center p-0">
                      <Card className="w-full h-full flex items-center justify-center">
                        <CardContent className="flex items-center justify-center w-full h-full p-0">
                          <img src={img.url} alt={img.title} className="w-full h-full object-cover rounded" />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute left-4 top-[60%] -translate-y-1/2 z-10">
                  <CarouselPrevious />
                </div>
                <div className="absolute right-4 top-[60%] -translate-y-1/2 z-10">
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
            {/* Second Carousel with Heading */}
            <div className="flex flex-col items-center">
               <h3 className="text-xl font-semibold text-primary mb-4 hover:underline">Second Year Books</h3>
              <Carousel className="w-full md:w-96 h-48 max-w-xs relative">
                <CarouselContent>
                  {images.map((img, idx) => (
                    <CarouselItem key={img.id || idx} className="h-full flex items-center justify-center p-0">
                      <Card className="w-full h-full flex items-center justify-center">
                        <CardContent className="flex items-center justify-center w-full h-full p-0">
                          <img src={img.url} alt={img.title} className="w-full h-full object-cover rounded" />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute left-4 top-[60%] -translate-y-1/2 z-10">
                  <CarouselPrevious />
                </div>
                <div className="absolute right-4 top-[60%] -translate-y-1/2 z-10">
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
            {/* Third Carousel with Heading */}
            <div className="flex flex-col items-center">
               <h3 className="text-xl font-semibold text-primary mb-4 hover:underline">Third Year Books</h3>
              <Carousel className="w-full md:w-96 h-48 max-w-xs relative">
                <CarouselContent>
                  {images.map((img, idx) => (
                    <CarouselItem key={img.id || idx} className="h-full flex items-center justify-center p-0">
                      <Card className="w-full h-full flex items-center justify-center">
                        <CardContent className="flex items-center justify-center w-full h-full p-0">
                          <img src={img.url} alt={img.title} className="w-full h-full object-cover rounded" />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute left-4 top-[60%] -translate-y-1/2 z-10">
                  <CarouselPrevious />
                </div>
                <div className="absolute right-4 top-[60%] -translate-y-1/2 z-10">
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
