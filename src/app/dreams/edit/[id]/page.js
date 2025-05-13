'use client'

import React, { useState, useEffect } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { fetchImages } from '@/services/pixabayService';
import { fetchStreetViewImages } from '@/services/streetViewService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const DreamEdit = ({ params }) => {
    const router = useRouter();
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [streetImages, setStreetImages] = useState([]);
    const [selectedStreetImage, setSelectedStreetImage] = useState(null);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDream = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dreams/${params.id}`);
                const data = await response.json();
                setDescription(data.description);
                setSelectedImage(data.imagePath);
                setLatitude(data.latitude.toString());
                setLongitude(data.longitude.toString());
                setSelectedStreetImage(data.streetViewImage);
                setLoading(false);
            } catch (error) {
                console.error('Error loading dream:', error);
                setLoading(false);
            }
        };

        loadDream();
    }, [params.id]);

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
            const results = await fetchStreetViewImages(latitude, longitude);
            setStreetImages(results);
        } catch (error) {
            console.error('Error fetching Street View images:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const description = formData.get('description');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dreams/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    imagePath: selectedImage,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    streetViewImage: selectedStreetImage,
                }),
            });
            if (response.ok) {
                alert('Rêve modifié avec succès');
                router.push('/dreams/view');
            } else {
                alert('Échec de la modification du rêve');
            }
        } catch (error) {
            console.error('Error updating dream:', error);
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Modifier un Rêve</h1>
            <Input 
                label="Description du Rêve" 
                name="description" 
                type="text" 
                required 
                value={description}
                handleChange={(e) => setDescription(e.target.value)}
            />
            <Input 
                label="Rechercher une Image" 
                name="imageSearch" 
                type="text" 
                handleChange={(e) => handleImageSearch(e.target.value)} 
            />

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

            <Input 
                label="Latitude" 
                name="latitude" 
                type="number" 
                value={latitude} 
                handleChange={(e) => setLatitude(e.target.value)} 
                required 
            />
            <Input 
                label="Longitude" 
                name="longitude" 
                type="number" 
                value={longitude} 
                handleChange={(e) => setLongitude(e.target.value)} 
                required 
            />
            <Button 
                label="Récupérer Street View" 
                type="button" 
                handleClick={handleFetchStreetView} 
                classes="btn__secondary" 
            />

            <p>Utilisez <a href='https://www.latlong.net/'>ce lien</a> pour trouver les coordonnées de votre lieu</p>

            <Button label="Modifier le Rêve" type="submit" classes="btn__primary" />
        </form>
    );
};

export default DreamEdit; 