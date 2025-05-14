'use client';

// Add a Login page for user authentication
import React from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';

const LoginPage = () => {
    const router = useRouter();

    const handleLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        const URL = 'https://site--world-bucket-list-backend--bw9kxpd2k92h.code.run';

        try {
            const response = await fetch(`${URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem('token', token);
                alert('Login successful');
                router.push('/dashboard'); // Redirect to dashboard
            } else {
                alert('Failed to log in');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h1>Log In</h1>
            <Input label="Email" name="email" type="email" required />
            <Input label="Password" name="password" type="password" required />
            <Button label="Log In" type="submit" classes="btn__primary" />
        </form>
    );
};

export default LoginPage;