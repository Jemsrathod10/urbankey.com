import React from 'react';
import { Shield, Lock, Eye, RefreshCw } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <Shield size={60} color="#3b82f6" />
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.subtitle}>Protecting your data is our top priority. Learn how we handle your information.</p>
      </div>

      <div className="container" style={styles.contentWrapper}>
        <div style={styles.card}>
          <div style={styles.lastUpdate}><RefreshCw size={14} /> Last updated: January 2026</div>
          
          <section style={styles.section}>
            <div style={styles.sectionHeader}><Lock size={20} color="#3b82f6" /> <h2>1. Data Collection</h2></div>
            <p>We collect essential information to provide you with the best property-matching experience, including name, contact details, and location preferences.</p>
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}><Eye size={20} color="#10b981" /> <h2>2. Information Usage</h2></div>
            <p>Your data helps us verify property listings, connect buyers with sellers, and prevent fraudulent activities on the platform.</p>
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}><Shield size={20} color="#f59e0b" /> <h2>3. Security Measures</h2></div>
            <p>We use industry-standard encryption to protect your sensitive data. We never share your personal contact information without your explicit consent.</p>
          </section>

          <div style={styles.contactNotice}>
            Questions? Contact our data team at <a href="mailto:privacy@urbankey.com" style={{color: '#3b82f6'}}>privacy@urbankey.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#020617', minHeight: '100vh', paddingBottom: '80px' },
  heroSection: { textAlign: 'center', padding: '80px 20px', background: 'linear-gradient(to bottom, #1e293b, #020617)' },
  title: { color: '#fff', fontSize: '48px', fontWeight: '800', marginTop: '20px' },
  subtitle: { color: '#94a3b8', fontSize: '18px', maxWidth: '600px', margin: '15px auto 0' },
  contentWrapper: { maxWidth: '850px', margin: '-40px auto 0', padding: '0 20px' },
  card: { backgroundColor: '#1e293b', borderRadius: '24px', padding: '40px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
  lastUpdate: { color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '30px' },
  section: { marginBottom: '35px' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', color: '#f1f5f9', marginBottom: '12px' },
  contactNotice: { marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #334155', color: '#94a3b8', textAlign: 'center' }
};

export default PrivacyPolicy;
