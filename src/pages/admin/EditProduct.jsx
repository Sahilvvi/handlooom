import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddProduct.css';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '', category: 'Sheer', price: '', fabric: '',
        description: '', room: 'Living Room', stock: 50, colors: '', sizes: '', isBestSeller: false
    });

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(r => r.json())
            .then(data => {
                setFormData({
                    name: data.name || '',
                    category: data.category || 'Sheer',
                    price: data.price || '',
                    fabric: data.fabric || '',
                    description: data.description || '',
                    room: data.room || 'Living Room',
                    stock: data.stock || 50,
                    colors: (data.colors || []).join(', '),
                    sizes: (data.sizes || []).join(', '),
                    isBestSeller: data.isBestSeller || false
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('jannat_token');
            const productData = {
                ...formData,
                colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
                price: Number(formData.price),
                stock: Number(formData.stock)
            };
            delete productData.images; // Keep existing images in DB

            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(productData)
            });
            if (response.ok) navigate('/admin/products');
        } catch (err) { console.error(err); }
        setSaving(false);
    };

    if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading product...</div>;

    return (
        <div className="add-product-container">
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option>Sheer</option><option>Blackout</option><option>Printed</option>
                            <option>Linen</option><option>Velvet</option><option>Cotton</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Price (₹)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Colors (comma separated)</label>
                        <input name="colors" value={formData.colors} onChange={handleChange} placeholder="Ivory, Blue, Beige" />
                    </div>
                    <div className="form-group">
                        <label>Sizes (comma separated)</label>
                        <input name="sizes" value={formData.sizes} onChange={handleChange} placeholder="5ft, 7ft, 9ft" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Fabric Details</label>
                    <input name="fabric" value={formData.fabric} onChange={handleChange} placeholder="100% Pure Cotton" />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required></textarea>
                </div>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" name="isBestSeller" id="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} />
                    <label htmlFor="isBestSeller" style={{ marginBottom: 0 }}>Mark as Best Seller</label>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update Product'}</button>
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
