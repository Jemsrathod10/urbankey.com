import React, { useState, useEffect, useContext } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../utils/api'; 
import { AuthContext } from '../context/AuthContext';

const ContactUs = () => {
  const { user } = useContext(AuthContext); 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || user.mobile || '' 
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to send a message.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/inquiries/send', formData);
      setSent(true);
      setFormData({ 
        name: user?.name || '', 
        email: user?.email || '', 
        phone: user?.phone || user?.mobile || '', 
        message: '' 
      });
      setTimeout(() => setSent(false), 5000); 
    } catch (error) {
      console.error(error);
      alert('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Premium Hover and Animation Styles */}
      <style>
        {`
          .contact-glass-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .contact-glass-card:hover {
            transform: translateY(-10px);
            background: rgba(30, 41, 59, 0.6) !important;
            border-color: rgba(59, 130, 246, 0.5) !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          }
          .icon-glow {
            transition: all 0.4s ease;
          }
          .contact-glass-card:hover .icon-glow {
            transform: scale(1.1) rotate(10deg);
            background: #3b82f6 !important;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
          }
          .gradient-text-main {
            background: linear-gradient(135deg, #fff 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .input-focus-effect:focus {
            border-color: #3b82f6 !important;
            background: rgba(15, 23, 42, 0.8) !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          }
        `}
      </style>

      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title} className="gradient-text-main">Get In Touch</h1>
          <p style={styles.subtitle}>Have questions? Our team is here to help you find your dream property.</p>
        </div>

        <div style={styles.layoutGrid}>
          {/* Left Column: Contact Info Cards */}
          <div style={styles.infoColumn}>
            {[
              { icon: <Mail size={22} />, label: "Email Us", value: "info@urbankey.com" },
              { icon: <Phone size={22} />, label: "Call Us", value: "+91 98765 43210" },
              { icon: <MapPin size={22} />, label: "Our Office", value: "123, Business Park, Ahmedabad" }
            ].map((item, idx) => (
              <div key={idx} className="contact-glass-card" style={styles.infoCard}>
                <div className="icon-glow" style={styles.iconCircle}>{item.icon}</div>
                <div>
                  <span style={styles.infoLabel}>{item.label}</span>
                  <p style={styles.infoValue}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Dynamic Form Card */}
          <div className="contact-glass-card" style={styles.formContainer}>
            {!user ? (
              <div style={styles.lockOverlay}>
                <div style={styles.lockIcon}><Lock size={40} /></div>
                <h3 style={{color: '#fff', fontSize: '24px', marginBottom: '10px', fontWeight: '700'}}>Login Required</h3>
                <p style={{color: '#94a3b8', marginBottom: '30px', fontSize: '15px', lineHeight: '1.6'}}>
                  Please log in to your account to send us an inquiry. 
                  This helps us provide you with personalized assistance.
                </p>
                <Link to="/login" style={styles.loginBtn}>Login Now</Link>
              </div>
            ) : sent ? (
              <div style={styles.successState}>
                <CheckCircle size={60} color="#10b981" />
                <h2 style={{color: '#fff', marginTop: '20px', fontWeight: '700'}}>Message Sent!</h2>
                <p style={{color: '#94a3b8', marginBottom: '20px'}}>We will get back to you very soon.</p>
                <button onClick={() => setSent(false)} style={styles.resetBtn}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={styles.formHeading}>Send a Message</h2>
                
                <div style={styles.inputGroup}>
                  <input
                    className="input-focus-effect"
                    type="text"
                    placeholder="Your Name"
                    style={styles.inputField}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <input
                    className="input-focus-effect"
                    type="email"
                    placeholder="Email Address"
                    style={styles.inputField}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <input
                    className="input-focus-effect"
                    type="tel"
                    placeholder="Phone Number"
                    style={styles.inputField}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <textarea
                    className="input-focus-effect"
                    placeholder="How can we help you?"
                    style={styles.textArea}
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  style={loading ? styles.disabledBtn : styles.sendBtn}
                >
                  {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#030712', padding: '120px 20px 80px' },
  contentWrapper: { maxWidth: '1100px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '60px' },
  title: { fontSize: 'clamp(40px, 8vw, 56px)', fontWeight: '900', marginBottom: '10px' },
  subtitle: { fontSize: '18px', color: '#94a3b8', fontWeight: '500' },
  layoutGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' },
  infoColumn: { display: 'flex', flexDirection: 'column', gap: '20px' },
  infoCard: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '20px', 
    background: 'rgba(30, 41, 59, 0.3)', 
    padding: '30px', 
    borderRadius: '28px', 
    border: '1px solid rgba(255, 255, 255, 0.05)',
    cursor: 'pointer'
  },
  iconCircle: { 
    width: '56px', 
    height: '56px', 
    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
    borderRadius: '18px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: '#fff',
    border: '1px solid rgba(59, 130, 246, 0.2)'
  },
  infoLabel: { display: 'block', color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: { color: '#f8fafc', fontSize: '17px', fontWeight: '600', marginTop: '4px' },
  formContainer: { 
    background: 'rgba(30, 41, 59, 0.3)', 
    padding: '45px', 
    borderRadius: '40px', 
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  formHeading: { color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '30px' },
  inputGroup: { marginBottom: '18px' },
  inputField: { width: '100%', padding: '18px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff', outline: 'none', transition: '0.3s' },
  textArea: { width: '100%', padding: '18px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff', outline: 'none', minHeight: '140px', resize: 'none', transition: '0.3s' },
  sendBtn: { width: '100%', padding: '18px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '17px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.3s', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' },
  disabledBtn: { width: '100%', padding: '18px', backgroundColor: '#1e293b', color: '#64748b', border: 'none', borderRadius: '16px', cursor: 'not-allowed' },
  lockOverlay: { textAlign: 'center', padding: '20px 0' },
  lockIcon: { background: 'rgba(59, 130, 246, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' },
  loginBtn: { display: 'inline-block', padding: '16px 36px', backgroundColor: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '14px', fontWeight: '700', transition: '0.3s', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' },
  successState: { textAlign: 'center', padding: '20px' },
  resetBtn: { marginTop: '20px', background: 'none', border: '1.5px solid #3b82f6', color: '#3b82f6', padding: '10px 25px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' }
};

export default ContactUs;