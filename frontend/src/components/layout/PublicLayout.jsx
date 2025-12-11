import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-heading font-bold text-electric-magenta drop-shadow-[0_0_8px_rgba(240,0,184,0.6)]" // Neon glow effect
        >
          SMART QUEUE
        </motion.h1>
      </header>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative w-full max-w-lg mx-auto p-6 md:p-8 rounded-xl
                   bg-deep-space/30 border border-cyber-purple/50 backdrop-blur-sm
                   shadow-2xl shadow-cyber-purple/30
                   flex flex-col items-center justify-center space-y-6"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default PublicLayout;
