import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Signup.css';
import home_i from '../assets/home_i.png';
import logo from '../assets/Logo.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        team_code: '',
        full_name: '',
        title: '',
        email: '',
        role: 'admin', // Default role
        password: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loader state
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader

        try {
            const response = await axios.post('https://task-bridge-eyh5.onrender.com/auth/signup', formData);
            setMessage(response.data.message);
            toast.success(response.data.message); // Show success toast
            navigate('/login'); // Redirect to login after successful signup
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error during signup';
            setMessage(errorMessage);
            toast.error(errorMessage); // Show error toast
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-left">
                <div className="logo-container">
                    <img src={logo} alt="Task Bridge Logo" className="logo" />
                </div>

                <div className="signup-content">
                    <h3>Join Team</h3>
                    <h1>Create new account</h1>

                    <div className="role-section">
                        <h4>Role</h4>
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
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                name="full_name"
                                placeholder="Full Name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                            <span className="icon"></span>
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

                        <div className="input-group">
                            <input
                                type="text"
                                name="team_code"
                                placeholder="Create Team Code Ex-tema@321"
                                value={formData.team_code}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Hidden title field with default value if needed */}
                        <input
                            type="hidden"
                            name="title"
                            value={formData.title || 'Member'}
                            onChange={handleChange}
                        />

                        <button type="submit" className="signup-button" disabled={loading}>
                            {loading ? 'Loading...' : 'Sign - Up'}
                        </button>
                    </form>

                    {message && <div className="message">{message}</div>}
                </div>
            </div>

            <div className="signup-right">
                <img src={home_i} alt="Team Collaboration" />
            </div>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default Signup;