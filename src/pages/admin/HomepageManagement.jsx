import React, { useState, useEffect } from 'react';
import BASE_URL, { getImgUrl } from '../../utils/api';
import './HomepageManagement.css';

const HomepageManagement = () => {
    const [settings, setSettings] = useState({
        heroSlides: [],
        categories: [],
        promoBanners: [],
        rooms: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('jannat_token');

    useEffect(() => {
        fetch(`${BASE_URL}/api/home`)
            .then(r => r.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch(`${BASE_URL}/api/home`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setMessage('✅ Homepage settings updated successfully!');
            } else {
                setMessage('❌ Failed to update settings.');
            }
        } catch (err) {
            setMessage('❌ Error connecting to server.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e, section, index, field = 'image') => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${BASE_URL}/api/upload/single`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                const newSettings = { ...settings };
                newSettings[section][index][field] = data.url;
                setSettings(newSettings);
            }
        } catch (err) {
            alert('Upload failed');
        }
    };

    const addItem = (section, defaultObj) => {
        const newSettings = { ...settings };
        newSettings[section] = [...(newSettings[section] || []), defaultObj];
        setSettings(newSettings);
    };

    const removeItem = (section, index) => {
        const newSettings = { ...settings };
        newSettings[section] = newSettings[section].filter((_, i) => i !== index);
        setSettings(newSettings);
    };

    const updateField = (section, index, field, value) => {
        const newSettings = { ...settings };
        newSettings[section][index][field] = value;
        setSettings(newSettings);
    };

    if (loading) return <div style={{ padding: '40px' }}>Loading Homepage Editor...</div>;

    return (
        <div className="homepage-mgmt-page">
            <div className="h-header">
                <h2>🏠 Website Content Manager</h2>
                <button onClick={handleSave} disabled={saving} className="btn-save-home">
                    {saving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>

            {message && <div className={`h-alert ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

            <p className="h-tip">Update your homepage banners, category images, and sections below. Click "Save All Changes" at the top when finished.</p>

            {/* HERO SLIDER */}
            <section className="h-section">
                <h3>1. Hero Slider Banners (Main Top Banner)</h3>
                <div className="h-grid">
                    {settings.heroSlides?.map((slide, idx) => (
                        <div key={idx} className="h-card">
                            <div className="h-card-img">
                                <img src={getImgUrl(slide.image)} alt="Slide" onError={(e) => e.target.src = 'https://via.placeholder.com/300x150'} />
                                <input type="file" onChange={(e) => handleImageUpload(e, 'heroSlides', idx)} />
                            </div>
                            <div className="h-card-fields">
                                <input type="text" placeholder="Title Line 1" value={slide.title} onChange={e => updateField('heroSlides', idx, 'title', e.target.value)} />
                                <input type="text" placeholder="Subtitle Line 2" value={slide.subtitle} onChange={e => updateField('heroSlides', idx, 'subtitle', e.target.value)} />
                                <input type="text" placeholder="Small Label (Top)" value={slide.label} onChange={e => updateField('heroSlides', idx, 'label', e.target.value)} />
                                <input type="text" placeholder="Button Label" value={slide.cta} onChange={e => updateField('heroSlides', idx, 'cta', e.target.value)} />
                                <button className="btn-remove" onClick={() => removeItem('heroSlides', idx)}>Remove Slide</button>
                            </div>
                        </div>
                    ))}
                    <button className="btn-add-item" onClick={() => addItem('heroSlides', { title: '', subtitle: '', label: '', cta: 'Shop Now', image: '' })}>
                        + Add New Slide
                    </button>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="h-section">
                <h3>2. Category Section Images (Shop by Category)</h3>
                <div className="h-grid small">
                    {settings.categories?.map((cat, idx) => (
                        <div key={idx} className="h-card compact">
                            <div className="h-card-img">
                                <img src={getImgUrl(cat.image)} alt="Category" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                                <input type="file" onChange={(e) => handleImageUpload(e, 'categories', idx)} />
                            </div>
                            <input type="text" placeholder="Category Name" value={cat.name} onChange={e => updateField('categories', idx, 'name', e.target.value)} />
                            <button className="btn-remove small" onClick={() => removeItem('categories', idx)}>✕</button>
                        </div>
                    ))}
                    <button className="btn-add-item" onClick={() => addItem('categories', { name: '', image: '', link: '/shop' })}>
                        + Add Category
                    </button>
                </div>
            </section>

             {/* ROOMS */}
             <section className="h-section">
                <h3>3. Section Images (Shop by Room)</h3>
                <div className="h-grid small">
                    {settings.rooms?.map((room, idx) => (
                        <div key={idx} className="h-card compact">
                            <div className="h-card-img">
                                <img src={getImgUrl(room.image)} alt="Room" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                                <input type="file" onChange={(e) => handleImageUpload(e, 'rooms', idx)} />
                            </div>
                            <input type="text" placeholder="Room Name" value={room.name} onChange={e => updateField('rooms', idx, 'name', e.target.value)} />
                            <button className="btn-remove small" onClick={() => removeItem('rooms', idx)}>✕</button>
                        </div>
                    ))}
                    <button className="btn-add-item" onClick={() => addItem('rooms', { name: '', image: '', link: '/shop' })}>
                        + Add Room
                    </button>
                </div>
            </section>

             {/* COLORS */}
             <section className="h-section">
                <h3>4. Shop by Colors (Homepage Grid)</h3>
                <div className="h-grid small">
                    {settings.colors?.map((item, idx) => (
                        <div key={idx} className="h-card compact">
                            <div className="h-card-img circle">
                                <img src={getImgUrl(item.image)} alt="Color" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                                <input type="file" onChange={(e) => handleImageUpload(e, 'colors', idx)} />
                            </div>
                            <input type="text" placeholder="Color Name" value={item.name} onChange={e => updateField('colors', idx, 'name', e.target.value)} />
                            <button className="btn-remove small" onClick={() => removeItem('colors', idx)}>✕</button>
                        </div>
                    ))}
                    <button className="btn-add-item" onClick={() => addItem('colors', { name: '', image: '', link: '/shop' })}>
                        + Add Color
                    </button>
                </div>
            </section>

             {/* MATERIALS */}
             <section className="h-section">
                <h3>5. Shop by Materials (Homepage Grid)</h3>
                <div className="h-grid small">
                    {settings.materials?.map((item, idx) => (
                        <div key={idx} className="h-card compact">
                            <div className="h-card-img">
                                <img src={getImgUrl(item.image)} alt="Material" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                                <input type="file" onChange={(e) => handleImageUpload(e, 'materials', idx)} />
                            </div>
                            <input type="text" placeholder="Material Name" value={item.name} onChange={e => updateField('materials', idx, 'name', e.target.value)} />
                            <button className="btn-remove small" onClick={() => removeItem('materials', idx)}>✕</button>
                        </div>
                    ))}
                    <button className="btn-add-item" onClick={() => addItem('materials', { name: '', image: '', link: '/shop' })}>
                        + Add Material
                    </button>
                </div>
            </section>

            {/* PROMO BANNERS */}
            <section className="h-section">
                <h3>6. Promotional Wide Banners</h3>
                <div className="h-grid">
                    {settings.promoBanners?.map((banner, idx) => (
                        <div key={idx} className="h-card">
                            <div className="h-card-img wide">
                                <img src={getImgUrl(banner.image)} alt="Promo" onError={(e) => e.target.src = 'https://via.placeholder.com/800x200'} />
                                <input type="file" onChange={(e) => handleImageUpload(e, 'promoBanners', idx)} />
                            </div>
                            <div className="h-card-fields">
                                <input type="text" placeholder="Banner Title" value={banner.title} onChange={e => updateField('promoBanners', idx, 'title', e.target.value)} />
                                <input type="text" placeholder="Redirect Link" value={banner.link} onChange={e => updateField('promoBanners', idx, 'link', e.target.value)} />
                                <button className="btn-remove" onClick={() => removeItem('promoBanners', idx)}>Remove Banner</button>
                            </div>
                        </div>
                    ))}
                    <button className="btn-add-item" onClick={() => addItem('promoBanners', { title: '', image: '', link: '/shop' })}>
                        + Add Promo Banner
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomepageManagement;
