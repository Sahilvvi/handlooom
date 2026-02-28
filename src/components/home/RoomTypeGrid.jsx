import React from 'react';
import './RoomTypeGrid.css';

const rooms = [
    { title: 'Living Room', offer: 'UPTO 40% OFF', image: '/g1.png' },
    { title: 'Bedroom', offer: 'UPTO 45% OFF', image: '/g2.png' },
    { title: 'Kitchen', offer: 'UPTO 20% OFF', image: '/g1.png' },
    { title: 'Dining Room', offer: 'UPTO 35% OFF', image: '/g2.png' }
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
                        <div key={index} className="room-card-alt">
                            <div className="room-img-alt">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="room-info-alt">
                                <h3>{item.title}</h3>
                                <p className="offer-badge">{item.offer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoomTypeGrid;
