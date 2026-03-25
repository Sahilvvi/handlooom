import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import BASE_URL from '../utils/api';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [activeFilters, setActiveFilters] = useState({
        category: 'All',
        material: 'All',
        color: 'All',
        room: 'All',
        priceRange: [0, 10000]
    });

    const query = new URLSearchParams(useLocation().search);
    const initialSearch = query.get('search') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/products`);
                const data = await res.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProducts();
        window.scrollTo(0, 0);
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = activeFilters.category === 'All' || p.category === activeFilters.category;
            const matchesMaterial = activeFilters.material === 'All' || p.material === activeFilters.material;
            const matchesColor = activeFilters.color === 'All' || p.color === activeFilters.color;
            const matchesRoom = activeFilters.room === 'All' || p.roomType === activeFilters.room;
            const matchesSearch = !initialSearch || 
                p.name.toLowerCase().includes(initialSearch.toLowerCase()) || 
                p.description.toLowerCase().includes(initialSearch.toLowerCase()) ||
                p.category.toLowerCase().includes(initialSearch.toLowerCase());
            
            return matchesCategory && matchesMaterial && matchesColor && matchesRoom && matchesSearch;
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            return b.createdAt - a.createdAt;
        });
    }, [products, activeFilters, sortBy, initialSearch]);

    const categories = ['All', ...new Set(products.map(p => p.category))];
    const materials = ['All', ...new Set(products.map(p => p.material))];
    const rooms = ['All', ...new Set(products.map(p => p.roomType).filter(Boolean))];

    if (loading) return <div className="shop-skeleton-container container"><div className="skeleton-hero"></div><div className="skeleton-content"><div className="skeleton-sidebar"></div><div className="skeleton-grid"></div></div></div>;

    return (
        <div className="shop-premium-page">
            <header className="shop-hero-ux">
                <div className="container">
                    <span className="breadcrumb-ux">Home / The Boutique</span>
                    <h1>The Artisanal Gallery</h1>
                    <p>Experience the finest handcrafted drapes, tailored specifically for the discerning home.</p>
                </div>
            </header>

            <div className="container">
                <div className="shop-layout-ux">
                    {/* Boutique Filtering Sidebar */}
                    <aside className="filters-sidebar-lux">
                        <div className="filter-widget">
                            <h3>Curated Collections</h3>
                            <div className="filter-options">
                                {categories.map(cat => (
                                    <button 
                                        key={cat} 
                                        className={`filter-chip-lux ${activeFilters.category === cat ? 'active' : ''}`}
                                        onClick={() => setActiveFilters({...activeFilters, category: cat})}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-widget">
                            <h3>Textbook Materials</h3>
                            <div className="filter-options">
                                {materials.map(mat => (
                                    <button 
                                        key={mat} 
                                        className={`filter-chip-lux ${activeFilters.material === mat ? 'active' : ''}`}
                                        onClick={() => setActiveFilters({...activeFilters, material: mat})}
                                    >
                                        {mat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {rooms.length > 1 && (
                            <div className="filter-widget">
                                <h3>Architectural Rooms</h3>
                                {rooms.map(room => (
                                    <div 
                                        key={room} 
                                        className={`premium-checkbox ${activeFilters.room === room ? 'active' : ''}`}
                                        onClick={() => setActiveFilters({...activeFilters, room: room})}
                                    >
                                        <div className="check-box-ui"></div>
                                        <span className="check-text">{room}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>

                    {/* Gallery Display */}
                    <main className="gallery-main-ux">
                        <section className="shop-controls-ux">
                            <span className="result-count">{filteredProducts.length} Curations Found</span>
                            <div className="sort-ui">
                                <span style={{ marginRight: '15px' }}>SORT BY:</span>
                                <select 
                                    className="sort-select-lux"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Latest Collections</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </section>

                        {filteredProducts.length > 0 ? (
                            <div className="products-grid-ux">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-shop-lux">
                                <h3>No Masterpieces Found</h3>
                                <p>Adjust your curated filters to discover other artisanal selections.</p>
                                <button className="btn-clear-lux" onClick={() => setActiveFilters({category: 'All', material: 'All', color: 'All', room: 'All', priceRange: [0, 10000]})}>
                                    Reset Selection
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
