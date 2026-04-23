import React, { useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';
import { User, MessageSquare, Search, Circle, Clock, ChevronLeft } from 'lucide-react';

const Messages = () => {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const { data } = await API.get('/chat/conversations/all');
                setContacts(data);
            } catch (err) { 
                console.error("Error fetching inbox:", err); 
            }
        };
        fetchContacts();
    }, []);

    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.page}>
            <style>{`
                @media (max-width: 768px) {
                    .messages-container { 
                        grid-template-columns: 1fr !important; 
                        height: calc(100vh - 80px) !important;
                        margin: 0 !important;
                        gap: 0 !important;
                    }
                    .sidebar-hidden { display: none !important; }
                    .chat-area-hidden { display: none !important; }
                    .mobile-full-width { width: 100% !important; border-radius: 0 !important; }
                }
            `}</style>
            
            <div className="container messages-container" style={styles.container}>
                <div style={{
                    ...styles.sidebar,
                    display: selectedUser ? undefined : 'block'
                }} className={selectedUser ? 'sidebar-hidden' : 'mobile-full-width'}>
                    <h2 style={styles.title}><MessageSquare /> My Chats</h2>
                    
                    <div style={styles.searchWrapper}>
                        <Search size={16} style={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Search contacts..." 
                            style={styles.searchInput}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {filteredContacts.length > 0 ? filteredContacts.map(c => (
                        <div 
                            key={c._id} 
                            onClick={() => setSelectedUser(c)}
                            style={{
                                ...styles.contactCard, 
                                backgroundColor: selectedUser?._id === c._id ? '#3b82f6' : '#1e293b',
                                border: selectedUser?._id === c._id ? '1px solid #60a5fa' : '1px solid transparent'
                            }}
                        >
                            <div style={styles.avatarWrapper}>
                                <div style={styles.avatar}>{c.name.charAt(0).toUpperCase()}</div>
                                <Circle size={10} fill="#10b981" color="#10b981" style={styles.onlineBadge} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={styles.contactHeader}>
                                    <div style={styles.name}>{c.name}</div>
                                    <span style={styles.timeTag}>Active</span>
                                </div>
                                <div style={styles.subText}>{c.role.charAt(0).toUpperCase() + c.role.slice(1)}</div>
                            </div>
                        </div>
                    )) : (
                        <div style={styles.noChat}>
                            <p>No conversations found.</p>
                            <span style={{fontSize: '12px'}}>Messages from buyers or owners will appear here.</span>
                        </div>
                    )}
                </div>

                <div style={{
                    ...styles.chatArea,
                    display: !selectedUser ? undefined : 'flex'
                }} className={!selectedUser ? 'chat-area-hidden' : 'mobile-full-width'}>
                    {selectedUser ? (
                        <div style={styles.chatWrapper}>
                            <div style={styles.mobileHeader} className="show-mobile">
                                <button onClick={() => setSelectedUser(null)} style={styles.backBtn}>
                                    <ChevronLeft size={24} /> Back
                                </button>
                                <span style={styles.mobileName}>{selectedUser.name}</span>
                            </div>
                            
                            <ChatWindow 
                                receiverId={selectedUser._id} 
                                receiverName={selectedUser.name} 
                                onClose={() => setSelectedUser(null)} 
                            />
                        </div>
                    ) : (
                        <div style={styles.emptyState}>
                            <div style={styles.iconCircle}>
                                <MessageSquare size={48} color="#3b82f6" />
                            </div>
                            <h3>Your Messages</h3>
                            <p>Select a contact from the list to start or continue a conversation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#020617', minHeight: '100vh', padding: '20px 0', color: '#fff' },
    container: { display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px', height: '85vh', maxWidth: '1200px', margin: '0 auto' },
    sidebar: { backgroundColor: '#151a35', borderRadius: '20px', padding: '20px', overflowY: 'auto', border: '1px solid #1f2937' },
    title: { fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc' },
    searchWrapper: { position: 'relative', marginBottom: '20px' },
    searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' },
    searchInput: { width: '100%', padding: '10px 10px 10px 35px', backgroundColor: '#020617', border: '1px solid #1f2937', borderRadius: '10px', color: '#fff', fontSize: '14px' },
    contactCard: { display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '15px', cursor: 'pointer', marginBottom: '10px', transition: 'all 0.2s ease' },
    avatarWrapper: { position: 'relative' },
    avatar: { width: '45px', height: '45px', backgroundColor: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: '#3b82f6', border: '2px solid #1e293b' },
    onlineBadge: { position: 'absolute', bottom: '2px', right: '2px', border: '2px solid #151a35', borderRadius: '50%' },
    contactHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontWeight: '600', fontSize: '15px' },
    timeTag: { fontSize: '10px', color: '#10b981' },
    subText: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },
    chatArea: { position: 'relative', backgroundColor: '#1e293b', borderRadius: '20px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    chatWrapper: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%' },
    emptyState: { textAlign: 'center', color: '#94a3b8', padding: '20px', margin: 'auto' },
    iconCircle: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
    noChat: { textAlign: 'center', color: '#64748b', marginTop: '40px', padding: '0 10px' },
    mobileHeader: { display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#151a35', borderBottom: '1px solid #1f2937' },
    backBtn: { background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '16px' },
    mobileName: { marginLeft: '15px', fontWeight: 'bold', fontSize: '16px' }
};

export default Messages;