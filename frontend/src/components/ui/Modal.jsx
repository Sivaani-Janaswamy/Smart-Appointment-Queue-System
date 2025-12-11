import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-deep-space/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" // Darker, blurred backdrop
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-deep-space/40 rounded-xl border border-cyber-purple/50
                       shadow-2xl shadow-electric-magenta/50 w-full max-w-md p-6
                       text-light-grey" // Glassmorphism and glow for modal content
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-heading text-ghost-white">{title}</h2> {/* Updated title style */}
              <button
                onClick={onClose}
                className="text-medium-grey hover:text-ghost-white transition-colors duration-200"
              >
                <IoClose size={28} /> {/* Slightly larger close icon */}
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
