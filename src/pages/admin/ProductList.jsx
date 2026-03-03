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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>
                                <img src={product.images[0] || 'https://via.placeholder.com/50'} alt={product.name} className="admin-thumb" />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>₹{product.price}</td>
                            <td>{product.stock}</td>
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
