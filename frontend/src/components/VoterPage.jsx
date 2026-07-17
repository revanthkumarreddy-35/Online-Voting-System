// import React, { useState, useEffect } from "react";
// import { Button, Card, Modal, Form, InputGroup, Spinner } from "react-bootstrap";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "font-awesome/css/font-awesome.min.css";
//
// function VoterPage() {
//     const [elections, setElections] = useState([]);
//     const [candidates, setCandidates] = useState([]);
//     const [selectedElection, setSelectedElection] = useState("");
//     const [searchTerm, setSearchTerm] = useState("");
//     const [votedCandidates, setVotedCandidates] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [candidateToVote, setCandidateToVote] = useState(null);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         fetchElections();
//         fetchCandidates();
//     }, []);
//
//     const fetchElections = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/api/elections");
//             setElections(response.data);
//         } catch (error) {
//             console.error("Error fetching elections:", error);
//         }
//     };
//
//     const fetchCandidates = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/api/candidates");
//             setCandidates(response.data);
//         } catch (error) {
//             console.error("Error fetching candidates:", error);
//         }
//     };
//
//     const handleVote = async (candidate) => {
//         const user = JSON.parse(sessionStorage.getItem("user"));
//         setLoading(true);
//         try {
//             const payload = {
//                 candidateId: candidate.candidateId,
//                 userId: user.userId,
//             };
//
//             await axios.post(`http://localhost:8080/api/votes`, payload, {
//                 headers: { "Content-Type": "application/json" },
//             });
//             setVotedCandidates([...votedCandidates, candidate.candidateId]);
//             setShowModal(false);
//         } catch (error) {
//             console.error("Error casting vote:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const confirmVote = (candidate) => {
//         setCandidateToVote(candidate);
//         setShowModal(true);
//     };
//
//     const filteredCandidates = candidates.filter((candidate) => {
//         const matchesSearch = candidate.fullName
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase());
//         const matchesElection =
//             !selectedElection || candidate.election?.electionId.toString() === selectedElection;
//         return matchesSearch && matchesElection;
//     });
//
//     const handleLogout = () => {
//         sessionStorage.clear();
//         window.location.href = "/login"; // Redirect to login page
//     };
//
//     return (
//         <>
//             {/* Navbar */}
//             <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
//                 <div className="container d-flex justify-content-between align-items-center">
//                     <div className="d-flex align-items-center">
//                         <img
//                             src="http://localhost:8080/images/icons8-vote-100.png"
//                             alt="VoteCast Logo"
//                             style={{ height: "40px", marginRight: "10px" }}
//                         />
//                         <a className="navbar-brand fw-bold" href="#">
//                             VoteCast
//                         </a>
//                     </div>
//                     <Button variant="outline-light" onClick={handleLogout}>
//                         Logout
//                     </Button>
//                 </div>
//             </nav>
//
//             {/* Header Section */}
//             <header
//                 className="d-flex align-items-center text-white text-center"
//                 style={{
//                     background: "linear-gradient(to bottom right, #007bff, #6610f2)",
//                     minHeight: "50vh",
//                 }}
//             >
//                 <div className="container">
//                     <h1 className="display-4 fw-bold">Vote for Your Candidate</h1>
//                     <p className="lead">Secure. Transparent. Convenient.</p>
//                 </div>
//             </header>
//
//             {/* Filters */}
//             <section className="py-4 bg-light">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-md-6">
//                             <Form.Select
//                                 onChange={(e) => setSelectedElection(e.target.value)}
//                                 value={selectedElection}
//                                 className="form-select"
//                             >
//                                 <option value="">All Elections</option>
//                                 {elections.map((election) => (
//                                     <option key={election.electionId} value={election.electionId}>
//                                         {election.electionName}
//                                     </option>
//                                 ))}
//                             </Form.Select>
//                         </div>
//                         <div className="col-md-6">
//                             <InputGroup>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Search candidates"
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="form-control"
//                                 />
//                             </InputGroup>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//
//             {/* Candidate Cards */}
//             <section className="py-4">
//                 <div className="container">
//                     <div className="row g-4">
//                         {filteredCandidates.map((candidate) => (
//                             <div className="col-md-3" key={candidate.candidateId}>
//                                 <Card className="shadow-sm" style={{ maxWidth: "18rem" }}>
//                                     <Card.Img
//                                         variant="top"
//                                         src={candidate.image || "http://via.placeholder.com/150"}
//                                         alt={candidate.fullName}
//                                     />
//                                     <Card.Body className="text-center">
//                                         <Card.Title>{candidate.fullName}</Card.Title>
//                                         <Card.Text>
//                                             <strong>Party:</strong> {candidate.party}
//                                         </Card.Text>
//                                         <Card.Text>
//                                             <strong>Election:</strong>{" "}
//                                             {candidate.election?.electionName || "N/A"}
//                                         </Card.Text>
//                                         <Button
//                                             variant="primary"
//                                             disabled={votedCandidates.includes(candidate.candidateId)}
//                                             onClick={() => confirmVote(candidate)}
//                                         >
//                                             {votedCandidates.includes(candidate.candidateId)
//                                                 ? "Voted"
//                                                 : "Vote"}
//                                         </Button>
//                                     </Card.Body>
//                                 </Card>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>
//
//             {/* Confirmation Modal */}
//             <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Confirm Your Vote</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     Are you sure you want to vote for{" "}
//                     <strong>{candidateToVote?.fullName}</strong> in{" "}
//                     <strong>{candidateToVote?.election?.electionName}</strong>?
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="success"
//                         onClick={() => handleVote(candidateToVote)}
//                         disabled={loading}
//                     >
//                         {loading ? <Spinner animation="border" size="sm" /> : "Confirm Vote"}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// }
//
// export default VoterPage;



//
// import React, { useState, useEffect } from "react";
// import { Button, Card, Modal, Form, InputGroup, Spinner } from "react-bootstrap";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "font-awesome/css/font-awesome.min.css";
//
// function VoterPage() {
//     const [elections, setElections] = useState([]);
//     const [candidates, setCandidates] = useState([]);
//     const [selectedElection, setSelectedElection] = useState("");
//     const [searchTerm, setSearchTerm] = useState("");
//     const [votedCandidates, setVotedCandidates] = useState([]);
//     const [votedElections, setVotedElections] = useState(new Set()); // Track elections where votes were cast
//     const [showModal, setShowModal] = useState(false);
//     const [candidateToVote, setCandidateToVote] = useState(null);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         fetchElections();
//         fetchCandidates();
//         loadVotingState(); // Load voting state from localStorage
//     }, []);
//
//     const fetchElections = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/api/elections");
//             setElections(response.data);
//         } catch (error) {
//             console.error("Error fetching elections:", error);
//         }
//     };
//
//     const fetchCandidates = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/api/candidates");
//             setCandidates(response.data);
//         } catch (error) {
//             console.error("Error fetching candidates:", error);
//         }
//     };
//
//     const loadVotingState = () => {
//         const storedVotedCandidates = JSON.parse(localStorage.getItem("votedCandidates")) || [];
//         const storedVotedElections = new Set(
//             JSON.parse(localStorage.getItem("votedElections")) || []
//         );
//         setVotedCandidates(storedVotedCandidates);
//         setVotedElections(storedVotedElections);
//     };
//
//     const saveVotingState = (candidateId, electionId) => {
//         const updatedVotedCandidates = [...votedCandidates, candidateId];
//         const updatedVotedElections = new Set(votedElections);
//         updatedVotedElections.add(electionId);
//
//         localStorage.setItem("votedCandidates", JSON.stringify(updatedVotedCandidates));
//         localStorage.setItem("votedElections", JSON.stringify([...updatedVotedElections]));
//
//         setVotedCandidates(updatedVotedCandidates);
//         setVotedElections(updatedVotedElections);
//     };
//
//     const handleVote = async (candidate) => {
//         const user = JSON.parse(sessionStorage.getItem("user"));
//         setLoading(true);
//         try {
//             const payload = {
//                 candidateId: candidate.candidateId,
//                 userId: user.userId,
//             };
//
//             await axios.post(`http://localhost:8080/api/votes`, payload, {
//                 headers: { "Content-Type": "application/json" },
//             });
//             saveVotingState(candidate.candidateId, candidate.election.electionId); // Save voting state
//             setShowModal(false);
//         } catch (error) {
//             console.error("Error casting vote:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const confirmVote = (candidate) => {
//         setCandidateToVote(candidate);
//         setShowModal(true);
//     };
//
//     const filteredCandidates = candidates.filter((candidate) => {
//         const matchesSearch = candidate.fullName
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase());
//         const matchesElection =
//             !selectedElection || candidate.election?.electionId.toString() === selectedElection;
//         return matchesSearch && matchesElection;
//     });
//
//     const handleLogout = () => {
//         sessionStorage.clear();
//         window.location.href = "/login"; // Redirect to login page
//     };
//
//     return (
//         <>
//             {/* Navbar */}
//             <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
//                 <div className="container d-flex justify-content-between align-items-center">
//                     <div className="d-flex align-items-center">
//                         <img
//                             src="http://localhost:8080/images/icons8-vote-100.png"
//                             alt="VoteCast Logo"
//                             style={{ height: "40px", marginRight: "10px" }}
//                         />
//                         <a className="navbar-brand fw-bold" href="#">
//                             VoteCast
//                         </a>
//                     </div>
//                     <Button variant="outline-light" onClick={handleLogout}>
//                         Logout
//                     </Button>
//                 </div>
//             </nav>
//
//             {/* Header Section */}
//             <header
//                 className="d-flex align-items-center text-white text-center"
//                 style={{
//                     background: "linear-gradient(to bottom right, #007bff, #6610f2)",
//                     minHeight: "50vh",
//                 }}
//             >
//                 <div className="container">
//                     <h1 className="display-4 fw-bold">Vote for Your Candidate</h1>
//                     <p className="lead">Secure. Transparent. Convenient.</p>
//                 </div>
//             </header>
//
//             {/* Filters */}
//             <section className="py-4 bg-light">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-md-6">
//                             <Form.Select
//                                 onChange={(e) => setSelectedElection(e.target.value)}
//                                 value={selectedElection}
//                                 className="form-select"
//                             >
//                                 <option value="">All Elections</option>
//                                 {elections.map((election) => (
//                                     <option key={election.electionId} value={election.electionId}>
//                                         {election.electionName}
//                                     </option>
//                                 ))}
//                             </Form.Select>
//                         </div>
//                         <div className="col-md-6">
//                             <InputGroup>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Search candidates"
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="form-control"
//                                 />
//                             </InputGroup>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//
//             {/* Candidate Cards */}
//             <section className="py-4">
//                 <div className="container">
//                     <div className="row g-4">
//                         {filteredCandidates.map((candidate) => (
//                             <div className="col-md-3" key={candidate.candidateId}>
//                                 <Card className="shadow-sm" style={{ maxWidth: "18rem" }}>
//                                     <Card.Img
//                                         variant="top"
//                                         src={candidate.image || "http://via.placeholder.com/150"}
//                                         alt={candidate.fullName}
//                                     />
//                                     <Card.Body className="text-center">
//                                         <Card.Title>{candidate.fullName}</Card.Title>
//                                         <Card.Text>
//                                             <strong>Party:</strong> {candidate.party}
//                                         </Card.Text>
//                                         <Card.Text>
//                                             <strong>Election:</strong>{" "}
//                                             {candidate.election?.electionName || "N/A"}
//                                         </Card.Text>
//                                         <Button
//                                             variant="primary"
//                                             disabled={
//                                                 votedCandidates.includes(candidate.candidateId) ||
//                                                 votedElections.has(candidate.election.electionId)
//                                             }
//                                             onClick={() => confirmVote(candidate)}
//                                         >
//                                             {votedCandidates.includes(candidate.candidateId)
//                                                 ? "Voted"
//                                                 : "Vote"}
//                                         </Button>
//                                     </Card.Body>
//                                 </Card>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>
//
//             {/* Confirmation Modal */}
//             <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Confirm Your Vote</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     Are you sure you want to vote for{" "}
//                     <strong>{candidateToVote?.fullName}</strong> in{" "}
//                     <strong>{candidateToVote?.election?.electionName}</strong>?
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="success"
//                         onClick={() => handleVote(candidateToVote)}
//                         disabled={loading}
//                     >
//                         {loading ? <Spinner animation="border" size="sm" /> : "Confirm Vote"}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// }
//
// export default VoterPage;
//

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
        setLoading(true);
        try {
            const payload = {
                candidateId: candidate.candidateId,
                userId: user.userId,
            };

            await axios.post(`http://localhost:8080/api/votes`, payload, {
                headers: { "Content-Type": "application/json" },
            });
            saveVotingState(candidate.candidateId, candidate.election.electionId);
            setShowModal(false);
        } catch (error) {
            console.error("Error casting vote:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmVote = (candidate) => {
        setCandidateToVote(candidate);
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
            <div className="container-main voter-container">
                <div className="hero-header glass-card">
                    <h1 className="hero-title">Cast Your Vote</h1>
                    <p className="hero-subtitle">Make your voice heard. Secure, transparent, and easy digital voting.</p>
                </div>

                <div className="filters-section">
                    <div className="input-group-custom">
                        <FaList className="input-icon" />
                        <Form.Select
                            onChange={(e) => setSelectedElection(e.target.value)}
                            value={selectedElection}
                            className="form-control input-custom"
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
                        <FaSearch className="input-icon" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control input-custom"
                        />
                    </div>
                </div>

                <div className="candidate-grid">
                    {filteredCandidates.map((candidate) => (
                        <div className="glass-card candidate-card" key={candidate.candidateId}>
                            <div className="candidate-image-wrapper">
                                <img
                                    src={candidate.image || "https://via.placeholder.com/150"}
                                    alt={candidate.fullName}
                                    className="candidate-image"
                                />
                            </div>
                            <h3 className="candidate-name">{candidate.fullName}</h3>
                            <div className="candidate-party">{candidate.party}</div>
                            <div className="candidate-election">{candidate.election?.electionName || "N/A"}</div>
                            <button
                                className="btn btn-primary vote-btn"
                                disabled={
                                    votedCandidates.includes(candidate.candidateId) ||
                                    votedElections.has(candidate.election?.electionId)
                                }
                                onClick={() => confirmVote(candidate)}
                            >
                                {votedCandidates.includes(candidate.candidateId) ? "Voted" : "Vote Now"}
                            </button>
                        </div>
                    ))}
                    {filteredCandidates.length === 0 && (
                        <div className="col-span-full text-center" style={{ gridColumn: '1 / -1', padding: '3rem', color: 'var(--text-secondary)' }}>
                            <h4>No candidates found.</h4>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title style={{ fontWeight: 700 }}>Confirm Your Vote</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <p style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                        Are you sure you want to cast your vote for <strong style={{ color: 'var(--primary-color)' }}>{candidateToVote?.fullName}</strong> in the <strong>{candidateToVote?.election?.electionName}</strong>?
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem', marginBottom: 0 }}>
                        Note: This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-top-0 pt-0">
                    <button className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => setShowModal(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={() => handleVote(candidateToVote)} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Confirm Vote"}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default VoterPage;


