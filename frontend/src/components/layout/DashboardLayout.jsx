import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 pt-16" // Adjusted padding for fixed NavBar
      >
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
