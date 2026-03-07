/**
 * Jannat Handloom - Hostinger Build Script
 * Use this to generate the 'dist' folder with your production URL.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const PRODUCTION_BACKEND_URL = 'https://rosybrown-koala-703473.hostingersite.com'; // CHANGE THIS to your actual Hostinger Backend URL
// --------------------

console.log('🚀 Starting Hostinger Production Build...');

try {
    // 1. Clean previous build if it exists
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
        console.log('🧹 Cleaning old build folder...');
        fs.rmSync(distPath, { recursive: true, force: true });
    }

    // 2. Run Vite Build with the specific Production Environment Variable
    console.log(`🏗️  Building frontend with API URL: ${PRODUCTION_BACKEND_URL}`);

    // Cross-platform way to set env var and run build
    const buildCommand = process.platform === 'win32'
        ? `set VITE_API_URL=${PRODUCTION_BACKEND_URL}&& npm run build`
        : `VITE_API_URL=${PRODUCTION_BACKEND_URL} npm run build`;

    execSync(buildCommand, { stdio: 'inherit' });

    // 3. Create .htaccess automatically in the dist folder for Hostinger
    console.log('📝 Generating .htaccess for React Router (Single Page App)...');
    const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`;

    fs.writeFileSync(path.join(distPath, '.htaccess'), htaccessContent);

    console.log('\n✅ BUILD SUCCESSFUL!');
    console.log('--------------------------------------------------');
    console.log('NEXT STEPS:');
    console.log('1. Upload EVERYTHING inside the "dist" folder to Hostinger "public_html".');
    console.log('2. Ensure your backend is running at: ' + PRODUCTION_BACKEND_URL);
    console.log('--------------------------------------------------');

} catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
}
