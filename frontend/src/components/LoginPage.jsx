import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post(
                `http://localhost:8080/api/users/login?username=${username}&password=${password}`
            );
            const userData = response.data;

            if (onLogin) onLogin(userData);
            sessionStorage.setItem('user', JSON.stringify(userData));

            if (userData.role === "ROLE_USER") {
                navigate("/voter");
            } else if (userData.role === "ROLE_ADMIN" || userData.role === "ROLE_MASTER_ADMIN") {
                navigate("/admin");
            } else {
                alert("Unexpected role. Please contact support.");
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Login failed. Please check your credentials.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="glass-card login-card">
                <div className="login-header">
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Sign in to cast your vote</p>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger" style={{ borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group-custom">
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            className="form-control input-custom"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group-custom" style={{ position: 'relative' }}>
                        <FaLock className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control input-custom"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    <button
                        type="submit"
                        className="btn btn-primary submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Authenticating..." : "Login"}
                    </button>
                </form>

                <div className="login-links">
                    <p>
                        <span style={{color: 'var(--text-secondary)'}}>Don't have an account? </span>
                        <a href="/register">Register here</a>
                    </p>
                    <p>
                        <a href="/forgot-password">Forgot Password?</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
