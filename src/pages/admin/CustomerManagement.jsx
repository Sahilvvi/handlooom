import React, { useState, useEffect } from 'react';
import BASE_URL from '../../utils/api';
import './CustomerManagement.css';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'customer' });
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState('');

    const fetchUsers = () => {
        const token = localStorage.getItem('jannat_token');
        fetch(`${BASE_URL}/api/auth/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                setCustomers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filtered = customers.filter(c =>
        `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setActionError('');
        const token = localStorage.getItem('jannat_token');

        try {
            const res = await fetch(`${BASE_URL}/api/auth/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create user');

            setShowModal(false);
            setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'customer' });
            fetchUsers();
        } catch (err) {
            setActionError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        if (!window.confirm(`Are you sure you want to make this user a ${newRole}?`)) return;

        const token = localStorage.getItem('jannat_token');
        try {
            const res = await fetch(`${BASE_URL}/api/auth/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update role');
            fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading customers...</div>;

    return (
        <div className="customer-management-page">
            <div className="customer-mgmt-header">
                <div className="cm-header-left">
                    <h2>User Management ({customers.length})</h2>
                </div>
                <div className="cm-header-actions">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="cm-search-input"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button onClick={() => setShowModal(true)} className="btn-add-user">
                        <span>+</span> Add New User
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', background: 'white', borderRadius: '12px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👥</div>
                    <p>{search ? 'No users match your search.' : 'No users found.'}</p>
                </div>
            ) : (
                <div className="cm-table-container">
                    <table className="cm-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c, i) => (
                                <tr key={c._id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="user-avatar">
                                                {c.firstName?.[0]}{c.lastName?.[0]}
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</span>
                                        </div>
                                    </td>
                                    <td>{c.email}</td>
                                    <td>
                                        <span className={`role-badge ${c.role === 'admin' ? 'role-admin' : 'role-customer'}`}>
                                            {c.role === 'admin' ? '⚙️ Admin' : '👤 Customer'}
                                        </span>
                                    </td>
                                    <td>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td>
                                        <button onClick={() => toggleRole(c._id, c.role)} className="btn-cm-action">
                                            {c.role === 'admin' ? 'Demote to Customer' : 'Make Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create User Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New User</h3>
                            <button onClick={() => setShowModal(false)} className="modal-close">&times;</button>
                        </div>

                        {actionError && <div style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', fontWeight: 500 }}>{actionError}</div>}

                        <form onSubmit={handleCreateUser} className="modal-form">
                            <div className="form-row">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>First Name</label>
                                    <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="form-input" />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Last Name</label>
                                    <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="form-input" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input required type="password" minLength={6} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="form-input">
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', background: '#EF6F31', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                                    {submitting ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManagement;
