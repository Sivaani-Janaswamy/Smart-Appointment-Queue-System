import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-2xl text-textSecondary dark:text-gray-300 mt-4">Page Not Found</p>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
