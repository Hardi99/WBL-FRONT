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

                    const marker = new google.maps.Marker({
                        position: { lat: dream.latitude, lng: dream.longitude },
                        map: map,
                        title: dream.description,
                    });

                    marker.addListener('click', () => {
                        setCurrentDream(dream);
                        setIsStreetView(true);
                    });

                    newMarkers.push(marker);
                });

                setMarkers(newMarkers);
            } catch (error) {
                console.error('Error creating markers:', error);
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
            const { latitude, longitude } = currentDream;
            if (latitude && longitude) {
                const position = { lat: latitude, lng: longitude };
                streetView.setPosition(position);
                streetView.setVisible(isStreetView);
            } else {
                console.warn('Current dream has invalid coordinates');
            }
        }
    }, [streetView, currentDream, isStreetView]);

    useEffect(() => {
        if (selectedDream) {
            const { latitude, longitude } = selectedDream;
            const position = { lat: latitude, lng: longitude };
            // Logic to display Street View for the selected dream
            console.log('Displaying Street View for:', position);
        }
    }, [selectedDream]);

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