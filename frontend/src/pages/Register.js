import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus, ArrowRight, Users, Eye, EyeOff, AlertCircle, Briefcase, Home } from 'lucide-react';
import API from '../utils/api';
import TermsConditions from './TermsConditions';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if ((formData.role === 'owner' || formData.role === 'agent') && !agreedToTerms) {
      setError("You must agree to the Terms and Conditions to continue");
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .premium-card {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(20px);
        }
        .input-focus:focus {
          border-color: #3b82f6 !important;
          background: #020617 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .register-btn:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
        }
        .role-card:hover {
          border-color: #3b82f6 !important;
          background: rgba(59, 130, 246, 0.05) !important;
        }
      `}</style>

      <div style={styles.loginCard} className="premium-card">
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <UserPlus size={28} color="#fff" />
          </div>
          <h2 style={styles.title}>Join UrbanKey</h2>
          <p style={styles.subtitle}>Create your account to start your journey</p>
        </div>

        <div style={styles.roleSelectionContainer}>
          <p style={styles.roleTitle}>Register as a Professional?</p>
          <div style={styles.roleGrid}>
            <div onClick={() => navigate('/register-owner')} style={styles.roleCard} className="role-card">
              <Home size={20} color="#3b82f6" />
              <span>Owner</span>
            </div>
            <div onClick={() => navigate('/register-agent')} style={styles.roleCard} className="role-card">
              <Briefcase size={20} color="#3b82f6" />
              <span>Agent</span>
            </div>
          </div>
          <div style={styles.divider}>
            <span style={styles.dividerText}>OR CUSTOMER ACCOUNT</span>
          </div>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputContainer}>
              <User size={18} style={styles.fieldIcon} />
              <input
                type="text"
                placeholder="John Doe"
                className="input-focus"
                style={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <Mail size={18} style={styles.fieldIcon} />
              <input
                type="email"
                placeholder="john@example.com"
                className="input-focus"
                style={styles.input}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <div style={styles.inputContainer}>
              <Phone size={18} style={styles.fieldIcon} />
              <input
                type="tel"
                maxLength="10"
                placeholder="10 Digit Number"
                className="input-focus"
                style={styles.input}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <Lock size={18} style={styles.fieldIcon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input-focus"
                style={styles.input}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            style={styles.submitBtn} 
            className="register-btn"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign In</Link>
        </p>
      </div>

      <TermsConditions 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAccept={() => setAgreedToTerms(true)}
      />
    </div>
  );
};

const styles = {
  pageWrapper: { 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    background: '#020617', 
    padding: '40px 20px',
    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)' 
  },
  loginCard: { 
    width: '100%', 
    maxWidth: '450px', 
    background: 'rgba(15, 23, 42, 0.8)', 
    padding: '40px', 
    borderRadius: '32px', 
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  header: { textAlign: 'center', marginBottom: '24px' },
  iconCircle: { 
    width: '64px', 
    height: '64px', 
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
    borderRadius: '20px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    margin: '0 auto 16px',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
  },
  title: { color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' },
  subtitle: { color: '#64748b', fontSize: '14px', fontWeight: '500' },
  roleSelectionContainer: { marginBottom: '24px', textAlign: 'center' },
  roleTitle: { color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase' },
  roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' },
  roleCard: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '12px', background: '#0f172a', border: '1px solid #1e293b',
    borderRadius: '14px', cursor: 'pointer', color: '#fff', fontSize: '14px', fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  divider: { position: 'relative', borderBottom: '1px solid #1e293b', margin: '20px 0' },
  dividerText: { 
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    background: '#0f172a', padding: '0 10px', color: '#475569', fontSize: '10px', fontWeight: '800'
  },
  errorBox: { 
    background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '12px 16px', 
    borderRadius: '12px', marginBottom: '20px', fontSize: '13px', display: 'flex', 
    alignItems: 'center', gap: '10px', border: '1px solid rgba(239, 68, 68, 0.2)'
  },
  inputGroup: { marginBottom: '20px' },
  label: { 
    display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: '700', 
    marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px'
  },
  inputContainer: { position: 'relative', display: 'flex', alignItems: 'center' },
  fieldIcon: { position: 'absolute', left: '16px', color: '#475569' },
  eyeBtn: { position: 'absolute', right: '16px', color: '#475569', cursor: 'pointer' },
  input: { 
    width: '100%', padding: '14px 44px 14px 48px', background: '#0f172a', 
    border: '1px solid #1e293b', borderRadius: '14px', color: '#fff', 
    fontSize: '15px', outline: 'none', transition: 'all 0.3s ease'
  },
  submitBtn: { 
    width: '100%', padding: '16px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
    color: '#fff', border: 'none', borderRadius: '16px', fontSize: '16px', 
    fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', 
    gap: '12px', marginTop: '8px', transition: 'all 0.3s ease'
  },
  footerText: { textAlign: 'center', color: '#64748b', marginTop: '28px', fontSize: '14px' },
  link: { color: '#3b82f6', textDecoration: 'none', fontWeight: '700' }
};

export default Register;
