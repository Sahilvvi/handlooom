import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import BASE_URL from '../utils/api';
import './Shop.css';

const Shop = () => {
    const { category: urlCategory } = useParams();
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search')?.toLowerCase() || '';
    
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sort, setSort] = useState('Recommended');
    const [visibleCount, setVisibleCount] = useState(24);

    const [filters, setFilters] = useState({
        transparency: [],
        material: [],
        color: [],
        priceRange: [0, 10000],
    });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/products?limit=500`);
                const data = await res.json();
                const productsArray = data.products || data;
                setAllProducts(productsArray);
                
                if (productsArray.length > 0) {
                    const prices = productsArray.map(p => p.price);
                    setFilters(f => ({ ...f, priceRange: [Math.min(...prices), Math.max(...prices)] }));
                }
            } catch (err) {
                console.error("Shop fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = allProducts.filter(p => {
            const matchSearch = !searchTerm || 
                p.name.toLowerCase().includes(searchTerm) || 
                p.category.toLowerCase().includes(searchTerm) ||
                (p.tags && p.tags.join(' ').toLowerCase().includes(searchTerm));
            
            const matchCategory = !urlCategory || p.category.toLowerCase() === urlCategory.toLowerCase();
            const matchPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
            const matchTransparency = filters.transparency.length === 0 || filters.transparency.includes(p.transparency);
            const matchMaterial = filters.material.length === 0 || filters.material.includes(p.material);
            
            return matchSearch && matchCategory && matchPrice && matchTransparency && matchMaterial && (p.isActive !== false);
        });

        if (sort === 'Price: Low to High') result.sort((a,b) => a.price - b.price);
        if (sort === 'Price: High to Low') result.sort((a,b) => b.price - a.price);
        
        return result;
    }, [allProducts, searchTerm, urlCategory, filters, sort]);

    const displayProducts = filteredProducts.slice(0, visibleCount);

    const toggleFilter = (type, val) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(val) ? prev[type].filter(x => x !== val) : [...prev[type], val]
        }));
    };

    if (loading) return (
        <div className="shop-skeleton-container container">
            <div className="skeleton-hero"></div>
            <div className="skeleton-content">
                <div className="skeleton-sidebar"></div>
                <div className="skeleton-grid">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card"></div>)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="shop-premium-page">
            <header className="shop-hero-premium">
                <div className="container">
                    <span className="breadcrumb-alt">Collection / {urlCategory || 'All Designs'}</span>
                    <h1>{searchTerm ? `Results for "${searchTerm}"` : (urlCategory || 'Artisanal Collection')}</h1>
                    <p>{filteredProducts.length} unique masterpieces discovered</p>
                </div>
            </header>

            <div className="container shop-layout-premium">
                <aside className="filters-sidebar-premium">
                    <div className="filter-widget">
                        <h3>Materiality</h3>
                        <div className="filter-options">
                            {['Velvet', 'Linen', 'Cotton', 'Sheer', 'Silk'].map(m => (
                                <button 
                                    key={m} 
                                    className={`filter-chip ${filters.material.includes(m) ? 'active' : ''}`}
                                    onClick={() => toggleFilter('material', m)}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-widget">
                        <h3>Light Play</h3>
                        <div className="filter-options-stack">
                            {['Blackout', 'Room Darkening', 'Light Filtering', 'Sheer'].map(t => (
                                <label key={t} className="premium-checkbox">
                                    <input 
                                        type="checkbox" 
                                        checked={filters.transparency.includes(t)}
                                        onChange={() => toggleFilter('transparency', t)}
                                    />
                                    <span className="check-text">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-widget">
                        <h3>Price Refinement</h3>
                        <div className="price-slider-luxury">
                            <input 
                                type="range" 
                                min="0" 
                                max="10000" 
                                value={filters.priceRange[1]} 
                                onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                            />
                            <div className="price-labels">
                                <span>₹{filters.priceRange[0]}</span>
                                <span>₹{filters.priceRange[1]}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="shop-content-premium">
                    <div className="shop-controls-premium">
                        <div className="control-left">
                            <button className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>Grid</button>
                            <button className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>List</button>
                        </div>
                        <div className="control-right">
                            <span>Sort by:</span>
                            <select value={sort} onChange={e => setSort(e.target.value)}>
                                <option>Recommended</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className={`products-display-premium ${viewMode}`}>
                            {displayProducts.map(p => (
                                <ProductCard key={p._id} product={p} viewMode={viewMode} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-shop-premium">
                            <h2>No Designs Found</h2>
                            <p>Try refining your filters or search terms.</p>
                            <button onClick={() => setFilters({transparency:[], material:[], color:[], priceRange:[0, 10000]})} className="btn-clear">Clear All Filters</button>
                        </div>
                    )}

                    {filteredProducts.length > visibleCount && (
                        <div className="load-more-premium">
                            <button onClick={() => setVisibleCount(v => v + 24)}>Discover More</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
