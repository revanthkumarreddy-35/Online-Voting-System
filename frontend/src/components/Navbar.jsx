import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import "./Navbar.css";

function Navbar({ title = "VoteCast" }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem("user"));

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <nav className="custom-navbar glass-card">
            <div className="navbar-container">
                <div className="navbar-brand" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                    <div className="brand-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--primary-color)" />
                            <path d="M2 17L12 22L22 17" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="brand-text">{title}</span>
                </div>
                
                {user && (
                    <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {location.pathname !== "/bulletin-board" && (
                            <button onClick={() => navigate("/bulletin-board")} className="btn btn-sm" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                <FaShieldAlt /> Verify Receipt
                            </button>
                        )}
                        <div className="user-profile">
                            <FaUserCircle size={20} className="user-icon" />
                            <span className="user-name">{user.firstName}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            <FaSignOutAlt size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
