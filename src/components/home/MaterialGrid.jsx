import React from 'react';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../../utils/api';
import useHomeSettings from '../../hooks/useHomeSettings';
import './MaterialGrid.css';

const MaterialGrid = () => {
    const { settings, loading } = useHomeSettings();

    if (loading) return null;

    const items = settings?.materials || [];

    if (items.length === 0) return null;

    return (
        <div className="material-grid">
            {items.map((item, index) => (
                <Link key={index} to={item.link || `/shop?search=${encodeURIComponent(item.name)}`} className="material-card-lux">
                    <div className="material-img-lux">
                        <img src={getImgUrl(item.image)} alt={item.name} onError={(e) => e.target.src = 'https://via.placeholder.com/300x300'} />
                    </div>
                    <div className="material-info">
                        <h3>{item.name}</h3>
                        {item.offer && <span className="material-label-lux">{item.offer}</span>}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default MaterialGrid;
