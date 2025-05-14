// Reorganize pages to prioritize login/register and fix search input
import React from 'react';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';

const HomePage = () => {
    return (
        <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h1>Log In</h1>
            <Input label="Email" name="email" type="email" required />
            <Input label="Password" name="password" type="password" required />
            <Button label="Log In" type="submit" classes="btn__primary" />
        </form>
    );
};

export default HomePage;
