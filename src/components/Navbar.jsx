import React from 'react';
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-primary text-primary-foreground shadow-md">
      
      {/* Center: Title */}
      <h1 className="flex text-2xl font-bold pl-15">Bookbuddy</h1>
      
      
      {/* Right side: Links */}
      <div className='flex items-center space-x-6'>
         <Button variant="ghost">Buy</Button>
        <Button variant="ghost">Sell</Button>
        <span className="ml-2 flex items-center mr-10">
          <img
            src="/window.svg"
            alt="User DP"
            className="w-8 h-8 rounded-full object-cover border border-white shadow-sm transition-transform duration-150 hover:scale-105 hover:ring-2 hover:ring-primary-foreground"
          />
        </span>
      </div>
    </nav>
  );
} 