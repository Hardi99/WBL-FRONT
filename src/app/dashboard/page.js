'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

const Dashboard = () => {
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Récupérer l'email de l'utilisateur depuis le token
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserEmail(payload.email);
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-4">Bienvenue {userEmail}</h1>
                    <p className="text-gray-600 mb-6">
                        Gérez vos rêves et explorez le monde à travers votre liste de souhaits.
                    </p>
                    <Button 
                        label="Se déconnecter" 
                        handleClick={handleLogout}
                        classes="btn__secondary"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Mes Rêves</h2>
                        <p className="text-gray-600 mb-4">
                            Ajouter un nouveau rêve.
                        </p>
                        <div className="space-y-4">
                            <Button 
                                label="Créer un nouveau rêve" 
                                handleClick={() => router.push('/dreams/create')}
                                classes="btn__secondary w-full"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Carte du Monde</h2>
                        <p className="text-gray-600 mb-4">
                            Explorez vos rêves sur la carte interactive.
                        </p>
                        <Button 
                            label="Voir la carte des rêves" 
                            handleClick={() => router.push('/dreams/view')}
                            classes="btn__primary w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 