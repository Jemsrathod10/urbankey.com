import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Send, X, Image as ImageIcon, Loader, CheckCheck, Phone, Video, Search } from 'lucide-react'; 
import API from '../utils/api';

const SOCKET_URL = window.location.hostname === "localhost" 
    ? "https://urbankey-com.onrender.com" 
    : `http://${window.location.hostname}:5000`;

const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    autoConnect: true
});

const ChatWindow = ({ receiverId, receiverName, onClose }) => {
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const scrollRef = useRef();
    const fileInputRef = useRef();
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (user?._id && receiverId) {
            const connectSocket = () => {
                socket.emit("join", user._id);
                socket.emit("checkOnline", { userId: receiverId });
            };

            if (socket.connected) connectSocket();
            socket.on("connect", connectSocket);

            const fetchHistory = async () => {
                try {
                    const { data } = await API.get(`/chat/${receiverId}`);
                    setChatHistory(Array.isArray(data) ? data : []);
                    socket.emit("markAsRead", { sender: receiverId, receiver: user._id });
                } catch (err) { console.error(err); }
            };
            fetchHistory();

            const handleStatus = (data) => {
                if (data.userId === receiverId) {
                    setIsOnline(data.status === "online" || data.isOnline === true);
                }
            };

            socket.on("userStatus", handleStatus);
            socket.on("statusUpdate", handleStatus);

            const interval = setInterval(() => {
                socket.emit("checkOnline", { userId: receiverId });
            }, 3000);

            return () => {
                clearInterval(interval);
                socket.off("userStatus");
                socket.off("statusUpdate");
            };
        }
    }, [receiverId, user]);

    useEffect(() => {
        const handleNewMessage = (data) => {
            const sId = data.sender?._id || data.sender;
            const rId = data.receiver?._id || data.receiver;
            if (sId === receiverId || rId === receiverId) {
                setChatHistory(prev => prev.some(m => m._id === data._id) ? prev : [...prev, data]);
                if (sId === receiverId) {
                    socket.emit("markAsRead", { sender: receiverId, receiver: user._id });
                }
            }
        };

        const handleMessageRead = ({ sender, receiver }) => {
            if (sender === user._id && receiver === receiverId) {
                setChatHistory(prev => prev.map(msg => ({ ...msg, read: true })));
            }
        };

        socket.on("getMessage", handleNewMessage);
        socket.on("messageRead", handleMessageRead); 
        socket.on("typing", ({ senderId }) => senderId === receiverId && setIsTyping(true));
        socket.on("stopTyping", ({ senderId }) => senderId === receiverId && setIsTyping(false));
        
        return () => {
            socket.off("getMessage");
            socket.off("messageRead");
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [receiverId, user]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isTyping]);

    const handleTypingStatus = (e) => {
        setMessage(e.target.value);
        socket.emit("typing", { senderId: user._id, receiverId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { senderId: user._id, receiverId });
        }, 2000);
    };

    const handleSend = async (e, content = null) => {
        if (e) e.preventDefault();
        const text = content || message;
        if (!user?._id || !text.trim() || !receiverId) return;
        socket.emit("sendMessage", { sender: user._id, receiver: receiverId, text: text.trim(), createdAt: new Date().toISOString(), read: false });
        socket.emit("stopTyping", { senderId: user._id, receiverId });
        setMessage("");
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            setUploading(true);
            const { data } = await API.post('/chat/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            handleSend(null, data.imageUrl);
        } catch (err) { console.error("Upload failed"); } 
        finally { setUploading(false); e.target.value = ""; }
    };

    if (!user) return null;

    return (
        <div style={styles.chatContainer} className="responsive-chat-window">
            <style>{`
                @media (max-width: 600px) {
                    .responsive-chat-window {
                        width: 95% !important;
                        height: 70vh !important;
                        bottom: 10px !important;
                        right: 2.5% !important;
                        left: 2.5% !important;
                        border-radius: 15px !important;
                    }
                    .header-container {
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        align-items: center !important;
                        justify-content: space-between !important;
                    }
                    .icons-wrapper {
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        gap: 8px !important;
                    }
                    .icons-wrapper svg {
                        display: inline-block !important;
                        width: 18px !important;
                        height: 18px !important;
                    }
                }
            `}</style>

            <div style={styles.header} className="header-container">
                <div style={styles.profileSection}>
                    <div style={styles.avatar}>
                        {receiverName.charAt(0).toUpperCase()}
                        <div style={{...styles.statusDot, backgroundColor: isOnline ? '#22c55e' : '#94a3b8'}} />
                    </div>
                    <div style={styles.nameSection}>
                        <div style={styles.uName}>{receiverName}</div>
                        <div style={styles.uStatus}>{isTyping ? 'typing...' : (isOnline ? 'Online' : 'Offline')}</div>
                    </div>
                </div>
                
                <div style={styles.iconSection} className="icons-wrapper">
                    <Search size={18} onClick={() => setShowSearch(!showSearch)} style={styles.clickable} />
                    <Phone size={18} style={styles.clickable} />
                    <Video size={18} style={styles.clickable} />
                    <X size={20} onClick={onClose} style={styles.clickable} />
                </div>
            </div>

            {showSearch && (
                <div style={styles.searchArea}>
                    <input style={styles.searchInp} placeholder="Search..." onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
                </div>
            )}
            
            <div style={styles.messageArea}>
                {chatHistory.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase())).map((m, i) => {
                    const isMyMsg = (m.sender?._id || m.sender) === user?._id;
                    const isImage = typeof m.text === 'string' && (m.text.match(/\.(jpeg|jpg|gif|png)$/) != null || m.text.includes('uploads/'));
                    return (
                        <div key={m._id || i} style={isMyMsg ? styles.myMsgRow : styles.theirMsgRow}>
                            <div style={isMyMsg ? styles.myMsg : styles.theirMsg}>
                                {isImage ? <img src={m.text.startsWith('http') ? m.text : `${SOCKET_URL}/${m.text}`} alt="msg" style={styles.chatImg} /> : <span>{m.text}</span>}
                                <div style={styles.timestamp}>
                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMyMsg && <CheckCheck size={12} color={m.read ? "#3b82f6" : "#94a3b8"} style={{marginLeft: 3}} />}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSend} style={styles.inputArea}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                <button type="button" onClick={() => fileInputRef.current.click()} style={styles.iconBtn} disabled={uploading}>
                    {uploading ? <Loader size={18} className="animate-spin" /> : <ImageIcon size={20} color="#94a3b8" />}
                </button>
                <input value={message} onChange={handleTypingStatus} placeholder="Message..." style={styles.input} autoComplete="off" />
                <button type="submit" style={styles.sendBtn}><Send size={18} /></button>
            </form>
        </div>
    );
};

const styles = {
    chatContainer: { position: 'fixed', bottom: '20px', right: '20px', width: '340px', height: '490px', backgroundColor: '#151a35', borderRadius: '15px', display: 'flex', flexDirection: 'column', zIndex: 10001, border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden' },
    header: { backgroundColor: '#3b82f6', color: '#fff', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' },
    profileSection: { display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 },
    nameSection: { marginLeft: '10px', display: 'flex', flexDirection: 'column', minWidth: 0 },
    avatar: { width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0, fontWeight: 'bold' },
    statusDot: { position: 'absolute', bottom: '0', right: '0', width: '9px', height: '9px', borderRadius: '50%', border: '1.5px solid #3b82f6' },
    uName: { fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    uStatus: { fontSize: '10px', opacity: 0.9 },
    iconSection: { display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 },
    clickable: { cursor: 'pointer' },
    searchArea: { padding: '8px 12px', backgroundColor: '#1e293b' },
    searchInp: { width: '100%', padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '12px', outline: 'none' },
    messageArea: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#0f172a' },
    myMsgRow: { alignSelf: 'flex-end', display: 'flex', width: '100%', justifyContent: 'flex-end' },
    theirMsgRow: { alignSelf: 'flex-start', display: 'flex', width: '100%', justifyContent: 'flex-start' },
    myMsg: { backgroundColor: '#3b82f6', color: '#fff', padding: '9px 13px', borderRadius: '15px 15px 2px 15px', fontSize: '13px', maxWidth: '85%' },
    theirMsg: { backgroundColor: '#1f2937', color: '#fff', padding: '9px 13px', borderRadius: '15px 15px 15px 2px', fontSize: '13px', border: '1px solid #334155', maxWidth: '85%' },
    timestamp: { fontSize: '9px', marginTop: '3px', opacity: 0.7, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' },
    chatImg: { maxWidth: '100%', maxHeight: '180px', borderRadius: '10px', display: 'block' },
    inputArea: { padding: '12px', display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#151a35', borderTop: '1px solid #334155' },
    input: { flex: 1, padding: '10px 15px', borderRadius: '25px', border: 'none', backgroundColor: '#0a0e27', color: '#fff', fontSize: '14px', outline: 'none' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer' },
    sendBtn: { backgroundColor: '#3b82f6', border: 'none', color: '#fff', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default ChatWindow;
