import React, { useState, useEffect } from 'react';
import BASE_URL, { getImgUrl } from '../../utils/api';
import './AddProduct.css';

const MediaLibrary = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copying, setCopying] = useState(null);

    const token = localStorage.getItem('jannat_token');

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/upload`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setFiles(data.files || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFiles(); }, []);

    const handleUpload = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (!selectedFiles.length) return;

        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(f => formData.append('images', f));

        try {
            const res = await fetch(`${BASE_URL}/api/upload/multiple`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (res.ok) fetchFiles();
            else alert('Upload failed');
        } catch (err) {
            alert('Error during upload');
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const handleDelete = async (filename) => {
        if (!window.confirm('Delete this image permanently?')) return;
        try {
            const res = await fetch(`${BASE_URL}/api/upload/${filename}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setFiles(files.filter(f => f.filename !== filename));
        } catch (err) {
            alert('Delete failed');
        }
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        setCopying(url);
        setTimeout(() => setCopying(null), 2000);
    };

    return (
        <div className="add-product-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 className="form-title" style={{ border: 'none', marginBottom: '4px', padding: 0 }}>Media Library</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Upload and manage product images directly.</p>
                </div>
                <label className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    {uploading ? '⌛ Uploading...' : '📤 Upload Images'}
                    <input type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Loading assets...</div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                    gap: '20px' 
                }}>
                    {files.map(file => (
                        <div key={file.filename} className="image-preview-item" style={{ 
                            height: 'auto', display: 'flex', flexDirection: 'column', cursor: 'default'
                        }}>
                            <div style={{ height: '150px', width: '100%', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <img 
                                    src={getImgUrl(file.url)} 
                                    alt="" 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                />
                            </div>
                            <div style={{ padding: '10px' }}>
                                <p style={{ 
                                    fontSize: '0.7rem', color: '#64748b', 
                                    whiteSpace: 'nowrap', overflow: 'hidden', 
                                    textOverflow: 'ellipsis', marginBottom: '8px',
                                    fontWeight: 500
                                }}>
                                    {file.filename}
                                </p>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button 
                                        onClick={() => copyToClipboard(file.url)}
                                        style={{ 
                                            flex: 1, padding: '6px 4px', fontSize: '0.65rem',
                                            background: copying === file.url ? '#22c55e' : '#f1f5f9',
                                            color: copying === file.url ? 'white' : '#1e293b',
                                            border: 'none', borderRadius: '4px', cursor: 'pointer',
                                            fontWeight: 600
                                        }}
                                    >
                                        {copying === file.url ? 'Copied!' : 'Copy Path'}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(file.filename)}
                                        className="remove-img"
                                        style={{ position: 'static', width: '28px', height: '28px' }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {files.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📁</div>
                            <p>Your media library is empty. Start by uploading some images.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MediaLibrary;
