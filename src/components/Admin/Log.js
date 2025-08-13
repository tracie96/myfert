import React, { useState, useEffect } from "react";
import axios from "axios";
import './Admin.css';
import { baseUrl } from "../../utils/envAccess";
import { handleApiError } from "../Handler/ExceptionHandler";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Log = () => {
    const [tickets, setTickets] = useState([]);
    const [selected, setSelected] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");

    const location = useLocation();
    const { account, firstname, lastname, dob } = location.state || {};
    const userRef = account;

    const userAuth = useSelector((state) => state?.authentication?.userAuth);

    useEffect(() => {
        const fetchTickets = async () => {
            const config = {
                headers: { Authorization: `Bearer ${userAuth?.obj?.token}` },
            };
            try {
                const response = await axios(`${baseUrl}Admin/GetUserLogs/${userRef}`, config);
                const data = response.data;
                if (Array.isArray(data)) {
                    setTickets(data);
                    setSelected(data[0]); // set first ticket as default selected
                }
            } catch (error) {
                handleApiError(error);
            }
        };

        if (userAuth?.obj?.token) {
            fetchTickets();
        }
    }, [userAuth, userRef]);

    const handleSendReply = () => {
        if (!replyMessage.trim()) return;
    
        const newMessage = {
            sender: "agent", // assuming the sender is an admin/agent
            text: replyMessage,
            timestamp: new Date().toISOString(), // optional: timestamp
        };
    
        const updatedMessages = [...(selected.messages || []), newMessage];
    
        const updatedTicket = {
            ...selected,
            messages: updatedMessages,
        };
    
        // Update state
        setSelected(updatedTicket);
    
        // Update in ticket list as well
        setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket.id === updatedTicket.id ? updatedTicket : ticket
            )
        );
    
        // Clear input
        setReplyMessage("");
    
        // Optional: Send to backend here via axios if needed
        // Example:
        // axios.post(`${baseUrl}Admin/ReplyToTicket`, { ticketId: selected.id, message: replyMessage }, config);
    };
    
    return (
        <div className="ticket-container">
            {/* Left column */}
            <div className="ticket-list">
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className={`ticket-item ${selected?.id === ticket.id ? "active" : ""}`}
                        onClick={() => setSelected(ticket)}
                    >
                        <p className="email">{ticket.email}</p>
                        <p><b>IP:</b> {ticket.ipAddress || "N/A"}</p>
                        <p><b>Created:</b> {new Date(ticket.createdOn).toLocaleString()}</p>
                        <p><b>Action:</b> {ticket.action}</p>
                        <p><b>Response:</b> {ticket.response}</p>
                    </div>
                ))}
            </div>

            {/* Middle column */}
            <div className="ticket-detail">
                {selected ? (
                    <>
                        <div className="btn-group">
                            <button className="btn-action">Actions</button>
                            <button className="btn-action">Close</button>
                        </div>

                        <div className="ticket-header">
                            <div>
                                <p className="email">{selected.email}</p>
                                <p className="userDetails">
                                    <span className="label">Account #:</span> <span className="value">{account || "N/A"}</span> &nbsp;
                                    <span className="label">FirstName:</span> <span className="value">{firstname || "*****"}</span> &nbsp;
                                    <span className="label">LastName:</span> <span className="value">{lastname || "*****"}</span> &nbsp;
                                    <span className="label">DOB:</span> <span className="value">{dob ? new Date(dob).toLocaleDateString() : "*****"}</span>
                                </p>

                            </div>
                        </div>

                        <h4>{selected.subject}</h4>
                        <div className="message-thread">
                            {selected.messages?.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`message ${msg.sender === "user" ? "user" : "agent"}`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        <div className="reply-box">
                            <input
                                placeholder="Reply..."
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                            />
                            <button onClick={handleSendReply}>Send</button>
                        </div>
                    </>
                ) : (
                    <div className="ticket-detail-empty">Select a ticket to view details.</div>
                )}
            </div>
        </div>
    );
};

export default Log;
