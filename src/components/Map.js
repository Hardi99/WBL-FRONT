'use client'

// Add a Map component to display Google Maps with markers for dreams
import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';

const Map = ({ selectedDream = null }) => {
    const [map, setMap] = useState(null);
    const [streetView, setStreetView] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [dreams, setDreams] = useState([]);
    const [error, setError] = useState(null);
    const [isStreetView, setIsStreetView] = useState(false);
    const [currentDream, setCurrentDream] = useState(null);

    useEffect(() => {
        const loadDreams = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dreams`);
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des rêves');
                }
                const data = await response.json();
                setDreams(data.filter(dream => dream.latitude && dream.longitude));
            } catch (error) {
                console.error('Failed to load dreams:', error);
                setError('Impossible de charger les rêves');
            }
        };

        loadDreams();
    }, []);

    useEffect(() => {
        async function initMap() {
            try {
                await google.maps.importLibrary("maps");
                await google.maps.importLibrary("marker");
                await google.maps.importLibrary("streetView");

                if (typeof window !== 'undefined' && window.google) {
                    const newMap = new google.maps.Map(document.getElementById('map'), {
                        center: { lat: 48.8566, lng: 2.3522 }, // Paris par défaut
                        zoom: 2.3,
                        streetViewControl: false,
                        mapId: "DEMO_MAP_ID"
                    });

                    const newStreetView = new google.maps.StreetViewPanorama(
                        document.getElementById('street-view'),
                        {
                            enableCloseButton: false,
                            enableNavigationControl: false,
                            addressControl: false,
                            fullscreenControl: false,
                            motionTracking: false,
                            motionTrackingControl: false,
                            zoomControl: false,
                            panControl: false,
                            scrollwheel: false,
                            visible: false
                        }
                    );

                    setMap(newMap);
                    setStreetView(newStreetView);
                } else {
                    throw new Error('Google Maps API is not available');
                }
            } catch (error) {
                console.error('Error initializing map:', error);
                setError('Impossible d\'initialiser la carte');
            }
        }

        initMap();
    }, []);

    useEffect(() => {
        if (map && dreams.length > 0) {
            try {
                // Clear existing markers
                markers.forEach(marker => marker.setMap(null));
                const newMarkers = [];

                dreams.forEach(dream => {
                    if (!dream.latitude || !dream.longitude) {
                        console.warn(`Dream ${dream.id} has invalid coordinates`);
                        return;
                    }

                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        position: { lat: dream.latitude, lng: dream.longitude },
                        map: map,
                        title: dream.description,
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div style="padding: 10px;">
                                <h3>${dream.description}</h3>
                                ${dream.imagePath ? `<img src="${dream.imagePath}" alt="${dream.description}" style="width: 200px; height: 150px; object-fit: cover;">` : ''}
                                <p>Statut: ${dream.done ? 'Réalisé' : 'À faire'}</p>
                                <button onclick="window.openStreetView(${dream.id})" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                                    Visiter
                                </button>
                            </div>
                        `,
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });

                    newMarkers.push(marker);
                });

                setMarkers(newMarkers);

                // Ajouter la fonction globale pour ouvrir Street View
                window.openStreetView = (dreamId) => {
                    const dream = dreams.find(d => d.id === dreamId);
                    if (dream) {
                        setCurrentDream(dream);
                        setIsStreetView(true);
                    }
                };
            } catch (error) {
                console.error('Error creating markers:', error);
                setError('Erreur lors de l\'affichage des marqueurs');
            }
        }
    }, [map, dreams]);

    useEffect(() => {
        if (map && selectedDream) {
            try {
                const dream = dreams.find(d => d.id === selectedDream);
                if (dream && dream.latitude && dream.longitude) {
                    map.setCenter({ lat: dream.latitude, lng: dream.longitude });
                    map.setZoom(12);
                } else {
                    console.warn('Selected dream has invalid coordinates');
                }
            } catch (error) {
                console.error('Error centering map:', error);
            }
        }
    }, [map, selectedDream, dreams]);

    useEffect(() => {
        if (streetView && currentDream) {
            const position = { lat: currentDream.latitude, lng: currentDream.longitude };
            streetView.setPosition(position);
            streetView.setVisible(isStreetView);
        }
    }, [streetView, currentDream, isStreetView]);

    const handleBackToMap = () => {
        setIsStreetView(false);
        if (streetView) {
            streetView.setVisible(false);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full">
            <div id="map" style={{ height: '100%', display: isStreetView ? 'none' : 'block' }}></div>
            <div id="street-view" style={{ height: '100%', display: isStreetView ? 'block' : 'none' }}></div>
            {isStreetView && (
                <div className="absolute top-4 left-4 z-10">
                    <Button
                        label="Retour à la carte"
                        handleClick={handleBackToMap}
                        classes="btn__secondary"
                    />
                </div>
            )}
        </div>
    );
};

export default Map;