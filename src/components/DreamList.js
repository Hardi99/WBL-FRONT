'use client'

// Update DreamList to support embedding in the new layout
import React, { useEffect, useState } from 'react';
import { fetchCoordinates } from '@/services/coordinatesService';
import Image from 'next/image';

const DreamList = ({ onVisitDream }) => {
    const [dreams, setDreams] = useState([]);

    const URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://site--world-bucket-list-backend--bw9kxpd2k92h.code.run"

    useEffect(() => {
        const loadDreams = async () => {
            try {
                const response = await fetch(`${URL}/api/dreams`);
                const data = await response.json();
                setDreams(data);
            } catch (error) {
                console.error('Failed to load dreams:', error);
            }
        };

        loadDreams();

        // Add global function for opening Street View
        window.openStreetView = (dreamId) => {
            const dream = dreams.find(d => d.id === dreamId);
            if (dream) {
                setCurrentDream(dream);
                setIsStreetView(true);
            }
        };
    }, [URL, dreams]);

    const toggleDreamDone = async (dreamId) => {
        try {
            const response = await fetch(`${URL}/api/dreams/${dreamId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: !dreams.find(dream => dream.id === dreamId).done }),
            });
            if (response.ok) {
                setDreams((prevDreams) =>
                    prevDreams.map((dream) =>
                        dream.id === dreamId ? { ...dream, done: !dream.done } : dream
                    )
                );
            } else {
                alert('Failed to update dream status');
            }
        } catch (error) {
            console.error('Error updating dream status:', error);
        }
    };

    const deleteDream = async (dreamId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rêve ?')) {
            try {
                const response = await fetch(`${URL}/api/dreams/${dreamId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setDreams((prevDreams) => prevDreams.filter((dream) => dream.id !== dreamId));
                } else {
                    alert('Failed to delete dream');
                }
            } catch (error) {
                console.error('Error deleting dream:', error);
            }
        }
    };

    const editDream = (dreamId) => {
        window.location.href = `/dreams/edit/${dreamId}`;
    };

    const visitDream = (dream) => {
        onVisitDream(dream);
    };

    return (
        <div>
            <h1>Dream List</h1>
            <div id="dreams-container">
                {dreams.map((dream) => (
                    <div key={dream.id} className="card text-center" style={{ marginBottom: '20px' }}>
                        <h5 className="card-header font-weight-bold">{dream.description}</h5>
                        <Image className="card-img-top" src={dream.imagePath} alt="" width={150} height={150} style={{ maxHeight: '150px', objectFit: 'cover' }} />
                        <div className="card-body">
                            <button
                                className={`btn btn-${dream.done ? 'secondary' : 'danger'} font-weight-bold btn-block`}
                                onClick={() => toggleDreamDone(dream.id)}
                            >
                                {dream.done ? 'Je veux le refaire' : 'Je me lance !'}
                            </button>
                        </div>
                        <div className="card-footer text-muted text-right">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => visitDream(dream)}
                            >
                                Visiter
                            </button>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => editDream(dream.id)}
                            >
                                Modifier
                            </button>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteDream(dream.id)}
                            >
                                Supprimer
                            </button>
                            <a href={dream.link} target="_blank" className="btn btn-outline-dark btn-sm">
                                Plus d&apos;infos
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DreamList;