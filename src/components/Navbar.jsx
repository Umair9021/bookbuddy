import React from 'react';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-primary text-primary-foreground shadow-md">
      <div className="flex text-2xl font-bold pl-15">Bookbuddy</div>
      <div className='flex items-center space-x-6'>
        <a href="#" className="hover:underline">Sell</a>
        <a href="#" className="hover:underline">Buy</a>
        <span className="ml-2 flex items-center mr-10">
          <img
            src="/placeholder.png"
            alt="User DP"
            className="w-8 h-8 rounded-full object-cover border border-white shadow-sm transition-transform duration-150 hover:scale-105 hover:ring-2 hover:ring-primary-foreground"
          />
        </span>
      </div>
    </nav>
  );
} 