import React, { useState, useEffect } from 'react';
import BASE_URL from '../../utils/api';

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
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>
                    User Management ({customers.length})
                </h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', width: '240px', fontSize: '0.9rem', outline: 'none' }}
                    />
                    <button
                        onClick={() => setShowModal(true)}
                        style={{ padding: '10px 18px', background: '#EF6F31', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>+</span> Add New User
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', background: 'white', borderRadius: '8px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👥</div>
                    <p>{search ? 'No users match your search.' : 'No users found.'}</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Role</th>
                                <th style={thStyle}>Joined</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c, i) => (
                                <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                    <td style={tdStyle}>{i + 1}</td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '34px', height: '34px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #EF6F31, #f59e0b)',
                                                color: 'white', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                                            }}>
                                                {c.firstName?.[0]}{c.lastName?.[0]}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{c.firstName} {c.lastName}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{c.email}</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                                            background: c.role === 'admin' ? '#eff6ff' : '#f0fdf4',
                                            color: c.role === 'admin' ? '#1d4ed8' : '#16a34a'
                                        }}>
                                            {c.role === 'admin' ? '⚙️ Admin' : '👤 Customer'}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => toggleRole(c._id, c.role)}
                                            style={{
                                                padding: '6px 12px', borderRadius: '4px', border: '1px solid #cbd5e1',
                                                background: 'white', color: '#475569', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#475569'; }}
                                        >
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
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Add New User</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                        </div>

                        {actionError && <div style={{ padding: '10px', background: '#fef2f2', color: '#ef4444', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' }}>{actionError}</div>}

                        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>First Name</label>
                                    <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} style={inputStyle} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Last Name</label>
                                    <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} style={inputStyle} />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Password</label>
                                <input required type="password" minLength={6} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Role</label>
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={inputStyle}>
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '10px', background: '#EF6F31', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
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

const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '14px 16px', fontSize: '0.9rem', color: '#334155' };
const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };

export default CustomerManagement;
