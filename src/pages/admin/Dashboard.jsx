import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);


const statusColors = { placed: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', shipped: '#06b6d4', delivered: '#16a34a', cancelled: '#ef4444' };

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jannat_token');
        fetch('http://localhost:5000/api/orders/dashboard-stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading dashboard...</div>;

    return (
        <div className="dashboard-page">
            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fff9f5' }}>📦</div>
                    <div>
                        <p className="stat-label">Total Products</p>
                        <p className="stat-value">{stats?.totalProducts ?? 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f0fdf4' }}>🛒</div>
                    <div>
                        <p className="stat-label">Total Orders</p>
                        <p className="stat-value">{stats?.totalOrders ?? 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#eff6ff' }}>👥</div>
                    <div>
                        <p className="stat-label">Customers</p>
                        <p className="stat-value">{stats?.totalUsers ?? 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fdf4ff' }}>💰</div>
                    <div>
                        <p className="stat-label">Total Revenue</p>
                        <p className="stat-value">₹{(stats?.revenue ?? 0).toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    {/* Order Status Donut */}
                    <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <h3 style={{ marginBottom: 16, color: '#1e293b', fontSize: '1rem', fontWeight: 600 }}>Orders by Status</h3>
                        <div style={{ maxWidth: 220, margin: '0 auto' }}>
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
                                        ], backgroundColor: ['#f59e0b', '#3b82f6', '#06b6d4', '#16a34a', '#ef4444'], borderWidth: 0
                                    }]
                                }}
                                options={{ plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } } }, cutout: '65%' }}
                            />
                        </div>
                    </div>
                    {/* Revenue Bar */}
                    <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <h3 style={{ marginBottom: 16, color: '#1e293b', fontSize: '1rem', fontWeight: 600 }}>Recent Order Revenue (₹)</h3>
                        <Bar
                            data={{
                                labels: (stats.recentOrders || []).map(o => o.orderNumber?.slice(-4) || '').reverse(),
                                datasets: [{ label: 'Revenue', data: (stats.recentOrders || []).map(o => o.totalAmount || 0).reverse(), backgroundColor: 'rgba(239,111,49,0.75)', borderRadius: 4 }]
                            }}
                            options={{ plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { callback: v => '₹' + v.toLocaleString('en-IN') } } }, maintainAspectRatio: true }}
                        />
                    </div>
                </div>
            )}

            <div className="dashboard-bottom">
                <div className="recent-orders-section">
                    <div className="section-header">
                        <h3>Recent Orders</h3>
                        <Link to="/admin/orders" className="view-all-link">View All →</Link>
                    </div>
                    {(!stats?.recentOrders || stats.recentOrders.length === 0) ? (
                        <p style={{ color: '#94a3b8', padding: '20px 0' }}>No orders yet.</p>
                    ) : (
                        <table className="mini-orders-table">
                            <thead>
                                <tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order.orderNumber}</td>
                                        <td>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</td>
                                        <td>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span className="mini-status" style={{ background: statusColors[order.orderStatus] + '22', color: statusColors[order.orderStatus] }}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <Link to="/admin/products/new" className="quick-btn">+ Add New Product</Link>
                    <Link to="/admin/orders" className="quick-btn secondary">📋 Manage Orders</Link>
                    <Link to="/admin/coupons" className="quick-btn secondary">🏷️ Coupons</Link>
                    <Link to="/" className="quick-btn secondary">🌐 View Website</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
