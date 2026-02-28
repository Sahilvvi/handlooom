import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Signup = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match'); return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password })
            });
            const data = await response.json();
            if (response.ok) {
                login(data.user, data.token);
                navigate('/account');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Server connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page container">
            <div className="login-card fade-in">
                <h2>Create Your Account</h2>
                <p>Join Jannat Handloom for exclusive offers and order tracking.</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Rahul" />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Sharma" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" minLength="6" />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn-primary w-100" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Already have an account? <Link to="/login" style={{ color: '#ed6c0d' }}>Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
