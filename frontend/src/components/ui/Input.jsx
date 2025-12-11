import React from 'react';

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2 rounded-lg
                  bg-deep-space/50 border border-cyber-purple/50
                  text-light-grey placeholder-medium-grey
                  focus:outline-none focus:ring-2 focus:ring-electric-magenta focus:ring-offset-1 focus:ring-offset-deep-space
                  transition-all duration-200 ease-in-out
                  ${className}`}
      {...props}
    />
  );
};

export default Input;
