'use client';

// Add a Signup page for user registration
import React from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';

const SignupPage = () => {
    const handleSignup = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        const URL = 'https://site--world-bucket-list-backend--bw9kxpd2k92h.code.run'

        try {
            const response = await fetch(`${URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                alert('User registered successfully');
            } else {
                alert('Failed to register user');
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <form onSubmit={handleSignup} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h1>Sign Up</h1>
            <Input label="Email" name="email" type="email" required />
            <Input label="Password" name="password" type="password" required />
            <Button label="Sign Up" type="submit" classes="btn__primary" />
        </form>
    );
};

export default SignupPage;