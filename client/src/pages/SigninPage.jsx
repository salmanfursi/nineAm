import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { Eye, EyeOff } from "lucide-react";

const SigninPage = ({ onSuccess }) => {
    const { signin, loading, error, setError } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        setError('');

        const result = await signin(formData);
        if (result.success) {
            onSuccess();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
                <div>
                    <Input
                        label="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        placeholder="Enter username"
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Remember me (7 days)</span>
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </div>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button onClick={() => window.location.hash = 'signup'} className="text-blue-500 hover:underline">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
  };

export default SigninPage