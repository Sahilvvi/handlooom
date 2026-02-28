import React, { useState, useEffect } from 'react';
import './OrderManagement.css';

const statusOptions = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = { placed: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', shipped: '#06b6d4', delivered: '#16a34a', cancelled: '#ef4444' };

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('jannat_token');
            const res = await fetch('http://localhost:5000/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const token = localStorage.getItem('jannat_token');
            await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ orderStatus: newStatus })
            });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        } catch (err) { console.error(err); }
        setUpdatingId(null);
    };

    const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.orderStatus === filterStatus);

    if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading orders...</div>;

    return (
        <div className="order-management">
            <div className="om-header">
                <div className="om-summary">
                    <span>Total: <strong>{orders.length}</strong></span>
                    <span>Pending: <strong style={{ color: '#f59e0b' }}>{orders.filter(o => o.orderStatus === 'placed').length}</strong></span>
                    <span>Delivered: <strong style={{ color: '#16a34a' }}>{orders.filter(o => o.orderStatus === 'delivered').length}</strong></span>
                </div>
                <select className="status-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="all">All Orders</option>
                    {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>No orders found</div>
            ) : (
                <div className="orders-table-wrap">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => (
                                <tr key={order._id}>
                                    <td><strong>{order.orderNumber}</strong></td>
                                    <td>
                                        <div>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.shippingAddress?.email}</div>
                                    </td>
                                    <td>{order.items?.length} item{order.items?.length > 1 ? 's' : ''}</td>
                                    <td><strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong></td>
                                    <td>
                                        <span className={`pay-badge pay-${order.paymentStatus}`}>{order.paymentMode}</span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td>
                                        <span className="status-badge" style={{ background: statusColors[order.orderStatus] + '22', color: statusColors[order.orderStatus] }}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="status-select"
                                            value={order.orderStatus}
                                            disabled={updatingId === order._id}
                                            onChange={e => handleStatusUpdate(order._id, e.target.value)}
                                        >
                                            {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
