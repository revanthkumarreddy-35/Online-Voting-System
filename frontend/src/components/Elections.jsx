import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Navbar from "./Navbar";
import "./AdminPage.css";

const ElectionManagement = () => {
    const [elections, setElections] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // 'create' or 'edit'
    const navigate = useNavigate();
    const [currentElection, setCurrentElection] = useState({
        electionId: "",
        electionName: "",
        electionDescription: "",
        image: "",
        electionStartDate: "",
        electionEndDate: "",
        electionTime: "",
        electionStatus: false,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/elections");
            if (Array.isArray(response.data)) {
                setElections(response.data);
            } else {
                console.error("Unexpected data format:", response.data);
                setElections([]);
            }
        } catch (error) {
            console.error("Error fetching elections:", error);
            setElections([]);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentElection({
            ...currentElection,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const openModal = (type, election = null) => {
        setModalType(type);
        setShowModal(true);
        setCurrentElection(
            election || {
                electionId: "",
                electionName: "",
                electionDescription: "",
                image: "",
                electionStartDate: "",
                electionEndDate: "",
                electionTime: "",
                electionStatus: false,
            }
        );
    };

    const saveElection = async () => {
        try {
            if (modalType === "create") {
                await axios.post("http://localhost:8080/api/elections", currentElection);
            } else if (modalType === "edit") {
                await axios.put(
                    `http://localhost:8080/api/elections/${currentElection.electionId}`,
                    currentElection
                );
            }
            setShowModal(false);
            fetchElections();
        } catch (error) {
            console.error("Error saving election:", error);
        }
    };

    const deleteElection = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/elections/${id}`);
            fetchElections();
        } catch (error) {
            console.error("Error deleting election:", error);
        }
    };

    const filteredElections = elections.filter((election) => {
        const matchesSearch = election.electionName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === "All" ||
            (filterStatus === "Active" && election.electionStatus) ||
            (filterStatus === "Inactive" && !election.electionStatus);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="app">
            <Navbar title="VoteCast Admin" />

            <div className="container-main admin-container">
                <div className="admin-header glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <h1 style={{ background: 'linear-gradient(135deg, #fff, var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
                        Election Management
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your organization's elections effectively.</p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <button className="btn btn-outline-light" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => navigate("/admin")}>Back to Dashboard</button>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => openModal("create")}>
                            <FaPlus /> Add Election
                        </button>
                        
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div className="input-group-custom" style={{ marginBottom: 0 }}>
                                <FaSearch className="input-icon" />
                                <input
                                    type="text"
                                    className="form-control input-custom"
                                    placeholder="Search elections..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '250px' }}
                                />
                            </div>
                            
                            <Form.Select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                                style={{ width: '150px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Form.Select>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {filteredElections.map((election) => (
                        <div className="col-md-4 mb-4" key={election.electionId}>
                            <div className="glass-card h-100" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                                <div style={{ height: '150px', position: 'relative' }}>
                                    <img
                                        src={`http://localhost:8080/images/${election.image || "placeholder.png"}`}
                                        alt={election.electionName}
                                        onError={(e) => (e.target.src = "https://via.placeholder.com/400x200")}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.75rem', borderRadius: '1rem', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                        {election.electionStatus ? (
                                            <><FaCheckCircle color="#10b981" /> Active</>
                                        ) : (
                                            <><FaTimesCircle color="#ef4444" /> Inactive</>
                                        )}
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{election.electionName}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flexGrow: 1 }}>{election.electionDescription}</p>
                                    
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Start</span>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{election.electionStartDate}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>End</span>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{election.electionEndDate}</span>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button 
                                            className="btn w-50 d-flex align-items-center justify-content-center gap-2" 
                                            style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}
                                            onClick={() => openModal("edit", election)}
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button 
                                            className="btn w-50 d-flex align-items-center justify-content-center gap-2" 
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}
                                            onClick={() => deleteElection(election.electionId)}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredElections.length === 0 && (
                        <div className="col-12 text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                            <h4>No elections found matching your criteria.</h4>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title style={{ fontWeight: 700 }}>
                        {modalType === "create" ? "Create Election" : "Edit Election"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Election Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="electionName"
                                value={currentElection.electionName}
                                onChange={handleChange}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="electionDescription"
                                value={currentElection.electionDescription}
                                onChange={handleChange}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image URL (filename)</Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                value={currentElection.image}
                                onChange={handleChange}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                            />
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="electionStartDate"
                                        value={currentElection.electionStartDate}
                                        onChange={handleChange}
                                        style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="electionEndDate"
                                        value={currentElection.electionEndDate}
                                        onChange={handleChange}
                                        style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                                        required
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Election Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="electionTime"
                                value={currentElection.electionTime}
                                onChange={handleChange}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label={currentElection.electionStatus ? "Active" : "Inactive"}
                                name="electionStatus"
                                checked={currentElection.electionStatus}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-top-0 pt-0">
                    <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => setShowModal(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={saveElection}>
                        {modalType === "create" ? "Create" : "Update"} Election
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ElectionManagement;
