import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { FaSearch, FaShieldAlt } from "react-icons/fa";
import "./VoterPage.css"; // Reuse existing styles

function BulletinBoard() {
    const [receiptId, setReceiptId] = useState("");
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!receiptId.trim()) return;

        setLoading(true);
        setError("");
        setVerificationResult(null);

        try {
            const response = await axios.get(`http://localhost:8080/api/votes/receipt/${receiptId.trim()}`);
            setVerificationResult(response.data);
        } catch (err) {
            setError("Receipt not found. Please check the ID and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <Navbar />
            <main className="container-main voter-container" role="main" tabIndex="-1">
                <div className="hero-header glass-card text-center">
                    <FaShieldAlt style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }} />
                    <h1 className="hero-title">Public Bulletin Board</h1>
                    <p className="hero-subtitle">Verify that your vote was securely recorded in the ledger.</p>
                </div>

                <div className="glass-card" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
                    <form onSubmit={handleVerify}>
                        <div className="form-group mb-4">
                            <label htmlFor="receiptInput" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Enter your Cryptographic Receipt ID:</label>
                            <div className="input-group-custom" style={{ margin: 0 }}>
                                <FaSearch className="input-icon" aria-hidden="true" />
                                <input
                                    id="receiptInput"
                                    type="text"
                                    placeholder="e.g. TX-1234-ABCD"
                                    value={receiptId}
                                    onChange={(e) => setReceiptId(e.target.value)}
                                    className="form-control input-custom"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading || !receiptId.trim()}>
                            {loading ? "Verifying..." : "Verify Vote"}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 rounded" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {verificationResult && (
                        <div className="mt-4 p-4 rounded" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--text-primary)' }}>
                            <div className="text-center mb-3">
                                <span style={{ padding: '0.5rem 1rem', background: '#10b981', color: '#fff', borderRadius: '2rem', fontWeight: 600, letterSpacing: '1px' }}>
                                    {verificationResult.status}
                                </span>
                            </div>
                            <h5 className="text-center mb-4" style={{ color: '#10b981' }}>{verificationResult.message}</h5>
                            
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span style={{ color: 'var(--text-secondary)' }}>Election:</span>
                                    <strong style={{ textAlign: 'right' }}>{verificationResult.election}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span style={{ color: 'var(--text-secondary)' }}>Timestamp:</span>
                                    <strong style={{ textAlign: 'right' }}>{new Date(verificationResult.timestamp).toLocaleString()}</strong>
                                </div>
                                <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Receipt ID:</span>
                                    <span style={{ fontFamily: 'monospace', color: 'var(--primary-color)' }}>{receiptId}</span>
                                </div>
                            </div>
                            
                            <p className="text-center mt-4 mb-0 small" style={{ color: 'var(--text-secondary)' }}>
                                <FaShieldAlt className="me-2" />
                                For privacy reasons, your candidate selection is hidden.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default BulletinBoard;
