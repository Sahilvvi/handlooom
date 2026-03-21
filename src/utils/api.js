// Centralized API configuration for Jannat Handloom
const isProd = import.meta.env.PROD;
const BASE_URL = isProd 
  ? window.location.origin 
  : 'http://localhost:5000';

export const getImgUrl = (img) => {
  if (!img) return '/d1.png'; // Use d1.png as the primary fallback asset in public/
  if (img.startsWith('http') || img.startsWith('data:')) return img;
  // Ensure we don't end up with double slashes or missing slashes
  const path = img.startsWith('/') ? img : `/${img}`;
  
  // 1. If it's a public asset (like in /home/ or /logo.png), return relative to the frontend origin
  if (path.startsWith('/home/') || path === '/logo.png') {
    return path; // Browser handles this relative to current origin (localhost:5173 in dev)
  }

  // 2. If it already has /uploads/, let Apache pull it directly from public_html
  if (path.startsWith('/uploads/')) {
    return `${BASE_URL}${path}`;
  }

  // 3. Otherwise treat as a database path that needs /uploads/
  return `${BASE_URL}/uploads${path}`;
};

export default BASE_URL;
