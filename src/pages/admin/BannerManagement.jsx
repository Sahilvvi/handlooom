import React, { useState, useEffect } from 'react';
import BASE_URL from '../../utils/api';

const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '/shop', buttonText: 'Shop Now', bgColor: '#fff9f6', sortOrder: 0, isActive: true });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem('jannat_token');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const fetchBanners = () => {
        setLoading(true);
        fetch(`${BASE_URL}/api/banners/all`, { headers })
            .then(r => r.json()).then(data => { setBanners(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(fetchBanners, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await fetch(`${BASE_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            });
            const data = await res.json();
            if (res.ok) {
                setForm({ ...form, image: data.url });
            } else {
                alert(data.message || 'Upload failed');
            }
        } catch {
            alert('Upload error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.image) return alert('Please upload an image first');
        setSaving(true);
        try {
            const res = await fetch(`${BASE_URL}/api/banners`, { method: 'POST', headers, body: JSON.stringify(form) });
            if (res.ok) { setShowForm(false); setForm({ title: '', subtitle: '', image: '', link: '/shop', buttonText: 'Shop Now', bgColor: '#fff9f6', sortOrder: 0, isActive: true }); fetchBanners(); }
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this banner?')) return;
        await fetch(`${BASE_URL}/api/banners/${id}`, { method: 'DELETE', headers });
        fetchBanners();
    };

    const toggleActive = async (b) => {
        await fetch(`${BASE_URL}/api/banners/${b._id}`, { method: 'PUT', headers, body: JSON.stringify({ isActive: !b.isActive }) });
        fetchBanners();
    };

    if (loading) return <div style={{ padding: 24 }}>Loading banners...</div>;

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>Homepage Banners ({banners.length})</h2>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>Manage the hero banners displayed on the homepage.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} style={{ background: '#EF6F31', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>{showForm ? 'Cancel' : '+ Add Banner'}</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: 24, borderRadius: 10, marginBottom: 24, border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginBottom: 16, color: '#1e293b' }}>New Banner</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Banner Image *</label>
                            <input type="file" onChange={handleFileUpload} accept="image/*" />
                            {uploading && <p style={{ fontSize: '0.75rem', color: '#EF6F31' }}>Uploading image...</p>}
                            {form.image && <img src={form.image} alt="preview" style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 4, marginTop: 8, border: '1px solid #e2e8f0' }} />}
                        </div>
                        {[['title', 'Title (e.g. Summer Sale)', 'text'], ['subtitle', 'Subtitle text', 'text'], ['link', 'Button Link (/shop)', 'text'], ['buttonText', 'Button Text', 'text']].map(([n, ph, t]) => (
                            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>{ph}</label><input style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.9rem' }} type={t} name={n} value={form[n]} onChange={e => setForm({ ...form, [n]: e.target.value })} placeholder={ph} /></div>
                        ))}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Sort Order</label><input style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 6 }} type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} /></div>
                    </div>
                    <button type="submit" disabled={saving || uploading} style={{ marginTop: 24, background: '#EF6F31', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', width: '100%' }}>{saving ? 'Saving...' : '✅ Save Banner'}</button>
                </form>
            )}

            {banners.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>🖼️</div>
                    <p>No banners yet. Add your first banner above.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                    {banners.map(b => (
                        <div key={b._id} style={{ display: 'flex', gap: 20, alignItems: 'center', background: 'white', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flexWrap: 'wrap' }}>
                            <img src={b.image.startsWith('http') ? b.image : `${BASE_URL}${b.image}`} alt={b.title} style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 6, background: '#f1f5f9' }} />
                            <div style={{ flex: '1 1 200px' }}>
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{b.title || '(No title)'}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{b.subtitle}</div>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>Link: {b.link} • Sort: {b.sortOrder}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginLeft: 'auto' }}>
                                <span onClick={() => toggleActive(b)} style={{ cursor: 'pointer', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, background: b.isActive ? '#f0fdf4' : '#fef2f2', color: b.isActive ? '#16a34a' : '#dc2626' }}>{b.isActive ? 'Active' : 'Hidden'}</span>
                                <button onClick={() => handleDelete(b._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BannerManagement;
