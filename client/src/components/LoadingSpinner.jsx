import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
    </div>
);

export default LoadingSpinner;
