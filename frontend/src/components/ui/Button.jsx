import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(240, 0, 184, 0.7)" }} // Electric Magenta glow on hover
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`relative inline-flex items-center justify-center
                  px-6 py-3 rounded-lg font-heading text-ghost-white text-lg font-bold
                  bg-gradient-to-r from-electric-magenta to-cyber-purple
                  overflow-hidden group
                  focus:outline-none focus:ring-2 focus:ring-electric-magenta focus:ring-offset-2 focus:ring-offset-deep-space
                  transform transition-all duration-300 ease-out
                  shadow-lg shadow-electric-magenta/30
                  ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
      <span className="absolute inset-0 w-full h-full border-2 border-electric-magenta rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </motion.button>
  );
};

export default Button;
