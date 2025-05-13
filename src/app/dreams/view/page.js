'use client';

// Update DreamsView to use Bootstrap for styling
import React, { useState } from 'react';
import Map from '@/components/Map';
import DreamList from '@/components/DreamList';

const DreamsView = () => {
    const [selectedDream, setSelectedDream] = useState(null);
    const [isStreetView, setIsStreetView] = useState(false);

    const handleVisitDream = (dream) => {
        setSelectedDream(dream);
        setIsStreetView(true);
    };

    const handleBackToMap = () => {
        setIsStreetView(false);
    };

    return (
        <div className="flex h-screen">
            {/* Liste des rêves à gauche */}
            <div className="w-1/3 overflow-y-auto p-4 bg-white border-r">
                <DreamList onVisitDream={handleVisitDream} />
            </div>

            {/* Carte et Street View à droite */}
            <div className="w-2/3 relative">
                <Map 
                    selectedDream={selectedDream} 
                    isStreetView={isStreetView}
                    onBackToMap={handleBackToMap}
                />
            </div>
        </div>
    );
};

export default DreamsView;