'use client';

// Update DreamsView to use Bootstrap for styling
import React, { useState } from 'react';
import Map from '@/components/Map';
import DreamList from '@/components/DreamList';

const DreamsView = () => {
    const [selectedDream, setSelectedDream] = useState(null);

    const handleVisitDream = (dream) => {
        setSelectedDream(dream);
    };

    return (
        <div className="flex h-screen">
            {/* Dream List on the left */}
            <div className="w-1/3 overflow-y-auto p-4 bg-white border-r">
                <DreamList onVisitDream={handleVisitDream} />
            </div>

            {/* Map on the right */}
            <div className="w-2/3 relative">
                <Map selectedDream={selectedDream} />
            </div>
        </div>
    );
};

export default DreamsView;