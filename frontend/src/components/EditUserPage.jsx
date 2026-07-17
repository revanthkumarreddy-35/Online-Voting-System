import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function EditUserPage() {
    const { id } = useParams(); // Get user ID from the URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        photo: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch user data on component load
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve token from localStorage
                const response = await axios.get(`http://localhost:8080/api/admin/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in request header
                    },
                });
                
                // Clean up data for the form
                const userData = response.data;
                setFormData({
                    username: userData.username || '',
                    password: '', // Don't prepopulate password for security, unless required
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    role: userData.role || '',
                    photo: userData.photo || '',
                });
                setLoading(false);
            } catch (error) {
                setLoading(false);
                if (error.response?.status === 401) {
                    setErrorMessage('Unauthorized: Please log in again.');
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    setErrorMessage('Failed to fetch user data. Please try again.');
                }
            }
        };
        fetchUserData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const response = await axios.post("http://localhost:8080/api/upload/image", uploadData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setFormData((prev) => ({ ...prev, photo: "http://localhost:8080" + response.data.url }));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            await axios.put(
                'http://localhost:8080/api/admin/users',
                { ...formData, id }, // Make sure ID is included if backend needs it
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in request header
                    },
                }
            );
            setSuccessMessage('User updated successfully!');
            setErrorMessage('');
            setTimeout(() => navigate('/admin'), 1500); // Redirect to admin dashboard after success
        } catch (error) {
            console.error('Error updating user:', error.response || error.message);
            setErrorMessage('Error updating user. Please try again.');
            setSuccessMessage('');
        }
    };

    if (loading) {
        return (
            <div className="app d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <Navbar title="VoteCast Admin" />

            <div className="container-main d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
                <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: 600 }}>Edit User</h2>
                    
                    {successMessage && <div className="alert alert-success" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="firstName" className="form-label" style={{ color: 'var(--text-secondary)' }}>First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="form-control"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="lastName" className="form-label" style={{ color: 'var(--text-secondary)' }}>Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="form-control"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="username" className="form-label" style={{ color: 'var(--text-secondary)' }}>Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="form-control"
                                value={formData.username}
                                onChange={handleChange}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label" style={{ color: 'var(--text-secondary)' }}>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="password" className="form-label" style={{ color: 'var(--text-secondary)' }}>Password (Leave blank to keep current)</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="phoneNumber" className="form-label" style={{ color: 'var(--text-secondary)' }}>Phone Number</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    className="form-control"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="role" className="form-label" style={{ color: 'var(--text-secondary)' }}>Role</label>
                            <select
                                id="role"
                                name="role"
                                className="form-select"
                                value={formData.role}
                                onChange={handleChange}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                required
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select a role</option>
                                <option value="ROLE_USER" style={{ color: 'black' }}>Voter</option>
                                <option value="ROLE_ADMIN" style={{ color: 'black' }}>Admin</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="photo" className="form-label" style={{ color: 'var(--text-secondary)' }}>Profile Photo</label>
                            <input
                                type="file"
                                id="photo"
                                accept="image/*"
                                className="form-control"
                                onChange={handleImageUpload}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                            />
                            {formData.photo && (
                                <div className="mt-3 text-center">
                                    <img src={formData.photo} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--primary-color)' }} />
                                </div>
                            )}
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                            <button type="button" className="btn btn-outline-light" onClick={() => navigate('/admin')}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Update User</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditUserPage;
