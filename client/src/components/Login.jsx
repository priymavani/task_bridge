import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Login.css';
import logo from '../assets/Logo.png';
import meeting_img from '../assets/login/login_i.png';
import Enter from '../Ui/Enter'; // Import the loader

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        team_code: '',
        password: '',
        role: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loader
        try {
            const response = await axios.post('https://task-bridge-eyh5.onrender.com/auth/login', formData);
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('user_email', JSON.stringify(response.data.user.email));
            sessionStorage.setItem('full_name', JSON.stringify(response.data.user.full_name));
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
            sessionStorage.setItem('role', JSON.stringify(response.data.user.role));
            sessionStorage.setItem('team_code', response.data.user.team_code);
            sessionStorage.setItem('userId', JSON.stringify(response.data.user.userID));

            setMessage(response.data.message);
            navigate(`/home`);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error during login');
        } finally {
            setLoading(false); // Stop loader after response
        }
    };

    return (
        <div className="login-container">
            {loading ? (
                <Enter /> // Show loader while logging in
            ) : (
                <>
                    <div className="login-left">
                        <div className="logo-container">
                            <img src={logo} alt="Task Bridge Logo" className="logo" />
                        </div>

                        <div className="login-content">
                            <h3>Continue with journey...</h3>
                            <h1>Login to Your Account</h1>

                            <div className="role-section">
                                <h4>Role</h4>
                                <div className="radio-group">
                                    <div className="radio-container">
                                        <input
                                            type="radio"
                                            id="admin"
                                            name="role"
                                            value="admin"
                                            checked={formData.role === 'admin'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="admin">Admin</label>
                                    </div>
                                    <div className="radio-container">
                                        <input
                                            type="radio"
                                            id="member"
                                            name="role"
                                            value="member"
                                            checked={formData.role === 'member'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="member">Member</label>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="team_code"
                                        placeholder="Team Code Ex-tema@321"
                                        value={formData.team_code}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="icon"></span>
                                </div>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="icon"></span>
                                </div>

                                <button type="submit" className="login-button" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Log - In'}
                                </button>

                                {message && <div className="message">{message}</div>}

                                <div className="signup-section">
                                    <p>Don't have an account?</p>
                                    <Link to="/signup" className="signup-link">
                                        Create new admin account
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="login-right">
                        <img src={meeting_img} alt="Team Meeting" />
                    </div>
                </>
            )}
        </div>
    );
};

export default Login;
