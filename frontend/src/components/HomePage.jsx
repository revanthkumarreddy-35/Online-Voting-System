import React from "react";
import { FaShieldAlt, FaUsers, FaChartLine, FaMobileAlt, FaClock, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <FaShieldAlt />,
            title: "Secure & Encrypted",
            text: "VoteCast ensures your vote is confidential and secure using top-tier encryption technology.",
        },
        {
            icon: <FaUsers />,
            title: "User-Friendly",
            text: "Simplified design makes voting accessible and intuitive for all users.",
        },
        {
            icon: <FaChartLine />,
            title: "Real-Time Results",
            text: "Monitor live election results with complete transparency.",
        },
        {
            icon: <FaMobileAlt />,
            title: "Mobile-Optimized",
            text: "Vote seamlessly from any device, be it a desktop, tablet, or smartphone.",
        },
        {
            icon: <FaClock />,
            title: "24/7 Accessibility",
            text: "Cast your vote at any time with a system available round the clock.",
        },
        {
            icon: <FaLeaf />,
            title: "Eco Friendly",
            text: "A paperless, eco-friendly voting solution that contributes to sustainability.",
        },
    ];

    return (
        <div className="homepage-container">
            <nav className="home-nav">
                <div className="navbar-brand" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                    <div className="brand-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--primary-color)" />
                            <path d="M2 17L12 22L22 17" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="brand-text">VoteCast</span>
                </div>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
                    <button className="btn btn-primary" onClick={() => navigate("/register")} style={{ padding: '0.8rem 1.5rem' }}>Sign Up</button>
                </div>
            </nav>

            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Empowering Your Voice</h1>
                    <p className="hero-subtitle">
                        Your vote matters. With VoteCast, you can participate in secure, transparent, and convenient online elections from anywhere.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary" onClick={() => navigate("/register")} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started</button>
                        <button className="btn-outline" onClick={() => { document.getElementById('features').scrollIntoView({ behavior: 'smooth' }) }} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Learn More</button>
                    </div>
                </div>
            </section>

            <section id="features" className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Why Choose VoteCast?</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>The features that make us the most reliable online voting solution.</p>
                </div>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div className="glass-card feature-card" key={index}>
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-text">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="home-footer">
                <div className="footer-content">
                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>VoteCast</h4>
                        <p style={{ color: 'var(--text-secondary)' }}>Revolutionizing democracy with a secure, transparent, and accessible online voting platform.</p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Links</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="#features" style={{ color: 'var(--text-secondary)' }}>Features</a>
                            <a href="/login" style={{ color: 'var(--text-secondary)' }}>Login</a>
                            <a href="/register" style={{ color: 'var(--text-secondary)' }}>Sign Up</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} VoteCast. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
