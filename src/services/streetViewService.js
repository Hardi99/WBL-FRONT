// Add a service to fetch Street View images
import axios from 'axios';

export async function fetchStreetViewImages(latitude, longitude) {
    try {
        // Vérifier d'abord si Street View est disponible à cet endroit
        const metadataResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/streetview/metadata?location=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
        );

        // Si Street View est disponible
        if (metadataResponse.data.status === 'OK') {
            const url = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${latitude},${longitude}&heading=0&pitch=0&fov=90&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
            return {
                type: 'streetview',
                url,
                label: 'Vue Street View'
            };
        }

        // Si Street View n'est pas disponible, retourner une vue satellite
        const satelliteUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x400&maptype=satellite&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
        return {
            type: 'satellite',
            url: satelliteUrl,
            label: 'Vue Satellite (Street View non disponible)'
        };

    } catch (error) {
        console.error('Error fetching location images:', error);
        // En cas d'erreur, retourner une vue satellite par défaut
        const satelliteUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x400&maptype=satellite&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
        return {
            type: 'satellite',
            url: satelliteUrl,
            label: 'Vue Satellite (Erreur de chargement)'
        };
    }
}

function getHeadingLabel(heading) {
    switch (heading) {
        case 0: return 'Nord';
        case 90: return 'Est';
        case 180: return 'Sud';
        case 270: return 'Ouest';
        default: return '';
    }
}

function getPitchLabel(pitch) {
    switch (pitch) {
        case 0: return '(horizontale)';
        case 30: return '(vers le haut)';
        case -30: return '(vers le bas)';
        default: return '';
    }
}