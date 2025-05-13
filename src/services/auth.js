'use client'

// Update login/signup/logout logic to match my-dashboard front
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/auth/login');
    };

    return { isLoggedIn, login, logout };
};

export default useAuth;