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
        <section className="room-type-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>Find the Perfect Curtains by Room Type</h2>
                    <p>Discover Ideal Curtain Styles for Every Space</p>
                </div>
                <div className="room-grid">
                    {items.map((item, index) => (
                        <Link key={index} to={item.link || `/shop?search=${encodeURIComponent(item.name)}`} className="room-card-alt">
                            <div className="room-img-alt">
                                <img src={getImgUrl(item.image)} alt={item.name} onError={(e) => e.target.src = 'https://via.placeholder.com/300x400'} />
                            </div>
                            <div className="room-info-alt">
                                <h3>{item.name}</h3>
                                {item.offer && <p className="offer-badge">{item.offer}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoomTypeGrid;
