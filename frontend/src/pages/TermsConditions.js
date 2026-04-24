import React from 'react';
import { FileText, ArrowLeft, X, CheckCircle } from 'lucide-react';

const TermsConditions = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      {/* Premium Modal Card */}
      <div style={styles.modalCard} className="premium-modal">
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .premium-modal {
            animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            backdrop-filter: blur(25px);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #0f172a;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #334155;
            borderRadius: 10px;
          }
          .btn-hover:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
          }
        `}</style>

        {/* Close Button */}
        <button onClick={onClose} style={styles.closeBtn} className="btn-hover">
          <X size={20} />
        </button>

        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <FileText size={32} color="#fff" />
          </div>
          <h1 style={styles.title}>Terms & Conditions</h1>
          <p style={styles.date}>UrbanKey Professional Guidelines • 2026</p>
        </div>

        <div style={styles.scrollContent} className="custom-scrollbar">
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Professional Acceptance</h2>
            <p style={styles.text}>
              By registering as a Property Owner or Agent on UrbanKey, you agree to provide 100% accurate 
              data. Misleading listings will result in immediate account suspension.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Verified Listings</h2>
            <ul style={styles.list}>
              <li style={styles.listItem}>All property images must be real and high-resolution.</li>
              <li style={styles.listItem}>Ownership documents must be ready for verification.</li>
              <li style={styles.listItem}>Spam or duplicate listings are strictly prohibited.</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>3. User Privacy</h2>
            <p style={styles.text}>
              We protect your professional data under our AES-256 encryption protocol. 
              Contact information is only shared with verified potential leads.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Commission & Fees</h2>
            <p style={styles.text}>
              Platform usage fees for agents are subject to the agreed annual plan. 
              UrbanKey does not charge customers for basic browsing.
            </p>
          </section>
        </div>

        {/* Action Footer */}
        <div style={styles.footer}>
          <button 
            onClick={() => {
              onAccept();
              onClose();
            }} 
            style={styles.acceptBtn} 
            className="btn-hover"
          >
            <CheckCircle size={18} />
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalCard: {
    width: '100%',
    maxWidth: '550px',
    maxHeight: '85vh',
    background: '#1e293b',
    borderRadius: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    color: '#94a3b8',
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },
  header: {
    padding: '40px 40px 20px',
    textAlign: 'center'
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px'
  },
  date: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  scrollContent: {
    padding: '0 40px 20px',
    overflowY: 'auto',
    flex: 1
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: '10px'
  },
  text: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#94a3b8'
  },
  list: {
    paddingLeft: '18px',
    margin: '10px 0'
  },
  listItem: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '8px'
  },
  footer: {
    padding: '20px 40px 40px',
    background: 'linear-gradient(to top, #1e293b 80%, transparent)',
  },
  acceptBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.3s ease'
  }
};

export default TermsConditions;
