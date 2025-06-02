

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button";
import LoadingSpinner from "../LoadingSpinner";

const ShopPage = ({ shopName }) => {
    const { checkAuth } = useAuth();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                // Get token from cookies or localStorage
                const token = getCookie('token') || localStorage.getItem('authToken');
                console.log('Token found:', token ? 'YES' : 'NO');

                const headers = {
                    'Content-Type': 'application/json',
                };

                // Add Authorization header if token exists
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`http://localhost:5000/api/shop/${shopName}`, {
                    method: 'GET',
                    credentials: 'include', // Still try cookies
                    headers
                });

                console.log('Auth response status for token cockie:', response);

                if (response.ok) {
                    setAuthenticated(true);
                    setError(null);
                } else {
                    setAuthenticated(false);
                    const errorData = await response.json().catch(() => ({}));
                    setError(errorData.message || 'Authentication failed');
                }
            } catch (err) {
                console.error('Auth verification error:', err);
                setAuthenticated(false);
                setError('Network error occurred');
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [shopName]);

    // Helper function to get cookie value
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                        <p className="text-gray-600 mb-6">
                            Please sign in to access this shop
                        </p>
                        {error && (
                            <p className="text-sm text-red-500 mb-4">
                                Error: {error}
                            </p>
                        )}
                        <Button
                            onClick={() => window.location.href = 'http://localhost:5173'}
                            className="w-full"
                        >
                            Go to Main Site
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {shopName} Shop
                        </h1>
                        <Button
                            onClick={() => window.location.href = 'http://localhost:5173'}
                            variant="outline"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            This is {shopName} shop
                        </h2>
                        <p className="text-gray-600">
                            Welcome to your shop dashboard! This is where you can manage your {shopName} business.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShopPage;