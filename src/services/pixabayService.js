// Add a service to fetch images from Pixabay API
import axios from 'axios';

const PIXABAY_API_URL = 'https://pixabay.com/api/';
const PIXABAY_API_KEY = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;

export async function fetchImages(query) {
    try {
        const response = await axios.get(PIXABAY_API_URL, {
            params: {
                key: PIXABAY_API_KEY,
                q: query,
                image_type: 'photo',
                per_page: 10,
            },
        });
        return response.data.hits;
    } catch (error) {
        console.error('Error fetching images from Pixabay:', error);
        throw error;
    }
}