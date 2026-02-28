import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Account.css';

const Account = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const [profile, setProfile] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '' });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        const token = localStorage.getItem('jannat_token');
        fetch('http://localhost:5000/api/orders/my-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()).then(data => {
            setOrders(Array.isArray(data) ? data : []);
            setLoadingOrders(false);
        }).catch(() => setLoadingOrders(false));
    }, [user]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('jannat_token');
        await fetch('http://localhost:5000/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(profile)
        });
        setSaving(false);
        setSaveMsg('Profile updated successfully!');
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const handleLogout = () => { logout(); navigate('/'); };

    const statusColor = { placed: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', shipped: '#06b6d4', delivered: '#16a34a', cancelled: '#ef4444' };

    return (
        <div className="account-page container">
            <div className="account-header">
                <div>
                    <h1>Hello, {user?.firstName}! 👋</h1>
                    <p>Manage your orders and account details</p>
                </div>
                <button className="btn-logout-account" onClick={handleLogout}>Logout</button>
            </div>

            <div className="account-layout">
                <aside className="account-sidebar">
                    <div className="user-avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                    <div className="user-name">{user?.firstName} {user?.lastName}</div>
                    <div className="user-email">{user?.email}</div>
                    <nav className="account-nav">
                        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📦 My Orders</button>
                        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>👤 Profile</button>
                        {user?.role === 'admin' && <Link to="/admin" className="admin-link-btn">⚙️ Admin Panel</Link>}
                    </nav>
                </aside>

                <div className="account-content">
                    {activeTab === 'orders' && (
                        <div className="orders-tab">
                            <h2>My Orders</h2>
                            {loadingOrders ? <div className="loading-text">Loading orders...</div> : orders.length === 0 ? (
                                <div className="no-orders">
                                    <p>No orders yet.</p>
                                    <Link to="/shop" className="btn-shop-link">Start Shopping →</Link>
                                </div>
                            ) : (
                                <div className="orders-list">
                                    {orders.map(order => (
                                        <div key={order._id} className="order-card">
                                            <div className="order-card-top">
                                                <div>
                                                    <span className="order-number">#{order.orderNumber}</span>
                                                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <span className="order-status" style={{ background: statusColor[order.orderStatus] + '22', color: statusColor[order.orderStatus] }}>
                                                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                </span>
                                            </div>
                                            <div className="order-items-preview">
                                                {order.items.map((item, i) => (
                                                    <span key={i}>{item.name} × {item.quantity}</span>
                                                ))}
                                            </div>
                                            <div className="order-card-bottom">
                                                <span className="order-total">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                                <span className="order-payment">{order.paymentMode} · {order.paymentStatus}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="profile-tab">
                            <h2>Edit Profile</h2>
                            {saveMsg && <div className="save-success">{saveMsg}</div>}
                            <form onSubmit={handleSaveProfile} className="profile-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input value={profile.email} disabled className="input-disabled" />
                                </div>
                                <button type="submit" className="btn-save-profile" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Account;
