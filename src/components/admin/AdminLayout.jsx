import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const navLinks = [
        { to: "/admin", icon: "📊", label: "Dashboard" },
        { to: "/admin/products", icon: "📦", label: "Manage Products" },
        { to: "/admin/products/bulk", icon: "🚀", label: "Bulk Upload" },
        { to: "/admin/homepage", icon: "🏠", label: "Home Content" },
        { to: "/admin/orders", icon: "🛒", label: "Orders" },
        { to: "/admin/customers", icon: "👥", label: "Customers" },
        { to: "/admin/coupons", icon: "🏷️", label: "Coupons" },
        { to: "/admin/banners", icon: "🖼️", label: "Banners" },
        { to: "/admin/media", icon: "📁", label: "Media Library" },
        { to: "/", icon: "🌐", label: "View Website" },
    ];

    return (
        <div className={`admin-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Mobile Overlay */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

            <aside className={`admin-sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <div className="admin-logo">
                    <h1>Jannat <span>Admin</span></h1>
                    <button className="mobile-close" onClick={closeSidebar}>✕</button>
                </div>
                <nav className="admin-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={location.pathname === link.to ? 'active' : ''}
                            onClick={closeSidebar}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="admin-user-info">
                    <p>{user?.firstName} {user?.lastName}</p>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <button className="mobile-toggle" onClick={toggleSidebar}>☰</button>
                        <h2>Admin Control Panel</h2>
                    </div>
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
