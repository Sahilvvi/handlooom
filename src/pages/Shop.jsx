import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import './Shop.css';

const Shop = () => {
    const { category: urlCategory } = useParams();
    const location = useLocation();
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sort, setSort] = useState('Recommended');

    // Advanced Filters State
    const [filters, setFilters] = useState({
        transparency: [],
        material: [],
        color: [],
        priceRange: [391, 2449],
        fastDelivery: false
    });

    const [appliedPriceRange, setAppliedPriceRange] = useState([391, 2449]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setAllProducts(data);
                setProducts(data);

                // Set initial price range based on data
                if (data.length > 0) {
                    const prices = data.map(p => p.price);
                    const min = Math.min(...prices);
                    const max = Math.max(...prices);
                    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
                    setAppliedPriceRange([min, max]);
                }

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

        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('search')?.toLowerCase() || '';

        let filtered = allProducts.filter(p => {
            const matchPrice = p.price >= appliedPriceRange[0] && p.price <= appliedPriceRange[1];
            const matchTransparency = filters.transparency.length === 0 || filters.transparency.includes(p.transparency);
            const matchMaterial = filters.material.length === 0 || filters.material.includes(p.material);
            const matchColor = filters.color.length === 0 || (p.colors && p.colors.some(c => filters.color.includes(c)));
            const matchCategory = !urlCategory || p.category.toLowerCase() === urlCategory.toLowerCase();
            const matchSearch = !searchTerm ||
                p.name.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm) ||
                (p.material && p.material.toLowerCase().includes(searchTerm));

            return matchPrice && matchTransparency && matchMaterial && matchColor && matchCategory && matchSearch;
        });

        if (sort === 'Price: Low to High') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'Price: High to Low') {
            filtered.sort((a, b) => b.price - a.price);
        }

        setProducts(filtered);
    }, [filters, appliedPriceRange, sort, allProducts, urlCategory, location.search]);

    const handleCheckboxChange = (type, value) => {
        setFilters(prev => {
            const current = prev[type];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    const handlePriceApply = () => {
        setAppliedPriceRange(filters.priceRange);
    };

    const handlePriceReset = () => {
        const prices = allProducts.map(p => p.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setFilters({
            transparency: [],
            material: [],
            color: [],
            priceRange: [min, max],
            fastDelivery: false
        });
        setAppliedPriceRange([min, max]);
    };

    const getCount = (type, value) => {
        return allProducts.filter(p => {
            if (type === 'color') return p.colors && p.colors.includes(value);
            return p[type] === value;
        }).length;
    };

    if (loading) return <div className="loading-container">Loading collection...</div>;

    const transparencyOptions = [...new Set(allProducts.map(p => p.transparency))].filter(Boolean).map(t => ({ label: t, count: getCount('transparency', t) }));
    const materialOptions = [...new Set(allProducts.map(p => p.material))].filter(Boolean).map(m => ({ label: m, count: getCount('material', m) }));
    const colorOptions = [
        { label: 'Brown', color: '#5D4037' },
        { label: 'Blue', color: '#1976D2' },
        { label: 'White', color: '#FFFFFF' },
        { label: 'Grey', color: '#9E9E9E' },
        { label: 'Beige', color: '#F5F5DC' }
    ].map(c => ({ ...c, count: getCount('color', c.label) })).filter(c => c.count > 0);

    return (
        <div className="shop-page">
            <div className="container shop-container">
                <aside className="shop-sidebar">
                    <div className="filter-section">
                        <h3>Filters</h3>
                        <div className="fast-delivery">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={filters.fastDelivery}
                                    onChange={(e) => setFilters({ ...filters, fastDelivery: e.target.checked })}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span>FAST DELIVERY</span>
                        </div>
                    </div>

                    <div className="filter-accordion">
                        <div className="accordion-item">
                            <div className="accordion-header">PRICE RANGE</div>
                            <div className="accordion-content">
                                <div className="price-inputs">
                                    <span>₹{filters.priceRange[0]}</span>
                                    <span>₹{filters.priceRange[1]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="391"
                                    max="2449"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                                    className="price-slider"
                                />
                                <div className="price-actions">
                                    <button className="apply-btn" onClick={handlePriceApply}>Apply</button>
                                    <button className="reset-link" onClick={handlePriceReset}>Reset</button>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <div className="accordion-header">TRANSPARENCY</div>
                            <div className="accordion-content">
                                {transparencyOptions.map(opt => (
                                    <label key={opt.label} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={filters.transparency.includes(opt.label)}
                                            onChange={() => handleCheckboxChange('transparency', opt.label)}
                                        />
                                        <span>{opt.label}</span>
                                        <span className="count">({opt.count})</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="accordion-item">
                            <div className="accordion-header">MATERIAL</div>
                            <div className="accordion-content">
                                {materialOptions.map(opt => (
                                    <label key={opt.label} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={filters.material.includes(opt.label)}
                                            onChange={() => handleCheckboxChange('material', opt.label)}
                                        />
                                        <span>{opt.label}</span>
                                        <span className="count">({opt.count})</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="accordion-item">
                            <div className="accordion-header">COLOR</div>
                            <div className="accordion-content">
                                {colorOptions.map(opt => (
                                    <label key={opt.label} className="checkbox-item color-item">
                                        <input
                                            type="checkbox"
                                            checked={filters.color.includes(opt.label)}
                                            onChange={() => handleCheckboxChange('color', opt.label)}
                                        />
                                        <span className="color-swatch" style={{ backgroundColor: opt.color, border: opt.label === 'White' ? '1px solid #ddd' : 'none' }}></span>
                                        <span>{opt.label}</span>
                                        <span className="count">({opt.count})</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="shop-main">
                    <div className="shop-top-bar">
                        <div className="sort-by">
                            <span>Sort By :</span>
                            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option>Recommended</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                        <div className="view-as">
                            <span>View As</span>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <div className="bar-icon"></div>
                                <div className="bar-icon"></div>
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <div className="bar-icon"></div>
                                <div className="bar-icon"></div>
                                <div className="bar-icon"></div>
                            </button>
                        </div>
                    </div>

                    <div className={`products-${viewMode}`}>
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="no-products">
                            <h3>No curtains found for these filters.</h3>
                            <button onClick={handlePriceReset} className="reset-all-btn">Reset All Filters</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
