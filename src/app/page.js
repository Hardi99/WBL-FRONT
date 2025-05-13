// Reorganize pages to prioritize login/register and fix search input
import React from 'react';
import Link from 'next/link';

const HomePage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h1>Welcome to World Bucket List</h1>
            <Link href="/auth/login">
                <button className="btn btn__primary">Log In</button>
            </Link>
            <Link href="/auth/signup">
                <button className="btn btn__primary">Sign Up</button>
            </Link>
        </div>
    );
};

export default HomePage;
