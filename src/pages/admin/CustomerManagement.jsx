import React, { useState, useEffect } from 'react';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jannat_token');
        fetch('http://localhost:5000/api/auth/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                setCustomers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = customers.filter(c =>
        `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading customers...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>
                    Customers ({customers.length})
                </h2>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', width: '280px', fontSize: '0.9rem' }}
                />
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👥</div>
                    <p>{search ? 'No customers match your search.' : 'No customers yet.'}</p>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Role</th>
                            <th style={thStyle}>Joined</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '14px 16px', fontSize: '0.9rem', color: '#334155' };

export default CustomerManagement;
