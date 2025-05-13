// Add a reusable Input component
import React from 'react';

const Input = ({ label, name, type = 'text', value, handleChange, required }) => {
    return (
        <div className="mb-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                required={required}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>
    );
};

export default Input;