import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-primary text-primary-foreground shadow-md">
      
      {/* Center: Title */}
      <Link href="/" className="flex text-2xl font-bold pl-15">Bookbuddy</Link>
      
      
      {/* Right side: Links */}
      <div className='flex items-center space-x-4'>
         <Button variant="ghost">Buy</Button>
        <Button variant="ghost">Sell</Button>
        <span className="ml-2 flex items-center mr-10">
          <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
          {/* <img
            src="/window.svg"
            alt="User DP"
            className="w-8 h-8 rounded-full object-cover border border-white shadow-sm transition-transform duration-150 hover:scale-105 hover:ring-2 hover:ring-primary-foreground"
          /> */}
        </span>
      </div>
    </nav>
  );
} 