import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        revenue: 0
    });

    useEffect(() => {
        // In a real app, fetch these from backend
        setStats({
            totalProducts: 24,
            totalOrders: 156,
            totalCustomers: 48,
            revenue: 450000
        });
    }, []);

    return (
        <div className="dashboard-grid">
            <div className="stat-card">
                <h3>Total Products</h3>
                <p className="stat-value">{stats.totalProducts}</p>
            </div>
            <div className="stat-card">
                <h3>Recent Orders</h3>
                <p className="stat-value">{stats.totalOrders}</p>
            </div>
            <div className="stat-card">
                <h3>Active Customers</h3>
                <p className="stat-value">{stats.totalCustomers}</p>
            </div>
            <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-value">₹{stats.revenue.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default Dashboard;
