import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await login(formData.email, formData.password);
      if (data?.user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Custom Scoped Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.4); }
          100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
        }
        .glass-card {
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          background-color: rgba(17, 25, 40, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.125);
          animation: pulse-glow 6s infinite ease-in-out;
        }
        .login-input:focus {
          border-color: #3b82f6 !important;
          background: rgba(15, 23, 42, 0.9) !important;
          transform: translateY(-2px);
        }
        .floating-bg {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 0;
          animation: float 8s infinite ease-in-out;
        }
        @media (max-width: 480px) {
          .glass-card { padding: 35px 20px !important; }
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="floating-bg" style={{ top: '10%', left: '15%' }}></div>
      <div className="floating-bg" style={{ bottom: '10%', right: '15%', animationDelay: '-4s' }}></div>

      <div className="glass-card" style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <LogIn size={30} color="#fff" />
          </div>
          <h2 className="login-title" style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your credentials to access your account</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <Mail size={18} style={styles.fieldIcon} />
              <input
                type="email"
                placeholder="name@example.com"
                className="login-input"
                style={styles.input}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                className="login-input"
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

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : 'Sign In Now'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create free account</Link>
        </p>
      </div>
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
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  },
  loginCard: { 
    width: '100%', 
    maxWidth: '440px', 
    padding: '50px 45px', 
    borderRadius: '32px', 
    zIndex: 1,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  header: { textAlign: 'center', marginBottom: '35px' },
  iconCircle: { 
    width: '68px', 
    height: '68px', 
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
    borderRadius: '22px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    margin: '0 auto 20px', 
    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.6)' 
  },
  title: { color: '#fff', fontSize: '30px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.8px' },
  subtitle: { color: '#94a3b8', fontSize: '15px', lineHeight: '1.5' },
  errorBox: { 
    background: 'rgba(239, 68, 68, 0.1)', 
    border: '1px solid rgba(239, 68, 68, 0.2)', 
    color: '#f87171', 
    padding: '14px', 
    borderRadius: '14px', 
    marginBottom: '25px', 
    fontSize: '13px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px' 
  },
  inputGroup: { marginBottom: '22px' },
  label: { display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '10px', marginLeft: '4px' },
  inputContainer: { position: 'relative', display: 'flex', alignItems: 'center' },
  fieldIcon: { position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', transition: 'color 0.2s' },
  eyeBtn: { position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', cursor: 'pointer', transition: 'color 0.2s' },
  input: { 
    width: '100%', 
    padding: '15px 48px 15px 52px', 
    background: 'rgba(15, 23, 42, 0.6)', 
    border: '1px solid rgba(51, 65, 85, 0.5)', 
    borderRadius: '16px', 
    color: '#fff', 
    fontSize: '15px', 
    outline: 'none', 
    transition: 'all 0.3s ease' 
  },
  submitBtn: { 
    width: '100%', 
    padding: '16px', 
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '16px', 
    fontSize: '16px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '12px', 
    marginTop: '15px', 
    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
    transition: 'transform 0.2s, background 0.2s'
  },
  footerText: { textAlign: 'center', color: '#94a3b8', marginTop: '35px', fontSize: '14px' },
  link: { color: '#3b82f6', textDecoration: 'none', fontWeight: '700', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }
};

export default Login;
