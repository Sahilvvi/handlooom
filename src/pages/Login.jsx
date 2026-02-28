import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.token);
                if (data.user.role === 'admin') navigate('/admin');
                else navigate('/');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server connection error');
        }
    };

    return (
        <div className="login-page container">
            <div className="login-card fade-in">
                <h2>Login to Jannat</h2>
                <p>Access your account or manage the store.</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@jannathandloom.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-primary w-100">Login</button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup" style={{ color: '#ed6c0d', fontWeight: 600 }}>Create account</Link></p>
                    <p style={{ marginTop: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>Admin? Contact your manager to get access.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
