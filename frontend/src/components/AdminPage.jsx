import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import { Modal } from "react-bootstrap";
import Navbar from "./Navbar";
import "./AdminPage.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const chartRef = useRef(null);
    const pageSize = 10;
    const navigate = useNavigate();

    // Get logged-in user info
    const getLoggedInUser = () => {
        try {
            const ls = localStorage.getItem('user');
            const ss = sessionStorage.getItem('user');
            if (ls) return JSON.parse(ls);
            if (ss) return JSON.parse(ss);
            return {};
        } catch (e) { return {}; }
    };
    const loggedInUser = getLoggedInUser();
    const isMasterAdmin = loggedInUser.role === 'ROLE_MASTER_ADMIN';
    console.log('Logged in user:', loggedInUser, 'isMasterAdmin:', isMasterAdmin);

    useEffect(() => {
        fetchUsers(currentPage, searchQuery);
        fetchRoleStats();
    }, [currentPage, searchQuery]);

    const fetchUsers = async (pageNo, query) => {
        try {
            const response = await axios.get("http://localhost:8080/api/admin/users", {
                params: {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    search: query,
                    sortBy: "id",
                },
            });
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchRoleStats = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/admin/user-role-stats");
            setStats(response.data);
            renderChart(response.data);
        } catch (error) {
            console.error("Error fetching role statistics:", error);
        }
    };

    const renderChart = (data) => {
        const ctx = document.getElementById("chart").getContext("2d");
        const roles = Object.keys(data);
        const roleCounts = Object.values(data);

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: roles,
                datasets: [
                    {
                        label: "Number of Users per Role",
                        data: roleCounts,
                        backgroundColor: "rgba(139, 92, 246, 0.4)",
                        borderColor: "rgba(139, 92, 246, 1)",
                        borderWidth: 1,
                        borderRadius: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(255,255,255,0.1)" },
                        ticks: { color: "rgba(255,255,255,0.7)" }
                    },
                    x: {
                        grid: { color: "rgba(255,255,255,0.1)" },
                        ticks: { color: "rgba(255,255,255,0.7)" }
                    }
                },
                plugins: {
                    legend: { labels: { color: "rgba(255,255,255,0.7)" } }
                }
            },
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/admin/users/${id}`);
            fetchUsers(currentPage, searchQuery);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:8080/api/admin/users/${id}/approve`, {
                approverUsername: loggedInUser.firstName || 'admin'
            });
            fetchUsers(currentPage, searchQuery);
        } catch (error) {
            console.error("Error approving user:", error);
            alert("Failed to approve user.");
        }
    };

    const handleRejectClick = (user) => {
        setSelectedUser(user);
        setRejectionReason("");
        setShowRejectModal(true);
    };

    const submitReject = async () => {
        if (!rejectionReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }
        try {
            await axios.post(`http://localhost:8080/api/admin/users/${selectedUser.id}/reject`, {
                rejectionReason: rejectionReason,
                approverUsername: loggedInUser.firstName || 'admin'
            });
            setShowRejectModal(false);
            fetchUsers(currentPage, searchQuery);
        } catch (error) {
            console.error("Error rejecting user:", error);
            alert("Failed to reject user.");
        }
    };

    return (
        <div className="app">
            <Navbar title="VoteCast Admin" />

            <div className="container-main admin-container">
                <div className="admin-header glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <h1 style={{ background: 'linear-gradient(135deg, #fff, var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
                        {isMasterAdmin ? 'Master Admin Dashboard' : 'Admin Dashboard'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage users, elections, and monitor voting progress effortlessly.</p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <button className="btn btn-primary" onClick={() => document.getElementById("voters-section").scrollIntoView({ behavior: "smooth" })}>Voters List</button>
                        <button className="btn btn-primary" onClick={() => navigate("/admin/election-management")}>Elections</button>
                        <button className="btn btn-primary" onClick={() => navigate("/admin/candidate-management")}>Candidates</button>
                        <button className="btn btn-primary" onClick={() => navigate("/admin/vote-management")}>Votes</button>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-4 mb-4">
                        <div className="glass-card admin-stats-card">
                            <h5 style={{ color: 'var(--text-secondary)' }}>Total Users</h5>
                            <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                {users.length}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 mb-4">
                        <div className="glass-card" style={{ padding: '1.5rem', height: '100%' }}>
                            <h5 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>User Roles Overview</h5>
                            <canvas id="chart" style={{ maxHeight: '250px' }}></canvas>
                        </div>
                    </div>
                </div>

                <div id="voters-section" className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, fontWeight: 600 }}>Voters List</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={handleSearch}
                                style={{ width: '250px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                            />
                            <button className="btn btn-primary" onClick={() => navigate("/admin/add-user")}>+ Add User</button>
                        </div>
                    </div>

                    <div className="admin-table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Approved By</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users
                                    .filter((user) => {
                                        // Master admin sees everyone
                                        if (isMasterAdmin) return true;
                                        // Regular admin only sees voters (not admin applicants or master admin)
                                        return user.role === 'ROLE_USER';
                                    })
                                    .map((user) => (
                                    <tr key={user.id} style={{ verticalAlign: 'middle' }}>
                                        <td>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-color)' }}>
                                                <img 
                                                    src={user.photo || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                                                    alt="User" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                />
                                            </div>
                                        </td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td><span style={{ padding: '0.25rem 0.75rem', background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>{user.role}</span></td>
                                        <td>
                                            {user.status === 'PENDING' && <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(234, 179, 8, 0.2)', color: '#fde047', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>Pending</span>}
                                            {user.status === 'APPROVED' && <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>Approved</span>}
                                            {user.status === 'REJECTED' && <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>Rejected</span>}
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.approvedBy || '—'}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            {user.status === 'PENDING' && (
                                                <>
                                                    {/* Admin applicants can only be approved by master admin */}
                                                    {(user.role === 'ROLE_USER' || isMasterAdmin) && (
                                                        <>
                                                            <button className="btn btn-sm" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginRight: '0.5rem' }} onClick={() => handleApprove(user.id)}>Approve</button>
                                                            <button className="btn btn-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', marginRight: '0.5rem' }} onClick={() => handleRejectClick(user)}>Reject</button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            <button className="btn btn-sm" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', marginRight: '0.5rem' }} onClick={() => handleViewDetails(user)}>View</button>
                                            <button className="btn btn-sm" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', marginRight: '0.5rem' }} onClick={() => navigate(`/admin/edit-user/${user.id}`)}>Edit</button>
                                            <button className="btn btn-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }} onClick={() => handleDelete(user.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <nav className="mt-4 d-flex justify-content-center">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`} onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}>
                                <span className="page-link" style={{ cursor: 'pointer' }}>Previous</span>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${currentPage === index ? "active" : ""}`}
                                    onClick={() => setCurrentPage(index)}
                                >
                                    <span className="page-link" style={{ cursor: 'pointer' }}>{index + 1}</span>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`} onClick={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}>
                                <span className="page-link" style={{ cursor: 'pointer' }}>Next</span>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title style={{ fontWeight: 700 }}>Voter Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4 text-center">
                    {selectedUser && (
                        <div>
                            <div style={{ width: '120px', height: '120px', margin: '0 auto 1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', padding: '4px' }}>
                                <img
                                    src={selectedUser.photo || `https://ui-avatars.com/api/?name=${selectedUser.username}&background=random`}
                                    alt="Voter"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '4px solid var(--bg-color-light)' }}
                                />
                            </div>
                            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{selectedUser.firstName} {selectedUser.lastName}</h3>
                            <div style={{ color: 'var(--primary-color)', fontWeight: 500, marginBottom: '1.5rem', fontSize: '1rem' }}>@{selectedUser.username}</div>
                            
                            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}>
                                <div className="mb-2"><strong style={{ color: 'var(--text-secondary)' }}>Email:</strong> {selectedUser.email}</div>
                                <div className="mb-2"><strong style={{ color: 'var(--text-secondary)' }}>Phone:</strong> {selectedUser.phoneNumber}</div>
                                <div className="mb-2"><strong style={{ color: 'var(--text-secondary)' }}>Role:</strong> <span style={{ color: '#c4b5fd' }}>{selectedUser.role}</span></div>
                                <div className="mb-2"><strong style={{ color: 'var(--text-secondary)' }}>Status:</strong> 
                                    <span style={{ marginLeft: '0.5rem', color: selectedUser.status === 'APPROVED' ? '#10b981' : selectedUser.status === 'REJECTED' ? '#f87171' : '#fde047' }}>
                                        {selectedUser.status}
                                    </span>
                                </div>
                                {selectedUser.approvedBy && (
                                    <div className="mb-2">
                                        <strong style={{ color: 'var(--text-secondary)' }}>Verified By:</strong>
                                        <span style={{ marginLeft: '0.5rem', color: '#60a5fa', fontWeight: 600 }}>{selectedUser.approvedBy}</span>
                                    </div>
                                )}
                                {selectedUser.status === 'REJECTED' && selectedUser.rejectionReason && (
                                    <div className="mt-3 p-3" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                                        <strong style={{ color: '#f87171' }}>Rejection Reason:</strong>
                                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-primary)' }}>{selectedUser.rejectionReason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-top-0 pt-0">
                    <button className="btn btn-primary w-100" onClick={() => setShowModal(false)}>Close</button>
                </Modal.Footer>
            </Modal>

            {/* Reject Modal */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title style={{ fontWeight: 700, color: '#f87171' }}>Reject Voter</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <p style={{ color: 'var(--text-secondary)' }}>Please provide a reason for rejecting <strong>{selectedUser?.username}</strong>. This feedback will be shown to the user.</p>
                    <textarea
                        className="form-control"
                        rows="4"
                        placeholder="e.g., The provided ID number does not match your full name..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}
                    ></textarea>
                </Modal.Body>
                <Modal.Footer className="border-top-0 pt-0">
                    <button className="btn btn-outline-light" onClick={() => setShowRejectModal(false)}>Cancel</button>
                    <button className="btn" style={{ background: '#ef4444', color: '#fff' }} onClick={submitReject}>Confirm Rejection</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminDashboard;

