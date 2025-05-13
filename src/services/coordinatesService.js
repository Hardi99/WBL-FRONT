// Add a service to fetch coordinates and Street View URLs
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Add a helper function to fetch geographic coordinates
export async function fetchCoordinates(address) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dreams/coordinates`, { address });
        return response.data;
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
}