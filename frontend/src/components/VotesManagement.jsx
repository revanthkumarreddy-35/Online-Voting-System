import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./AdminPage.css";

const VotesManagement = () => {
    const [elections, setElections] = useState([]);
    const [votes, setVotes] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchElections();
        fetchVotes();
        fetchCandidates();
    }, []);

    const fetchElections = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/elections");
            setElections(response.data);
        } catch (error) {
            console.error("Error fetching elections:", error);
        }
    };

    const fetchVotes = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/votes");
            setVotes(response.data);
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    };

    const fetchCandidates = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/candidates");
            setCandidates(response.data);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateResults = (electionId) => {
        const electionVotes = votes.filter(
            (vote) => vote.candidate?.election?.electionId === electionId
        );

        const totalVotes = electionVotes.length;

        return candidates
            .filter((candidate) => candidate.election?.electionId === electionId)
            .map((candidate) => {
                const candidateVotes = electionVotes.filter(
                    (vote) => vote.candidate.candidateId === candidate.candidateId
                ).length;

                const percentage = totalVotes ? ((candidateVotes / totalVotes) * 100).toFixed(2) : 0;

                return {
                    candidate,
                    votes: candidateVotes,
                    percentage,
                };
            })
            .sort((a, b) => b.votes - a.votes);
    };

    if (loading) return (
        <div className="app d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="app">
            <Navbar title="VoteCast Admin" />

            <div className="container-main admin-container">
                <div className="admin-header glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <h1 style={{ background: 'linear-gradient(135deg, #fff, var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
                        Votes Management
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>View results and statistics for each election.</p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <button className="btn btn-outline-light" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => navigate("/admin")}>Back to Dashboard</button>
                    </div>
                </div>

                {elections.map((election) => {
                    const results = calculateResults(election.electionId);
                    if (results.length === 0) return null; // Don't show elections with no candidates

                    return (
                        <div key={election.electionId} className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem', fontWeight: 600 }}>
                                {election.electionName}
                            </h3>
                            
                            <div className="row">
                                {results.map(({ candidate, votes, percentage }, index) => (
                                    <div className="col-md-4 mb-4" key={candidate.candidateId}>
                                        <div className="glass-card candidate-card h-100" style={{ 
                                            padding: '1.5rem', 
                                            textAlign: 'center', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            position: 'relative',
                                            border: index === 0 && votes > 0 ? '2px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-color)' 
                                        }}>
                                            {index === 0 && votes > 0 && (
                                                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', padding: '0.2rem 1rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                                    Leading
                                                </div>
                                            )}
                                            
                                            <div className="candidate-image-wrapper" style={{ width: '100px', height: '100px', margin: '1rem auto', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', padding: '3px' }}>
                                                <img
                                                    src={candidate.image || "https://via.placeholder.com/150"}
                                                    alt={candidate.fullName}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--bg-color-light)' }}
                                                />
                                            </div>
                                            <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{candidate.fullName}</h4>
                                            
                                            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span style={{ color: 'var(--text-secondary)' }}>Votes</span>
                                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{votes}</span>
                                                </div>
                                                <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', height: '8px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                                                    <div style={{ width: `${percentage}%`, background: 'var(--primary-color)', height: '100%', borderRadius: '1rem' }}></div>
                                                </div>
                                                <div style={{ textAlign: 'right', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem' }}>
                                                    {percentage}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VotesManagement;
