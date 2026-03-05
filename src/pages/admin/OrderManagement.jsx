import React, { useState, useEffect } from 'react';
import BASE_URL from '../../utils/api';
import './OrderManagement.css';

const statusOptions = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = { placed: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', shipped: '#06b6d4', delivered: '#16a34a', cancelled: '#ef4444' };

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('jannat_token');
            const res = await fetch(`${BASE_URL}/api/orders`, {
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
            await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ orderStatus: newStatus })
            });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        } catch (err) { console.error(err); }
        setUpdatingId(null);
    };

    const filtered = orders.filter(o => {
        const matchStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
        const q = search.toLowerCase();
        const matchSearch = !q ||
            o.orderNumber?.toLowerCase().includes(q) ||
            `${o.shippingAddress?.firstName} ${o.shippingAddress?.lastName}`.toLowerCase().includes(q) ||
            o.shippingAddress?.email?.toLowerCase().includes(q);
        const orderDate = new Date(o.createdAt);
        const matchFrom = !dateFrom || orderDate >= new Date(dateFrom);
        const matchTo = !dateTo || orderDate <= new Date(dateTo + 'T23:59:59');
        return matchStatus && matchSearch && matchFrom && matchTo;
    });

    if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading orders...</div>;

    return (
        <div className="order-management">
            <div className="om-header">
                <div className="om-summary">
                    <span>Total: <strong>{orders.length}</strong></span>
                    <span>Pending: <strong style={{ color: '#f59e0b' }}>{orders.filter(o => o.orderStatus === 'placed').length}</strong></span>
                    <span>Delivered: <strong style={{ color: '#16a34a' }}>{orders.filter(o => o.orderStatus === 'delivered').length}</strong></span>
                </div>
                <input
                    type="text" placeholder="🔍 Search by order# or name..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.9rem', width: 220 }}
                />
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: 6 }} />
                    <span style={{ color: '#64748b' }}>to</span>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: 6 }} />
                    {(dateFrom || dateTo) && <button onClick={() => { setDateFrom(''); setDateTo(''); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>✕</button>}
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
                                    <td>
                                        <div className="om-items-cell">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="om-item-row">
                                                    <span className="om-item-name">{item.name}</span>
                                                    <span className="om-item-qty">x{item.quantity}</span>
                                                    {item.size && (
                                                        <span className="om-item-size" title="Customer Size Selection">
                                                            📏 {item.size}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
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
