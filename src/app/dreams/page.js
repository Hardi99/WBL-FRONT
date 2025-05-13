'use client'

// Create a Dreams page to display the DreamList component
import React from 'react';
import DreamList from '@/components/DreamList';

const DreamsPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Dreams</h1>
            <DreamList />
        </div>
    );
};

export default DreamsPage;