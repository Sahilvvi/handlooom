// Centralized API configuration for Jannat Handloom
// Detects if the app is running locally or in production (Vercel)

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default BASE_URL;
