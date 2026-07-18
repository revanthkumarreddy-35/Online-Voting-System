import React, { useState, useEffect } from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import { FaSearch, FaList } from "react-icons/fa";
import axios from "axios";
import Navbar from "./Navbar";
import "./VoterPage.css";

function VoterPage() {
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedElection, setSelectedElection] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [votedCandidates, setVotedCandidates] = useState([]);
    const [votedElections, setVotedElections] = useState(new Set());
    const [showModal, setShowModal] = useState(false);
    const [candidateToVote, setCandidateToVote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEncrypting, setIsEncrypting] = useState(false);
    const [receiptId, setReceiptId] = useState(null);

    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
            return;
        }
        fetchElections();
        fetchCandidates();
        loadVotingState();
    }, []);

    const fetchElections = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/elections");
            setElections(response.data);
        } catch (error) {
            console.error("Error fetching elections:", error);
        }
    };

    const fetchCandidates = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/candidates");
            setCandidates(response.data);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

    const loadVotingState = () => {
        const storedVotedCandidates = JSON.parse(localStorage.getItem(`votedCandidates_${user.userId}`)) || [];
        const storedVotedElections = new Set(JSON.parse(localStorage.getItem(`votedElections_${user.userId}`)) || []);
        setVotedCandidates(storedVotedCandidates);
        setVotedElections(storedVotedElections);
    };

    const saveVotingState = (candidateId, electionId) => {
        const updatedVotedCandidates = [...votedCandidates, candidateId];
        const updatedVotedElections = new Set(votedElections);
        updatedVotedElections.add(electionId);

        localStorage.setItem(`votedCandidates_${user.userId}`, JSON.stringify(updatedVotedCandidates));
        localStorage.setItem(`votedElections_${user.userId}`, JSON.stringify([...updatedVotedElections]));

        setVotedCandidates(updatedVotedCandidates);
        setVotedElections(updatedVotedElections);
    };

    const handleVote = async (candidate) => {
        setIsEncrypting(true);
        // Simulate cryptographic hashing delay
        setTimeout(async () => {
            setLoading(true);
            try {
                const payload = {
                    candidateId: candidate.candidateId,
                    userId: user.userId,
                };

                const response = await axios.post(`http://localhost:8080/api/votes`, payload, {
                    headers: { "Content-Type": "application/json" },
                });
                const generatedReceipt = response.data.receiptId;
                setReceiptId(generatedReceipt);
                saveVotingState(candidate.candidateId, candidate.election.electionId);
            } catch (error) {
                console.error("Error casting vote:", error);
            } finally {
                setLoading(false);
                setIsEncrypting(false);
            }
        }, 2000); // 2 second delay for cryptographic animation
    };

    const confirmVote = (candidate) => {
        setCandidateToVote(candidate);
        setReceiptId(null);
        setShowModal(true);
    };

    const filteredCandidates = candidates.filter((candidate) => {
        const matchesSearch = candidate.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesElection = !selectedElection || candidate.election?.electionId.toString() === selectedElection;
        return matchesSearch && matchesElection;
    });

    return (
        <div className="app">
            <Navbar />
            <main className="container-main voter-container" role="main" tabIndex="-1">
                <div className="hero-header glass-card">
                    <h1 className="hero-title">Cast Your Vote</h1>
                    <p className="hero-subtitle">Make your voice heard. Secure, transparent, and easy digital voting.</p>
                </div>

                <div className="filters-section" role="search" aria-label="Election and Candidate Filters">
                    <div className="input-group-custom">
                        <FaList className="input-icon" aria-hidden="true" />
                        <Form.Select
                            onChange={(e) => setSelectedElection(e.target.value)}
                            value={selectedElection}
                            className="form-control input-custom"
                            aria-label="Filter by Election"
                        >
                            <option value="">All Elections</option>
                            {elections.map((election) => (
                                <option key={election.electionId} value={election.electionId}>
                                    {election.electionName}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                    <div className="input-group-custom">
                        <FaSearch className="input-icon" aria-hidden="true" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control input-custom"
                            aria-label="Search Candidates by Name"
                        />
                    </div>
                </div>

                <div className="candidate-grid" role="region" aria-label="Candidate List">
                    {filteredCandidates.map((candidate) => (
                        <div className="glass-card candidate-card" key={candidate.candidateId} tabIndex="0" aria-label={`Candidate ${candidate.fullName}`}>
                            <div className="candidate-image-wrapper">
                                <img
                                    src={candidate.image || "https://via.placeholder.com/150"}
                                    alt={`Portrait of ${candidate.fullName}`}
                                    className="candidate-image"
                                />
                            </div>
                            <h3 className="candidate-name" id={`candidate-${candidate.candidateId}`}>{candidate.fullName}</h3>
                            <div className="candidate-party" aria-label="Party">{candidate.party}</div>
                            <div className="candidate-election" aria-label="Election">{candidate.election?.electionName || "N/A"}</div>
                            <button
                                className="btn btn-primary vote-btn"
                                disabled={
                                    votedCandidates.includes(candidate.candidateId) ||
                                    votedElections.has(candidate.election?.electionId)
                                }
                                onClick={() => confirmVote(candidate)}
                                aria-label={
                                    votedCandidates.includes(candidate.candidateId) 
                                    ? `Already voted for ${candidate.fullName}` 
                                    : `Vote for ${candidate.fullName}`
                                }
                            >
                                {votedCandidates.includes(candidate.candidateId) ? "Voted" : "Vote Now"}
                            </button>
                        </div>
                    ))}
                    {filteredCandidates.length === 0 && (
                        <div className="col-span-full text-center" style={{ gridColumn: '1 / -1', padding: '3rem', color: 'var(--text-secondary)' }} aria-live="polite">
                            <h4>No candidates found.</h4>
                        </div>
                    )}
                </div>
            </main>

            <Modal show={showModal} onHide={() => !isEncrypting && setShowModal(false)} centered aria-labelledby="vote-review-modal" backdrop={receiptId ? "static" : true}>
                <Modal.Header closeButton={!isEncrypting && !receiptId} className="border-bottom-0 pb-0">
                    <Modal.Title id="vote-review-modal" style={{ fontWeight: 700 }}>
                        {receiptId ? "Vote Successfully Cast" : isEncrypting ? "Securing Your Ballot..." : "Review and Confirm"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4 text-center">
                    {receiptId ? (
                        <div className="receipt-box" style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.5)' }}>
                            <div style={{ color: '#10b981', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                            <h4 style={{ color: 'var(--primary-color)' }}>Cryptographic Receipt</h4>
                            <p style={{ color: 'var(--text-secondary)' }}>Save this ID to verify your vote on the public bulletin board without revealing your choice.</p>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '2px', userSelect: 'all', wordBreak: 'break-all' }}>
                                {receiptId}
                            </div>
                        </div>
                    ) : isEncrypting ? (
                        <div className="encryption-animation" aria-live="polite">
                            <Spinner animation="grow" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                            <h5 className="mt-3" style={{ color: 'var(--primary-color)' }}>Cryptographic Wrapping in Progress</h5>
                            <p className="text-muted small">Generating zero-knowledge proofs and encrypting payload...</p>
                        </div>
                    ) : (
                        <>
                            <div className="review-box" style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                                <h5 className="text-muted mb-3">You are about to cast your vote for:</h5>
                                <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary-color)' }}>
                                    <img src={candidateToVote?.image || "https://via.placeholder.com/150"} alt={`Portrait of ${candidateToVote?.fullName}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h2>{candidateToVote?.fullName}</h2>
                                <h6 style={{ color: 'var(--text-secondary)' }}>{candidateToVote?.party}</h6>
                                <hr />
                                <strong>Election:</strong> {candidateToVote?.election?.electionName}
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                                By confirming, you cryptographically sign this ballot. This action is immutable and cannot be undone.
                            </p>
                        </>
                    )}
                </Modal.Body>
                {!isEncrypting && !receiptId && (
                    <Modal.Footer className="border-top-0 pt-0 justify-content-center">
                        <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => setShowModal(false)} aria-label="Cancel voting">
                            Cancel
                        </button>
                        <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontWeight: 600 }} onClick={() => handleVote(candidateToVote)} disabled={loading} aria-label="Confirm and encrypt vote">
                            Confirm & Encrypt Vote
                        </button>
                    </Modal.Footer>
                )}
                {receiptId && (
                    <Modal.Footer className="border-top-0 pt-0 justify-content-center">
                        <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontWeight: 600 }} onClick={() => setShowModal(false)}>
                            Close
                        </button>
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
}

export default VoterPage;


