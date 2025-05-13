// Add a reusable Button component
import React from 'react';

const Button = ({ label, handleClick, type = 'button', classes, disabled }) => {
    return (
        <button
            type={type}
            onClick={handleClick}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${classes}`}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default Button;