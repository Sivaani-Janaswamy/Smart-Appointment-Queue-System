import React from 'react';

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full blur-md opacity-75 animate-pulse bg-gradient-to-r from-electric-magenta to-cyber-purple"></div>
        {/* Actual spinner */}
        <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-t-electric-magenta border-r-cyber-purple border-b-electric-magenta border-l-cyber-purple"></div>
      </div>
      <p className="mt-4 text-ghost-white font-heading text-lg">Loading...</p>
    </div>
  );
};

export default Spinner;
