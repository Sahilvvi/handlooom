import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BASE_URL from '../../utils/api';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/products`);
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('jannat_token');
                const response = await fetch(`${BASE_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    setProducts(products.filter(p => p._id !== id));
                }
            } catch (err) {
                console.error('Error deleting product:', err);
            }
        }
    };

    const handleToggleStatus = async (product) => {
        try {
            const token = localStorage.getItem('jannat_token');
            const res = await fetch(`${BASE_URL}/api/products/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ isActive: !product.isActive })
            });
            if (res.ok) {
                setProducts(products.map(p => p._id === product._id ? { ...p, isActive: !p.isActive } : p));
            }
        } catch (err) {
            console.error('Error toggling status:', err);
        }
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h2>Products ({products.length})</h2>
                <Link to="/admin/products/new" className="btn-add-product">+ Add New Product</Link>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id} style={{ opacity: product.isActive ? 1 : 0.6 }}>
                            <td>
                                <img
                                    src={product.images[0]?.startsWith('http') ? product.images[0] : `${BASE_URL}${product.images[0]}`}
                                    alt={product.name}
                                    className="admin-thumb"
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>₹{product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                                <span
                                    onClick={() => handleToggleStatus(product)}
                                    className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {product.isActive ? '✅ Active' : '🚫 Disabled'}
                                </span>
                            </td>
                            <td className="admin-actions-cell">
                                <Link to={`/admin/products/edit/${product._id}`} className="btn-edit">Edit</Link>
                                <button onClick={() => handleDelete(product._id)} className="btn-delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
