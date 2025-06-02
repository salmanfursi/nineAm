import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import ShopPage from './components/shop/ShopPage';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './components/dashboard/Dashboard';


// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('signin');
  const { user, loading } = useAuth();

  // Handle subdomain routing
  useEffect(() => {
    const hostname = window.location.hostname;
    const hash = window.location.hash.slice(1);

    if (hostname !== 'localhost' && hostname.endsWith('.localhost')) {
      const shopName = hostname.split('.')[0];
      setCurrentPage(`shop-${shopName}`);
    } else if (hash) {
      setCurrentPage(hash);
    } else if (user) {
      setCurrentPage('dashboard');
    }
  }, [user]);

  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && window.location.hostname === 'localhost') {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Render shop page for subdomains
  if (currentPage.startsWith('shop-')) {
    const shopName = currentPage.replace('shop-', '');
    return <ShopPage shopName={shopName} />;
  }

  // Render auth pages or dashboard
  if (!user) {
    if (currentPage === 'signup') {
      return <SignupPage onSuccess={() => setCurrentPage('dashboard')} />;
    }
    return <SigninPage onSuccess={() => setCurrentPage('dashboard')} />;
  }

  return <Dashboard />;
};

export default App