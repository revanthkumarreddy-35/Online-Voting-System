import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Form } from "react-bootstrap";
import { FaSearch, FaFilter, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "./Navbar";
import "./AdminPage.css";

function CandidateManagement() {
    const [candidates, setCandidates] = useState([]);
    const [elections, setElections] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedElection, setSelectedElection] = useState("");
    const [selectedParty, setSelectedParty] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentCandidate, setCurrentCandidate] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        party: "",
        electionId: "",
        image: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCandidates();
        fetchElections();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/candidates");
            setCandidates(response.data);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

    const fetchElections = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/elections");
            if (Array.isArray(response.data)) {
                setElections(response.data);
            } else {
                setElections([]);
            }
        } catch (error) {
            console.error("Error fetching elections:", error);
            setElections([]);
        }
    };

    const handleInputChange = (e) => {
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
            setFormData((prev) => ({ ...prev, image: "http://localhost:8080" + response.data.url }));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                fullName: formData.fullName,
                party: formData.party,
                election: { electionId: formData.electionId },
                image: formData.image,
            };

            if (currentCandidate) {
                await axios.put(
                    `http://localhost:8080/api/candidates/${currentCandidate.candidateId}`,
                    payload
                );
            } else {
                await axios.post(
                    `http://localhost:8080/api/candidates/election/${formData.electionId}`,
                    payload
                );
            }

            setShowModal(false);
            fetchCandidates();
        } catch (error) {
            console.error("Error saving candidate:", error);
        }
    };

    const handleDelete = async (candidateId) => {
        try {
            await axios.delete(`http://localhost:8080/api/candidates/${candidateId}`);
            fetchCandidates();
        } catch (error) {
            console.error("Error deleting candidate:", error);
        }
    };

    const openModal = (candidate = null) => {
        setCurrentCandidate(candidate);
        setFormData(
            candidate
                ? {
                    fullName: candidate.fullName,
                    party: candidate.party,
                    electionId: candidate.election?.electionId || "",
                    image: candidate.image || "",
                }
                : { fullName: "", party: "", electionId: "", image: "" }
        );
        setShowModal(true);
    };

    const filteredCandidates = candidates.filter((candidate) => {
        const matchesSearch =
            candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.party.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesElection =
            !selectedElection || candidate.election?.electionId.toString() === selectedElection.toString();

        const matchesParty = !selectedParty || candidate.party === selectedParty;

        return matchesSearch && matchesElection && matchesParty;
    });

    const uniqueParties = Array.from(new Set(candidates.map((c) => c.party)));

    return (
        <div className="app">
            <Navbar title="VoteCast Admin" />
            
            <div className="container-main admin-container">
                <div className="admin-header glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <h1 style={{ background: 'linear-gradient(135deg, #fff, var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
                        Candidate Management
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Add, edit, or remove candidates from your elections.</p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <button className="btn btn-outline-light" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => navigate("/admin")}>Back to Dashboard</button>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => openModal()}>
                            <FaPlus /> Add Candidate
                        </button>
                        
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div className="input-group-custom" style={{ marginBottom: 0 }}>
                                <FaSearch className="input-icon" />
                                <input
                                    type="text"
                                    className="form-control input-custom"
                                    placeholder="Search candidates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '250px' }}
                                />
                            </div>
                            
                            <Form.Select 
                                value={selectedElection} 
                                onChange={(e) => setSelectedElection(e.target.value)}
                                style={{ width: '200px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                            >
                                <option value="">All Elections</option>
                                {elections.map((election) => (
                                    <option key={election.electionId} value={election.electionId}>
                                        {election.electionName}
                                    </option>
                                ))}
                            </Form.Select>
                            
                            <Form.Select 
                                value={selectedParty} 
                                onChange={(e) => setSelectedParty(e.target.value)}
                                style={{ width: '200px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                            >
                                <option value="">All Parties</option>
                                {uniqueParties.map((party) => (
                                    <option key={party} value={party}>{party}</option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {filteredCandidates.map((candidate) => (
                        <div className="col-md-4 mb-4" key={candidate.candidateId}>
                            <div className="glass-card candidate-card h-100" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                                <div className="candidate-image-wrapper" style={{ width: '100px', height: '100px', margin: '0 auto 1rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', padding: '3px' }}>
                                    <img
                                        src={candidate.image || "https://via.placeholder.com/150"}
                                        alt={candidate.fullName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--bg-color-light)' }}
                                    />
                                </div>
                                <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{candidate.fullName}</h4>
                                <div style={{ color: 'var(--primary-color)', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{candidate.party}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                    Election: {candidate.election?.electionName || "No Election"}
                                </div>
                                
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                    <button 
                                        className="btn w-50 d-flex align-items-center justify-content-center gap-2" 
                                        style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}
                                        onClick={() => openModal(candidate)}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button 
                                        className="btn w-50 d-flex align-items-center justify-content-center gap-2" 
                                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}
                                        onClick={() => handleDelete(candidate.candidateId)}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredCandidates.length === 0 && (
                        <div className="col-12 text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                            <h4>No candidates found matching your criteria.</h4>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title style={{ fontWeight: 700 }}>
                        {currentCandidate ? "Edit Candidate" : "Add Candidate"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Party</Form.Label>
                            <Form.Control
                                type="text"
                                name="party"
                                value={formData.party}
                                onChange={handleInputChange}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Election</Form.Label>
                            <Form.Select
                                name="electionId"
                                value={formData.electionId}
                                onChange={handleInputChange}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                            >
                                <option value="" style={{ color: 'black' }}>Select Election</option>
                                {elections.map((election) => (
                                    <option key={election.electionId} value={election.electionId} style={{ color: 'black' }}>
                                        {election.electionName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Candidate Photo</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                            />
                            {formData.image && (
                                <div className="mt-2 text-center">
                                    <img src={formData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-top-0 pt-0">
                    <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => setShowModal(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        {currentCandidate ? "Update" : "Save"} Candidate
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CandidateManagement;
