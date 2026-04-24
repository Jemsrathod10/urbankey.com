import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Mail, Lock, User, Phone, MapPin, CheckCircle, ShieldCheck, AlertCircle, ArrowRight, Eye, EyeOff, Clock } from 'lucide-react';
import API from '../utils/api';
import TermsConditions from './TermsConditions';

const RegisterOwner = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', termsAccepted: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (formData.name.trim().length < 3) return "Full Name must be at least 3 characters long";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address";
    if (formData.phone.length !== 10) return "Phone number must be exactly 10 digits";
    if (formData.address.trim().length < 5) return "Please provide a valid physical address";
    if (formData.password.length < 6) return "Password must be at least 6 characters long";
    if (!formData.termsAccepted) return "You must accept the terms to continue";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data } = await API.post('/auth/register', {
        ...formData, 
        role: 'owner', 
        businessInfo: { address: formData.address }
      });
      if (data.success || data.needsApproval) setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { 
      setLoading(false); 
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard} className="premium-card">
          <div style={styles.successIconCircle}><Clock size={40} color="#3b82f6" /></div>
          <h2 style={styles.title}>Account Pending</h2>
          <div style={styles.statusBadge}>AWAITING APPROVAL</div>
          <p style={styles.successSubtext}>
            Your registration as an <b>Owner</b> was successful! 
            To ensure the quality of our listings, your account is now being verified by the <b>UrbanKey Admin Team</b>.
            <br /><br />
            You will receive a notification as soon as your access is granted.
          </p>
          <Link to="/login" style={styles.primaryBtn}>Return to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .premium-card { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); backdrop-filter: blur(20px); }
        .input-focus:focus { border-color: #3b82f6 !important; background: #020617 !important; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .btn-hover:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4); }
      `}</style>

      <div style={styles.card} className="premium-card">
        <div style={styles.headerSection}>
          <div style={styles.logoIcon}><Home size={28} color="#fff" /></div>
          <h2 style={styles.title}>Owner Registration</h2>
          <p style={styles.subtitle}>Directly list and manage your properties with UrbanKey ease.</p>
        </div>

        {error && <div style={styles.errorBox}><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.innerIcon} />
              <input style={styles.input} className="input-focus" type="text" placeholder="John Doe" required onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.innerIcon} />
                <input style={styles.input} className="input-focus" type="email" placeholder="owner@email.com" required onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone</label>
              <div style={styles.inputWrapper}>
                <Phone size={18} style={styles.innerIcon} />
                <input style={styles.input} className="input-focus" type="tel" maxLength="10" placeholder="9876543210" required onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Physical Address</label>
            <div style={styles.inputWrapper}>
              <MapPin size={18} style={styles.innerIcon} />
              <input style={styles.input} className="input-focus" type="text" placeholder="Your residential address" required onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.innerIcon} />
              <input 
                style={styles.input} 
                className="input-focus" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
              <div onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div style={styles.termsBox}>
            <input type="checkbox" id="termsOwner" style={styles.checkbox} checked={formData.termsAccepted} onChange={e => setFormData({...formData, termsAccepted: e.target.checked})} />
            <label htmlFor="termsOwner" style={styles.checkboxLabel}>
              I accept the <span onClick={() => setIsModalOpen(true)} style={styles.linkSpan}>Owner Guidelines</span>.
            </label>
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.primaryBtn,
              opacity: (loading || !formData.termsAccepted) ? 0.6 : 1,
              cursor: (loading || !formData.termsAccepted) ? 'not-allowed' : 'pointer'
            }} 
            className="btn-hover" 
            disabled={loading || !formData.termsAccepted}
          >
            {loading ? 'Saving...' : 'Register as Owner'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p style={styles.footerText}>Registered already? <Link to="/login" style={styles.link}>Login</Link></p>
      </div>

      <TermsConditions 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAccept={() => setFormData({...formData, termsAccepted: true})} 
      />
    </div>
  );
};

const styles = {
  container: { 
    minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', 
    backgroundColor: '#020617', padding: '40px 20px',
    backgroundImage: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 40%)'
  },
  card: { 
    backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '45px', borderRadius: '32px', width: '100%', 
    maxWidth: '600px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
  },
  headerSection: { textAlign: 'center', marginBottom: '35px' },
  logoIcon: { 
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', width: '64px', height: '64px', 
    borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
  },
  title: { color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' },
  subtitle: { color: '#64748b', fontSize: '15px', fontWeight: '500' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  innerIcon: { position: 'absolute', left: '16px', color: '#475569' },
  eyeBtn: { position: 'absolute', right: '16px', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  input: { 
    width: '100%', padding: '14px 44px 14px 48px', borderRadius: '14px', border: '1px solid #1e293b', 
    backgroundColor: '#0f172a', color: '#fff', fontSize: '15px', outline: 'none', transition: 'all 0.3s ease' 
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  termsBox: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '5px' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer', accentColor: '#3b82f6' },
  checkboxLabel: { color: '#94a3b8', fontSize: '14px' },
  linkSpan: { color: '#3b82f6', fontWeight: '600', cursor: 'pointer', borderBottom: '1px solid rgba(59, 130, 246, 0.3)' },
  primaryBtn: { 
    width: '100%', padding: '16px', borderRadius: '16px', border: 'none', 
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', 
    fontWeight: '800', fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s ease',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
  },
  errorBox: { 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '12px 16px', 
    borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '20px', 
    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px'
  },
  footerText: { textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '28px' },
  link: { color: '#3b82f6', textDecoration: 'none', fontWeight: '700' },
  successCard: { textAlign: 'center', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '50px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.08)', maxWidth: '450px' },
  successIconCircle: { 
    width: '80px', height: '80px', backgroundColor: 'rgba(59, 130, 246, 0.1)', 
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' 
  },
  successSubtext: { color: '#94a3b8', lineHeight: '1.6', marginBottom: '30px', fontSize: '15px' },
  statusBadge: { display: 'inline-block', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', marginBottom: '15px' }
};

export default RegisterOwner;
