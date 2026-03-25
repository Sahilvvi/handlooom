import React from 'react';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../../utils/api';
import useHomeSettings from '../../hooks/useHomeSettings';
import './RoomTypeGrid.css';

const RoomTypeGrid = () => {
    const { settings, loading } = useHomeSettings();

    if (loading) return null;

    const items = settings?.rooms || [];

    if (items.length === 0) return null;

    return (
        <div className="room-grid">
            {items.map((item, index) => (
                <Link key={index} to={item.link || `/shop?search=${encodeURIComponent(item.name)}`} className="room-card-premium">
                    <div className="room-img-premium">
                        <img src={getImgUrl(item.image)} alt={item.name} onError={(e) => e.target.src = 'https://via.placeholder.com/400x600'} />
                    </div>
                    <div className="room-overlay-premium">
                        {item.offer && <span className="offer-premium">{item.offer}</span>}
                        <h3>{item.name}</h3>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default RoomTypeGrid;
