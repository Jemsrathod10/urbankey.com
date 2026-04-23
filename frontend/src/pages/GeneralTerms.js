import React, { useEffect } from 'react';

const GeneralTerms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Website Terms of Use</h1>
        <p style={styles.lastUpdated}>Version 1.0 | Effective January 2026</p>

        <div style={styles.content}>
          <section style={styles.section}>
            <h2 style={styles.heading}>1. General Usage</h2>
            <p style={styles.text}>
              Welcome to UrbanKey. By browsing this website, you agree to comply with our general usage policies. This platform is designed to provide property information and connection services between buyers, sellers, and renters.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>2. Intellectual Property</h2>
            <p style={styles.text}>
              All content, including logos, designs, text, and property images (unless otherwise stated), are the intellectual property of UrbanKey. Unauthorized reproduction or use of this content is strictly prohibited.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>3. User Accounts</h2>
            <p style={styles.text}>
              When you create an account to save favorites or compare properties, you are responsible for maintaining the security of your login credentials. UrbanKey is not liable for unauthorized access resulting from user negligence.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>4. External Links</h2>
            <p style={styles.text}>
              Our website may contain links to third-party websites or services. We do not control and are not responsible for the content, privacy policies, or practices of any third-party sites.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>5. Disclaimer of Warranty</h2>
            <p style={styles.text}>
              The information provided on UrbanKey is for general informational purposes. While we strive for accuracy, we provide the platform "as is" without any warranties of any kind regarding completeness or reliability.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.heading}>6. Contact Information</h2>
            <p style={styles.text}>
              If you have any questions regarding these general terms, please contact us at legal@urbankey.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#020617',
    padding: '120px 20px 60px',
    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
  },
  card: {
    maxWidth: '850px',
    margin: '0 auto',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '40px',
    color: '#f8fafc',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '10px',
    color: '#fff',
  },
  lastUpdated: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '30px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  section: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '20px',
  },
  heading: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: '12px',
  },
  text: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#94a3b8',
  },
};

export default GeneralTerms;