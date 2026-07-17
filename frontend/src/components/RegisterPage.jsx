import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./LoginPage.css"; // Reuse login styles

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "ROLE_USER",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await axios.post("http://localhost:8080/api/users/register", formData);
            setSuccessMessage("Registration successful! Your account is pending admin verification.");
            setFormData({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                phoneNumber: "",
                password: "",
                role: "ROLE_USER",
            });

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setErrorMessage("Invalid registration details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="glass-card login-card" style={{ maxWidth: '550px' }}>
                <div className="login-header">
                    <h2 className="login-title">Create an Account</h2>
                    <p className="login-subtitle">Join VoteCast to participate in elections</p>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger" style={{ borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        {errorMessage}
                    </div>
                )}
                
                {successMessage && (
                    <div className="alert alert-success" style={{ borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleRegister} className="login-form">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group-custom">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                className="form-control input-custom"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="input-group-custom">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                className="form-control input-custom"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group-custom">
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            className="form-control input-custom"
                            name="username"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="input-group-custom">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            className="form-control input-custom"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="input-group-custom">
                        <FaPhone className="input-icon" style={{ transform: 'translateY(-50%) scaleX(-1)' }} />
                        <input
                            type="tel"
                            className="form-control input-custom"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="input-group-custom" style={{ position: 'relative' }}>
                        <FaLock className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control input-custom"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            style={{ paddingRight: '3rem' }}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-secondary)', zIndex: 10 }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="input-group-custom">
                        <FaUser className="input-icon" />
                        <select
                            className="form-control input-custom"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                            style={{ appearance: 'auto', cursor: 'pointer' }}
                        >
                            <option value="ROLE_USER" style={{ color: '#000' }}>Register as Voter</option>
                            <option value="ROLE_ADMIN" style={{ color: '#000' }}>Register as Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Sign Up"}
                    </button>
                </form>

                <div className="login-links">
                    <p>
                        <span style={{color: 'var(--text-secondary)'}}>Already have an account? </span>
                        <a href="/login">Log in here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
