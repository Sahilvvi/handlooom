import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../utils/api';
import './AddProduct.css'; 

const BulkUpload = () => {
    const [status, setStatus] = useState('idle'); // idle, processing, done, error
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('jannat_token');

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (status === 'processing') {
                e.preventDefault();
                e.returnValue = 'Upload in progress. Leaving will cancel the process. Are you sure?';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [status]);

    const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 50)]);

    const handleBulkUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setStatus('processing');
        setError('');
        
        // Group files by their parent directory name (e.g., /1/img.png -> group "1")
        const groups = {};
        files.forEach(file => {
            const relPath = file.webkitRelativePath || '';
            const pathParts = relPath.split('/');
            
            // We expect path like: MyFolder/1/img.jpg or 1/img.jpg
            if (pathParts.length >= 2) {
                const groupName = pathParts[pathParts.length - 2];
                if (!groups[groupName]) groups[groupName] = [];
                groups[groupName].push(file);
            }
        });

        const groupNames = Object.keys(groups);
        setProgress({ current: 0, total: groupNames.length });
        addLog(`📂 Found ${groupNames.length} potential products in the folder structure.`);

        for (let i = 0; i < groupNames.length; i++) {
            const groupName = groupNames[i];
            const groupFiles = groups[groupName];
            
            try {
                addLog(`⚙️ Processing Product "${groupName}" (${groupFiles.length} images)...`);
                
                // 1. Upload Images
                const uploadData = new FormData();
                groupFiles.forEach(f => uploadData.append('images', f));

                const uploadRes = await fetch(`${BASE_URL}/api/upload/multiple`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: uploadData
                });

                const uploadResult = await uploadRes.json();
                if (!uploadRes.ok || !uploadResult.urls) {
                    throw new Error(`Upload failed for group ${groupName}`);
                }

                const imageUrls = uploadResult.urls.map(u => u.url);

                // 2. Create Product with Dummy Data
                const dummyProduct = {
                    name: `Product ${groupName} (Rename Me)`,
                    category: 'Long Crush', // Default category
                    price: 299,
                    originalPrice: 999,
                    fabric: 'Standard Fabric',
                    material: 'Cotton',
                    transparency: 'Semi-Sheer',
                    description: `Automated upload from folder "${groupName}". Please update this description.`,
                    room: 'Living Room',
                    stock: 100,
                    images: imageUrls,
                    isActive: true,
                    isBestSeller: false,
                    fastDelivery: true
                };

                const productRes = await fetch(`${BASE_URL}/api/products`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(dummyProduct)
                });

                if (!productRes.ok) throw new Error(`Product creation failed for group ${groupName}`);

                setProgress(prev => ({ ...prev, current: i + 1 }));
                addLog(`✅ Successfully created Product "${groupName}".`);

            } catch (err) {
                console.error(err);
                addLog(`❌ ERROR on Product "${groupName}": ${err.message}`);
                setError(`Some products failed to upload. Check logs.`);
            }
        }

        setStatus('done');
        addLog('🏁 Bulk upload completed!');
    };

    return (
        <div className="add-product-container">
            <h2 className="form-title">🚀 Bulk Product Upload</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
                Select a folder containing numbered sub-folders (1, 2, 3...). 
                Each sub-folder will be treated as one product.
            </p>

            {error && <div className="form-error">{error}</div>}

            <div className="admin-form" style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
                {status === 'idle' ? (
                    <>
                        <label className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem', cursor: 'pointer' }}>
                            📁 Select Root Product Folder
                            <input 
                                type="file" 
                                webkitdirectory="true" 
                                directory="true" 
                                multiple 
                                onChange={handleBulkUpload} 
                                style={{ display: 'none' }} 
                            />
                        </label>
                        <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>
                            Format: MyProducts/1/image1.jpg, MyProducts/1/image2.jpg...
                        </p>
                    </>
                ) : (
                    <div className="processing-status">
                         {status === 'processing' && (
                            <div style={{ position: 'fixed', top: 20, right: 20, background: '#ef4444', color: 'white', padding: '10px 20px', borderRadius: 8, zIndex: 9999, fontWeight: 700, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                                ⚠️ UPLOAD IN PROGRESS - DON'T SWITCH PAGES
                            </div>
                        )}
                        <div className="progress-bar-container" style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '15px' }}>
                            <div 
                                className="progress-fill" 
                                style={{ 
                                    width: `${(progress.current / progress.total) * 100}%`, 
                                    height: '100%', 
                                    background: '#7c3aed', 
                                    transition: 'width 0.3s ease' 
                                }}
                            ></div>
                        </div>
                        <p style={{ fontWeight: 600 }}>
                            {status === 'processing' ? `🚀 Processing ${progress.current} of ${progress.total}...` : '✅ Done!'}
                        </p>
                        <button 
                            className="btn-secondary" 
                            style={{ marginTop: '20px' }} 
                            onClick={() => window.location.reload()}
                        >
                            Upload Another Folder
                        </button>
                    </div>
                )}
            </div>

            <div className="upload-logs" style={{ marginTop: '30px', background: '#1e293b', color: '#94a3b8', padding: '20px', borderRadius: '8px', fontSize: '0.85rem', maxHeight: '300px', overflowY: 'auto', fontFamily: 'monospace' }}>
                {logs.length === 0 ? '> Ready for upload...' : logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>
    );
};

export default BulkUpload;
