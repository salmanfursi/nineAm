import React from 'react';

export const Input = ({ label, type = 'text', value, onChange, error, placeholder, required }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );