import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import BASE_URL from '../../utils/api';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const statusColors = { placed: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', shipped: '#06b6d4', delivered: '#16a34a', cancelled: '#ef4444' };

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jannat_token');
        fetch(`${BASE_URL}/api/orders/dashboard-stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: '80px', color: '#666', textAlign: 'center', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Consulting Artisanal Data...</div>;

    return (
        <div className="dashboard-page">
            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f8f7f2', color: '#c5a059' }}>📦</div>
                    <div>
                        <p className="stat-label">Artisanal Gallery</p>
                        <p className="stat-value">{stats?.totalProducts ?? 0} Masterpieces</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f8f7f2', color: '#c5a059' }}>🛒</div>
                    <div>
                        <p className="stat-label">Boutique Orders</p>
                        <p className="stat-value">{stats?.totalOrders ?? 0} Selections</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f8f7f2', color: '#c5a059' }}>👥</div>
                    <div>
                        <p className="stat-label">Elite Clientele</p>
                        <p className="stat-value">{stats?.totalUsers ?? 0} Verified</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f8f7f2', color: '#c5a059' }}>💰</div>
                    <div>
                        <p className="stat-label">Boutique Revenue</p>
                        <p className="stat-value">₹{(stats?.revenue ?? 0).toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            {stats && (
                <div className="dashboard-charts">
                    <div className="chart-container">
                        <h3 className="chart-title">Selection Status Distribution</h3>
                        <div className="donut-wrapper">
                            <Doughnut
                                data={{
                                    labels: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
                                    datasets: [{
                                        data: [
                                            stats.recentOrders?.filter(o => o.orderStatus === 'placed').length || 0,
                                            stats.recentOrders?.filter(o => o.orderStatus === 'confirmed').length || 0,
                                            stats.recentOrders?.filter(o => o.orderStatus === 'shipped').length || 0,
                                            stats.recentOrders?.filter(o => o.orderStatus === 'delivered').length || 0,
                                            stats.recentOrders?.filter(o => o.orderStatus === 'cancelled').length || 0,
                                        ], backgroundColor: ['#C5A059', '#121212', '#F8F7F2', '#16a34a', '#ef4444'], borderWidth: 1, borderColor: '#eee'
                                    }]
                                }}
                                options={{
                                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true, font: { size: 10, weight: '800' } } } },
                                    cutout: '75%',
                                    maintainAspectRatio: false
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className="chart-container">
                        <h3 className="chart-title">Recent Boutique Performance (₹)</h3>
                        <div className="bar-wrapper">
                            <Bar
                                data={{
                                    labels: (stats.recentOrders || []).map(o => o.orderNumber?.slice(-4) || '').reverse(),
                                    datasets: [{ label: 'Revenue', data: (stats.recentOrders || []).map(o => o.totalAmount || 0).reverse(), backgroundColor: '#C5A059', borderRadius: 2 }]
                                }}
                                options={{
                                    plugins: { legend: { display: false } },
                                    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f9f9f9' } } },
                                    maintainAspectRatio: false
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-bottom">
                <div className="recent-orders-section">
                    <div className="section-header">
                        <h3>Recent Boutique Activity</h3>
                        <Link to="/admin/orders" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--admin-gold)', textTransform: 'uppercase' }}>View All Activity →</Link>
                    </div>
                    {(!stats?.recentOrders || stats.recentOrders.length === 0) ? (
                        <p style={{ color: '#94a3b8', padding: '40px 0', textAlign: 'center' }}>No recent selections found.</p>
                    ) : (
                        <div className="orders-table-scroll">
                            <table className="mini-orders-table">
                                <thead>
                                    <tr><th>Ref #</th><th>Patron</th><th>Investment</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.slice(0, 5).map(order => (
                                        <tr key={order._id}>
                                            <td style={{ fontWeight: 800 }}>{order.orderNumber}</td>
                                            <td>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                                            <td style={{ color: 'var(--admin-gold)', fontWeight: 800 }}>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                                            <td>
                                                <span className="mini-status" style={{ background: statusColors[order.orderStatus] + '11', color: statusColors[order.orderStatus], border: `1px solid ${statusColors[order.orderStatus]}33` }}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="quick-actions">
                    <h3 style={{ marginBottom: '30px', fontSize: '0.9rem', fontWeight: 800 }}>Management Concierge</h3>
                    <Link to="/admin/products/new" className="quick-btn">+ Catalog New Drape</Link>
                    <Link to="/admin/orders" className="quick-btn secondary">📋 Review Selections</Link>
                    <Link to="/admin/coupons" className="quick-btn secondary">🏷️ Promotion Center</Link>
                    <Link to="/" className="quick-btn secondary">🌐 Visit Boutique</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
