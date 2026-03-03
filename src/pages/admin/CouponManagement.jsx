import React, { useState, useEffect } from 'react';
import BASE_URL from '../../utils/api';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: 100, expiresAt: '', isActive: true
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem('jannat_token');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const fetch_coupons = () => {
        setLoading(true);
        fetch(`${BASE_URL}/api/coupons`, { headers })
            .then(r => r.json()).then(data => { setCoupons(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(fetch_coupons, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setError('');
        try {
            const res = await fetch(`${BASE_URL}/api/coupons`, { method: 'POST', headers, body: JSON.stringify(form) });
            if (res.ok) { setShowForm(false); setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: 100, expiresAt: '', isActive: true }); fetch_coupons(); }
            else { const d = await res.json(); setError(d.message); }
        } catch { setError('Server error'); } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        await fetch(`${BASE_URL}/api/coupons/${id}`, { method: 'DELETE', headers });
        fetch_coupons();
    };

    const toggleActive = async (coupon) => {
        await fetch(`${BASE_URL}/api/coupons/${coupon._id}`, { method: 'PUT', headers, body: JSON.stringify({ isActive: !coupon.isActive }) });
        fetch_coupons();
    };

    if (loading) return <div style={pad}>Loading coupons...</div>;

    return (
        <div style={pad}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={h2}>Coupons ({coupons.length})</h2>
                <button onClick={() => setShowForm(!showForm)} style={btnAdd}>{showForm ? 'Cancel' : '+ Create Coupon'}</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: 24, borderRadius: 10, marginBottom: 24, border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginBottom: 16, color: '#1e293b' }}>New Coupon</h3>
                    {error && <p style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {[['code', 'Code (e.g. SAVE20)', 'text'], ['discountValue', 'Discount Value', 'number'], ['minOrderAmount', 'Min Order (₹)', 'number']].map(([n, ph, t]) => (
                            <div key={n}><label style={lbl}>{ph}</label><input style={inp} name={n} value={form[n]} placeholder={ph} type={t} onChange={e => setForm({ ...form, [n]: e.target.value })} required={n !== 'minOrderAmount'} /></div>
                        ))}
                        <div><label style={lbl}>Type</label><select style={inp} value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}><option value="percentage">Percentage (%)</option><option value="flat">Flat (₹)</option></select></div>
                        <div><label style={lbl}>Max Uses</label><input style={inp} type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} /></div>
                        <div><label style={lbl}>Expires At</label><input style={inp} type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} /></div>
                    </div>
                    <button type="submit" style={{ ...btnAdd, marginTop: 16 }} disabled={saving}>{saving ? 'Saving...' : '✅ Save Coupon'}</button>
                </form>
            )}

            {coupons.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>No coupons yet. Create your first coupon above.</div>
            ) : (
                <table style={tbl}>
                    <thead><tr style={thead}>
                        {['Code', 'Type', 'Discount', 'Min Order', 'Uses', 'Expires', 'Status', 'Actions'].map(h => (
                            <th key={h} style={th}>{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {coupons.map(c => (
                            <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={td}><strong style={{ fontFamily: 'monospace', color: '#EF6F31' }}>{c.code}</strong></td>
                                <td style={td}>{c.discountType}</td>
                                <td style={td}>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                                <td style={td}>₹{c.minOrderAmount || 0}</td>
                                <td style={td}>{c.usedCount}/{c.maxUses}</td>
                                <td style={td}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : '—'}</td>
                                <td style={td}><span onClick={() => toggleActive(c)} style={{ cursor: 'pointer', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, background: c.isActive ? '#f0fdf4' : '#fef2f2', color: c.isActive ? '#16a34a' : '#dc2626' }}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                                <td style={td}><button onClick={() => handleDelete(c._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const pad = { padding: 24 };
const h2 = { fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' };
const btnAdd = { background: '#EF6F31', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' };
const lbl = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' };
const inp = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.9rem', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' };
const tbl = { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' };
const thead = { background: '#f8fafc', borderBottom: '2px solid #e2e8f0' };
const th = { padding: '12px 14px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' };
const td = { padding: '14px', fontSize: '0.9rem', color: '#334155' };

export default CouponManagement;
