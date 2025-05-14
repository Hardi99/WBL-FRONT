'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';

const Login = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://site--world-bucket-list-backend--bw9kxpd2k92h.code.run"

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch(`${URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                // Attendre un court instant avant la redirection
                setTimeout(() => {
                    router.replace('/dashboard');
                }, 100);
            } else {
                setError(data.error || 'Échec de la connexion');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Une erreur est survenue lors de la connexion');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        required
                        disabled={isLoading}
                    />
                    <Input
                        label="Mot de passe"
                        name="password"
                        type="password"
                        required
                        disabled={isLoading}
                    />
                    <Button
                        label={isLoading ? "Connexion en cours..." : "Se connecter"}
                        type="submit"
                        classes="btn__primary w-full"
                        disabled={isLoading}
                    />
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Pas encore de compte ?{' '}
                    <Link href="/signup" className="text-blue-500 hover:text-blue-700">
                        S&apos;inscrire
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login; 