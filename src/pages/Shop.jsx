import React, { useState, useEffect } from 'react';
import ProductCard from '../components/product/ProductCard';
import productsData from '../data/products.json';
import './Shop.css';

const Shop = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        category: 'All',
        priceRange: 'All',
        fabric: 'All',
        room: 'All'
    });
    const [sort, setSort] = useState('featured');

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setAllProducts(data);
                setProducts(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    useEffect(() => {
        if (allProducts.length === 0) return;

        let filtered = allProducts.filter(p => {
            const matchCat = filter.category === 'All' || p.category === filter.category;
            const matchRoom = filter.room === 'All' || p.room === filter.room;
            const matchFabric = filter.fabric === 'All' || (p.fabric && p.fabric.includes(filter.fabric));

            let matchPrice = true;
            if (filter.priceRange !== 'All') {
                const [min, max] = filter.priceRange.split('-').map(Number);
                if (max) {
                    matchPrice = p.price >= min && p.price <= max;
                } else {
                    matchPrice = p.price >= min;
                }
            }

            return matchCat && matchRoom && matchFabric && matchPrice;
        });

        if (sort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        }

        setProducts(filtered);
    }, [filter, sort, allProducts]);

    const categories = ['All', ...new Set(allProducts.map(p => p.category))];
    const rooms = ['All', ...new Set(allProducts.map(p => p.room))];
    const fabrics = ['All', 'Linen', 'Velvet', 'Cotton', 'Silk', 'Jacquard'];

    if (loading) return <div className="loading-container">Loading collection...</div>;

    return (
        <div className="shop-page container">
            <div className="shop-header">
                <h1>All Curtains</h1>
                <p>Discover our exclusive range of handloom and luxury drapes.</p>
            </div>

            <div className="shop-layout">
                <aside className="shop-sidebar">
                    <div className="filter-group">
                        <h4>Category</h4>
                        <ul>
                            {categories.map(cat => (
                                <li key={cat}>
                                    <button
                                        className={filter.category === cat ? 'active' : ''}
                                        onClick={() => setFilter({ ...filter, category: cat })}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-group">
                        <h4>Room</h4>
                        <ul>
                            {rooms.map(room => (
                                <li key={room}>
                                    <button
                                        className={filter.room === room ? 'active' : ''}
                                        onClick={() => setFilter({ ...filter, room: room })}
                                    >
                                        {room}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-group">
                        <h4>Price Range</h4>
                        <ul>
                            {['All', '0-1500', '1500-2500', '2500-3500', '3500'].map(range => (
                                <li key={range}>
                                    <button
                                        className={filter.priceRange === range ? 'active' : ''}
                                        onClick={() => setFilter({ ...filter, priceRange: range })}
                                    >
                                        {range === 'All' ? 'All Prices' : range === '3500' ? 'Above ₹3,500' : `₹${range.replace('-', ' - ₹')}`}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-group">
                        <h4>Fabric</h4>
                        <ul>
                            {fabrics.map(f => (
                                <li key={f}>
                                    <button
                                        className={filter.fabric === f ? 'active' : ''}
                                        onClick={() => setFilter({ ...filter, fabric: f })}
                                    >
                                        {f}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <main className="shop-content">
                    <div className="shop-toolbar">
                        <span className="results-count">{products.length} products found</span>
                        <div className="sort-wrapper">
                            <label>Sort by:</label>
                            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="shop-product-grid">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="no-results">
                            <h3>No products found</h3>
                            <p>Try adjusting your filters to find what you're looking for.</p>
                            <button className="btn-primary" onClick={() => setFilter({ category: 'All', priceRange: 'All', fabric: 'All', room: 'All' })}>Clear All Filters</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
