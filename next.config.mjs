/** @type {import('next').NextConfig} */
// Add configuration for external image domains
const nextConfig = {
    images: {
        domains: ['cdn.pixabay.com', 'maps.googleapis.com'],
    },
};

export default nextConfig;
