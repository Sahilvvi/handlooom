import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Sheer',
        price: '',
        fabric: '',
        description: '',
        images: '',
        room: 'Living Room',
        stock: 50
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jannat_token');
            const productData = {
                ...formData,
                images: formData.images.split(',').map(s => s.trim())
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
            }
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };

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
                            <option value="Sheer">Sheer</option>
                            <option value="Blackout">Blackout</option>
                            <option value="Printed">Printed</option>
                            <option value="Linen">Linen</option>
                            <option value="Velvet">Velvet</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Price (₹)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Initial Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Fabric Details</label>
                    <input name="fabric" value={formData.fabric} onChange={handleChange} placeholder="e.g. 100% Pure Cotton" />
                </div>

                <div className="form-group">
                    <label>Image URLs (comma separated)</label>
                    <input name="images" value={formData.images} onChange={handleChange} placeholder="URL1, URL2..." />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required></textarea>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">Save Product</button>
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
