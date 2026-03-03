import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

const CATEGORIES = ['Sheer', 'Blackout', 'Printed', 'Linen', 'Velvet'];
const ROOMS = ['Living Room', 'Bedroom', 'Dining Area', 'Kids Room', 'Office'];
const TRANSPARENCIES = ['Sheer', 'Semi-Sheer', 'Opaque', 'Blackout'];
const MATERIALS = ['Cotton', 'Polyester', 'Linen', 'Velvet', 'Silk Blend', 'Jute', 'Organza'];

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Sheer',
        price: '',
        originalPrice: '',
        fabric: '',
        material: 'Cotton',
        transparency: 'Semi-Sheer',
        description: '',
        images: '',
        room: 'Living Room',
        isBestSeller: false,
        fastDelivery: false,
        stock: 50,
        sizes: '',
        colors: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('jannat_token');
            const productData = {
                ...formData,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                stock: Number(formData.stock),
                images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
                colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean)
            };

            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                navigate('/admin/products');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to create product');
            }
        } catch (err) {
            setError('Server connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <h2 className="form-title">Add New Product</h2>
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleSubmit} className="admin-form">
                {/* Name + Category */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Noor Linen Sheer Curtain" />
                    </div>
                    <div className="form-group">
                        <label>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Price + Original Price */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Selling Price (₹) *</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 1899" min="1" />
                    </div>
                    <div className="form-group">
                        <label>Original / MRP (₹)</label>
                        <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="e.g. 3799 (for discount display)" min="1" />
                    </div>
                </div>

                {/* Material + Transparency */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Material *</label>
                        <select name="material" value={formData.material} onChange={handleChange}>
                            {MATERIALS.map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Transparency *</label>
                        <select name="transparency" value={formData.transparency} onChange={handleChange}>
                            {TRANSPARENCIES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                {/* Fabric + Room */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Fabric Details *</label>
                        <input name="fabric" value={formData.fabric} onChange={handleChange} required placeholder="e.g. 100% Pure Cotton" />
                    </div>
                    <div className="form-group">
                        <label>Room Type</label>
                        <select name="room" value={formData.room} onChange={handleChange}>
                            {ROOMS.map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                </div>

                {/* Sizes + Colors */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Available Sizes (comma-separated)</label>
                        <input name="sizes" value={formData.sizes} onChange={handleChange} placeholder="5ft, 7ft, 9ft" />
                    </div>
                    <div className="form-group">
                        <label>Available Colors (comma-separated)</label>
                        <input name="colors" value={formData.colors} onChange={handleChange} placeholder="Ivory, White, Beige" />
                    </div>
                </div>

                {/* Images + Stock */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Image URLs (comma-separated)</label>
                        <input name="images" value={formData.images} onChange={handleChange} placeholder="https://... , https://..." />
                    </div>
                    <div className="form-group">
                        <label>Stock Quantity *</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
                    </div>
                </div>

                {/* Description */}
                <div className="form-group">
                    <label>Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required placeholder="Write a detailed product description..."></textarea>
                </div>

                {/* Checkboxes */}
                <div className="form-row checkboxes-row">
                    <label className="checkbox-label">
                        <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} />
                        <span>⭐ Mark as Best Seller</span>
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name="fastDelivery" checked={formData.fastDelivery} onChange={handleChange} />
                        <span>⚡ Fast Delivery Available</span>
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : '✅ Save Product'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
