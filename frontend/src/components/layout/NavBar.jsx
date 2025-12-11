import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { FaUserCircle, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import Button from '../ui/Button'; // Assuming this Button component is used for some actions, not the nav links themselves.
import { motion } from 'framer-motion';

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useThemeStore();
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="text-medium-grey hover:text-electric-magenta transition-colors duration-200"
        >
            {theme === 'light' ? <FaMoon size={22}/> : <FaSun size={22} />}
        </motion.button>
    )
}

const NavBar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-40
                 bg-deep-space/60 backdrop-blur-md border-b border-cyber-purple/50
                 shadow-xl shadow-cyber-purple/20 py-3" // Adjusted padding here for overall height
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-3xl font-heading font-bold text-electric-magenta
                                          drop-shadow-[0_0_5px_rgba(240,0,184,0.7)]">
              SMART QUEUE
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-light-grey font-body text-md">Welcome, {user?.name || 'Guest'}</span>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-light-grey hover:text-electric-magenta font-body text-md transition-colors duration-200">
                Admin Panel
              </Link>
            )}
            <ThemeToggleButton />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="flex items-center text-medium-grey hover:text-electric-magenta transition-colors duration-200"
              title="Logout"
            >
              <FaSignOutAlt size={22} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
