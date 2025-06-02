import React from 'react';

const Button = ({ children, variant = 'primary', onClick, disabled, type = 'button' }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50';
    const variants = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        danger: 'bg-red-500 hover:bg-red-600 text-white'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]}`}
        >
            {children}
        </button>
    );
  };
  export default Button