import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { validatePassword, validateShops } from "../utils/validation";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { Eye, EyeOff } from "lucide-react";

const SignupPage = ({ onSuccess }) => {
    const { signup, loading, error, setError } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        shops: ['', '', '']
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleShopChange = (index, value) => {
        const newShops = [...formData.shops];
        newShops[index] = value;
        setFormData({ ...formData, shops: newShops });
    };

    const addShop = () => {
        if (formData.shops.length < 6) {
            setFormData({ ...formData, shops: [...formData.shops, ''] });
        }
    };

    const removeShop = (index) => {
        if (formData.shops.length > 3) {
            const newShops = formData.shops.filter((_, i) => i !== index);
            setFormData({ ...formData, shops: newShops });
        }
    };

    const handleSubmit = async () => {
        setError('');
        setValidationErrors({});

        // Validate
        const passwordErrors = validatePassword(formData.password);
        const shopErrors = validateShops(formData.shops.filter(s => s.trim()));

        if (passwordErrors.length || shopErrors.length) {
            setValidationErrors({
                password: passwordErrors,
                shops: shopErrors
            });
            return;
        }

        const result = await signup({
            username: formData.username,
            password: formData.password,
            shops: formData.shops.filter(s => s.trim())
        });

        if (result.success) {
            onSuccess();
        } else if (result.duplicateShops) {
            setValidationErrors({
                shops: [`These shop names are already taken: ${result.duplicateShops.join(', ')}`]
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
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
                        {validationErrors.password && (
                            <div className="text-red-500 text-sm mt-1">
                                {validationErrors.password.map((err, i) => <div key={i}>{err}</div>)}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Shop Names <span className="text-red-500">*</span> (min 3)
                        </label>
                        {formData.shops.map((shop, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={shop}
                                    onChange={(e) => handleShopChange(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Shop ${index + 1}`}
                                />
                                {formData.shops.length > 3 && (
                                    <button
                                        type="button"
                                        onClick={() => removeShop(index)}
                                        className="px-2 py-2 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        {formData.shops.length < 6 && (
                            <button
                                type="button"
                                onClick={addShop}
                                className="text-blue-500 text-sm hover:underline"
                            >
                                + Add another shop
                            </button>
                        )}
                        {validationErrors.shops && (
                            <div className="text-red-500 text-sm mt-1">
                                {validationErrors.shops.map((err, i) => <div key={i}>{err}</div>)}
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </div>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account?{' '}
                    <button onClick={() => window.location.hash = 'signin'} className="text-blue-500 hover:underline">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
  };

export default SignupPage
