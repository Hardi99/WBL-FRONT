'use client';

// Add a Login page for user authentication
import React from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';

const LoginPage = () => {
    const handleLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem('token', token);
                alert('Login successful');
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