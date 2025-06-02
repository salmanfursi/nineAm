import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SigninPage = ({ onSuccess }) => {
    const { signin, loading, error, setError } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);

    // ...existing handleSubmit function...

    return (
    // ...existing JSX...
  );
};

export default SigninPage;
