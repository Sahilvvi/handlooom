import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h1>Jannat <span>Admin</span></h1>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin">📊 Dashboard</Link>
                    <Link to="/admin/products">📦 Manage Products</Link>
                    <Link to="/admin/orders">🛒 Orders</Link>
                    <Link to="/">🌐 View Website</Link>
                </nav>
                <div className="admin-user-info">
                    <p>{user?.firstName} {user?.lastName}</p>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <h2>Admin Control Panel</h2>
                    <div className="admin-actions">
                        <Link to="/admin/products/new" className="btn-primary">Add New Product</Link>
                    </div>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
