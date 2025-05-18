import React from 'react';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-primary text-primary-foreground shadow-md">
      
      {/* Center: Title */}
      <h1 className="flex text-2xl font-bold pl-15">Bookbuddy</h1>
      
      {/* Left side: Search Bar */}
      <div className="flex items-center mr-150">
        <input
          type="text"
          placeholder="Search books..."
          className="w-104 px-4 py-2 rounded-md text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Right side: Links */}
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