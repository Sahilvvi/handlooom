/**
 * Jannat Handloom - Hostinger Build Script
 * Use this to generate the 'public' folder inside the server and zip it.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
// Set to your main domain
const PRODUCTION_BACKEND_URL = 'https://jannathandloom.com'; 
// --------------------

console.log('🚀 Starting Unified Hostinger Production Build...');

try {
    // 1. Clean previous build if it exists
    const serverPublicPath = path.join(__dirname, 'server', 'public');
    if (fs.existsSync(serverPublicPath)) {
        console.log('🧹 Cleaning old frontend (public) folder inside server...');
        fs.rmSync(serverPublicPath, { recursive: true, force: true });
    }

    // 2. Run Vite Build directly addressing the server/public output directory
    console.log(`🏗️  Building frontend...`);

    const buildCommand = `npx vite build --outDir server/public`;

    execSync(buildCommand, { stdio: 'inherit' });

    // 3. Zip the entire server folder (so you just upload one file to Hostinger)
    console.log('📦 Creating clean production zip (server.zip)...');
    
    // We use a staging folder to exclude unwanted files like node_modules and big zips
    const stagingPath = path.join(__dirname, 'build_staging');
    if (fs.existsSync(stagingPath)) fs.rmSync(stagingPath, { recursive: true, force: true });
    fs.mkdirSync(stagingPath);

    if (process.platform === 'win32') {
        // Windows: use robocopy to prepare staging, then zip
        console.log('📂 Copying files to staging...');
        try {
            execSync(`robocopy server build_staging /s /e /xf *.zip *.log error.log /xd node_modules`, { stdio: 'ignore' });
        } catch (e) {
            // Robocopy returns non-zero codes for success (1 = files copied)
            if (e.status > 8) throw e; 
        }
        console.log('🤐 Zipping staging folder...');
        execSync(`powershell -Command "Compress-Archive -Path ./build_staging/* -DestinationPath ./server.zip -Force"`, { stdio: 'inherit' });
    } else {
        // Unix: simple zip with exclude
        execSync(`zip -r server.zip server/ -x "server/node_modules/*" "server/*.zip" "server/*.log"`, { stdio: 'inherit' });
    }

    // Cleanup staging
    if (fs.existsSync(stagingPath)) fs.rmSync(stagingPath, { recursive: true, force: true });

    console.log('\n✅ UNIFIED BUILD SUCCESSFUL!');
    console.log('--------------------------------------------------');
    console.log('NEXT STEPS:');
    console.log('1. Go to Hostinger File Manager for your main domain.');
    console.log('2. Do NOT upload to public_html. Instead, go to your Node.js Application directory.');
    console.log('3. Upload "server.zip" and EXTRACT it there.');
    console.log('4. Restart your Node.js App from the Hostinger panel.');
    console.log('5. Your domain will now serve BOTH the React website and the API together! 🎉');
    console.log('--------------------------------------------------');

} catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
}
