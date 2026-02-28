import React from 'react';
import { Link } from 'react-router-dom';
import './RoomTypeGrid.css';

const rooms = [
    { title: 'Living Room', offer: 'UPTO 40% OFF', image: '/g1.png', search: 'living' },
    { title: 'Bedroom', offer: 'UPTO 45% OFF', image: '/g2.png', search: 'bedroom' },
    { title: 'Kitchen', offer: 'UPTO 20% OFF', image: '/g1.png', search: 'kitchen' },
    { title: 'Dining Room', offer: 'UPTO 35% OFF', image: '/g2.png', search: 'dining' }
];

const RoomTypeGrid = () => {
    return (
        <section className="room-type-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>Find the Perfect Curtains by Room Type</h2>
                    <p>Discover Ideal Curtain Styles for Every Space</p>
                </div>
                <div className="room-grid">
                    {rooms.map((item, index) => (
                        <Link key={index} to={`/shop?search=${encodeURIComponent(item.search)}`} className="room-card-alt">
                            <div className="room-img-alt">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="room-info-alt">
                                <h3>{item.title}</h3>
                                <p className="offer-badge">{item.offer}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoomTypeGrid;
