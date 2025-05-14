'use client'

// Enhance DreamCreation page to fetch and display Street View images
import React, { useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { fetchImages } from '@/services/pixabayService';
import { fetchStreetViewImages } from '@/services/streetViewService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const DreamCreation = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [streetImages, setStreetImages] = useState(null);
    const [selectedStreetImage, setSelectedStreetImage] = useState(null);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const router = useRouter();

    const URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://site--world-bucket-list-backend--bw9kxpd2k92h.code.run"

    const handleImageSearch = async (query) => {
        try {
            const results = await fetchImages(query);
            setImages(results);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const handleFetchStreetView = async () => {
        try {
            const result = await fetchStreetViewImages(latitude, longitude);
            setStreetImages(result);
            setSelectedStreetImage(result.url);
        } catch (error) {
            console.error('Error fetching location images:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const description = formData.get('description');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Vous devez être connecté pour créer un rêve');
                router.push('/login');
                return;
            }

            const response = await fetch(`${URL}/api/dreams`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    description,
                    imagePath: selectedImage,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    streetViewImage: selectedStreetImage,
                }),
            });

            if (response.ok) {
                alert('Rêve créé avec succès');
                router.push('/dashboard');
            } else {
                const error = await response.json();
                alert(error.error || 'Échec de la création du rêve');
            }
        } catch (error) {
            console.error('Error creating dream:', error);
            alert('Une erreur est survenue lors de la création du rêve');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Create a Dream</h1>
            <Input label="Dream Description" name="description" type="text" required />
            <Input label="Search Image" name="imageSearch" type="text" handleChange={(e) => handleImageSearch(e.target.value)} />

            <div style={{ display: 'flex', gap: '10px', overflowX: 'scroll' }}>
                {images.map((image) => (
                    <Image
                        key={image.id}
                        src={image.previewURL}
                        alt={image.tags}
                        width={100}
                        height={100}
                        style={{ cursor: 'pointer', border: selectedImage === image.previewURL ? '2px solid blue' : 'none' }}
                        onClick={() => setSelectedImage(image.previewURL)}
                    />
                ))}
            </div>

            <Input label="Latitude" name="latitude" type="number" value={latitude} handleChange={(e) => setLatitude(e.target.value)} required />
            <Input label="Longitude" name="longitude" type="number" value={longitude} handleChange={(e) => setLongitude(e.target.value)} required />
            <Button 
                label="Récupérer Street View" 
                type="button" 
                handleClick={handleFetchStreetView} 
                classes="btn__secondary" 
            />

            {streetImages && (
                <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">
                        {streetImages.type === 'streetview' ? 'Vue Street View' : 'Vue Satellite'}
                    </h3>
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                        <Image
                            src={streetImages.url}
                            alt={streetImages.label}
                            className="w-full h-full object-cover"
                            width={600}
                            height={400}
                        />
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                            {streetImages.label}
                        </div>
                        {streetImages.type === 'satellite' && (
                            <div className="absolute top-4 left-4 bg-yellow-500 bg-opacity-90 text-black px-3 py-1 rounded-full text-sm">
                                Street View non disponible à cet endroit
                            </div>
                        )}
                    </div>
                </div>
            )}

            <p>Utilisez <a target='blank' href='https://www.latlong.net/'>ce lien</a> pour trouver les coordonnées de votre lieu</p>

            <Button label="Create Dream" type="submit" classes="btn__primary" />
        </form>
    );
};

export default DreamCreation;