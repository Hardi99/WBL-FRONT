'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // Rediriger vers login si non connecté et sur une page protégée
        if (!token && !pathname.startsWith('/auth/')) {
            router.push('/auth/login');
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/auth/login');
    };

    const handleNavigation = (path) => {
        if (!isLoggedIn) {
            router.push('/auth/login');
            return;
        }
        router.push(path);
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
            <div>
                <a onClick={() => handleNavigation("/")} style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#333', cursor: 'pointer' }}>World Bucket List</a>
            </div>
            <nav style={{ display: 'flex', gap: '15px' }}>
                {isLoggedIn ? (
                    <>
                        <span onClick={() => handleNavigation("/dreams/view")} style={{ textDecoration: 'none', color: '#007bff', cursor: 'pointer' }}>Rêves</span>
                        <span onClick={() => handleNavigation("/dreams/create")} style={{ textDecoration: 'none', color: '#007bff', cursor: 'pointer' }}>Créer un Rêve</span>
                        <button onClick={handleLogout} style={{ textDecoration: 'none', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}>
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <a href="/auth/login" style={{ textDecoration: 'none', color: '#007bff' }}>Connexion</a>
                        <a href="/auth/signup" style={{ textDecoration: 'none', color: '#007bff' }}>Inscription</a>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;