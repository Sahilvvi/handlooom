import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import BASE_URL, { getImgUrl } from '../../utils/api';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/products?page=${page}&limit=20`);
            const data = await res.json();
            
            if (data && data.products) {
                setProducts(data.products);
                setTotalPages(data.totalPages || 1);
            } else if (Array.isArray(data)) {
                setProducts(data);
                setTotalPages(1);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const token = localStorage.getItem('jannat_token');
            const res = await fetch(`${BASE_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchProducts();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('jannat_token');
            const res = await fetch(`${BASE_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            if (res.ok) fetchProducts();
        } catch (err) {
            console.error('Status update failed:', err);
        }
    };

    if (loading && products.length === 0) return <div style={{ padding: '40px', color: '#666' }}>Loading products...</div>;

    return (
        <div className="product-list-page">
            <div className="product-list-header">
                <div>
                    <h2>Products Inventory</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                        Showing {products.length} products (Newest First)
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link to="/admin/products/bulk" className="btn-add-product" style={{ background: '#1e293b' }}>🚀 Bulk Upload</Link>
                    <Link to="/admin/products/new" className="btn-add-product">+ Add Product</Link>
                </div>
            </div>

            <div className="product-list-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>
                                    <Link to={`/admin/products/edit/${product._id}`}>
                                        <img
                                            src={getImgUrl(product.images?.[0])}
                                            alt={product.name}
                                            className="admin-thumb"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                                        />
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/admin/products/edit/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>
                                        {product.name}
                                    </Link>
                                </td>
                                <td>{product.category}</td>
                                <td>₹{product.price?.toLocaleString('en-IN')}</td>
                                <td>
                                    <span 
                                        className={`status-badge ${product.isActive !== false ? 'active' : 'inactive'}`}
                                        onClick={() => toggleStatus(product._id, product.isActive !== false)}
                                        style={{ cursor: 'pointer' }}
                                        title="Click to toggle status"
                                    >
                                        {product.isActive !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="admin-actions-cell">
                                    <Link to={`/admin/products/edit/${product._id}`} className="btn-edit" title="Edit Product">✏️</Link>
                                    <button onClick={() => handleDelete(product._id)} className="btn-delete" title="Delete Product">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
                <div className="admin-pagination">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        className="pagi-btn"
                        style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 4, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        PREV
                    </button>
                    <div className="pagi-info" style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                    </div>
                    <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                        className="pagi-btn"
                        style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 4, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        NEXT
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;
