import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function AddUserPage() {
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
    const navigate = useNavigate();

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
            const response = await axios.post('http://localhost:8080/api/admin/users', formData);
            console.log('User added successfully:', response.data);
            setSuccessMessage('User added successfully!');
            setErrorMessage('');
            // Reset the form after successful submission
            setFormData({
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                role: '',
                photo: '',
            });
            setTimeout(() => navigate('/admin'), 1500);
        } catch (error) {
            console.error('Error adding user:', error.response || error.message);
            setErrorMessage('Error adding user. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="app">
            <Navbar title="VoteCast Admin" />

            <div className="container-main d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: 600 }}>Add New User</h2>
                    
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
                                <label htmlFor="password" className="form-label" style={{ color: 'var(--text-secondary)' }}>Password</label>
                                <input
                                    type="text"
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                    required
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

                        <div className="d-flex justify-content-between">
                            <button type="button" className="btn btn-outline-light" onClick={() => navigate('/admin')}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Add User</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddUserPage;
