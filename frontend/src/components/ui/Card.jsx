import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative p-6 rounded-xl border border-cyber-purple/50 bg-deep-space/40 backdrop-blur-sm
                  shadow-xl shadow-cyber-purple/20
                  ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
