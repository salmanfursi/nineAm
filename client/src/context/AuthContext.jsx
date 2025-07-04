import { createContext, useContext, useEffect, useState } from "react";



const API_BASE = import.meta.env.VITE_SERVER
const VITE_BASE = import.meta.env.VITE_CLIENT;
console.log('api base', API_BASE, 'vite base', VITE_BASE)
  const AuthContext = createContext();
  export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      
      const checkAuth = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/auth/profile`, { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (err) {
            console.log('Not authenticated');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { checkAuth(); }, []);

    const signup = async (userData) => {
        console.log('dsfhaksdfiuashf asdf', API_BASE)

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                return { success: true };
            } else {
                setError(data.message);
                return { success: false, error: data.message, duplicateShops: data.duplicateShops };
            }
        } catch (err) {
            setError('Network error');
            return { success: false, error: 'Network error' };
        } finally {
            setLoading(false);
        }
    };

    const signin = async (credentials) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                return { success: true };
            } else {
                setError(data.message);
                return { success: false, error: data.message };
            }
        } catch (err) {
            setError('Network error');
            return { success: false, error: 'Network error' };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
        } catch (err) {
            console.log('Logout error');
        }
    };

    return (
        <AuthContext.Provider value={{
            user, loading, error, signup, signin, logout, checkAuth, setError, API_BASE, VITE_BASE
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


