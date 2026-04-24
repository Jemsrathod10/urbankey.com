import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Mail, Phone, Instagram, Linkedin, Facebook, HelpCircle } from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div style={styles.footerWrapper}>
      <footer style={styles.footerCard}>
        <div style={styles.container}>
          <div style={styles.mainGrid}>
            <div style={styles.brandSection}>
              <div style={styles.logo}>
                <div style={styles.logoIconBg}>
                  <img 
                    src="/logo1.png" 
                    alt="UrbanKey Logo" 
                    style={styles.logoImage} 
                  />
                </div>
                <span style={styles.logoText}>UrbanKey</span>
              </div>
              <p style={styles.brandDesc}>
                Modern way to find your next home. Transparent, fast, and secure. Trusted by thousands in Gujarat.
              </p>
              <div style={styles.socialIcons}>
                {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                  <a key={i} href="#" style={styles.iconCircle}><Icon size={18} /></a>
                ))}
              </div>
            </div>

            <div style={styles.linksSection}>
              <div style={styles.linkCol}>
                <h4 style={styles.colTitle}>Company</h4>
                <Link to="/about" style={styles.footerLink}>About Us</Link>
                <Link to="/contact" style={styles.footerLink}>Contact</Link>
                <Link to="/faqs" style={styles.footerLink}>FAQs</Link>
              </div>

              <div style={styles.linkCol}>
                <h4 style={styles.colTitle}>Services</h4>
                <Link to="/properties/buy" style={styles.footerLink}>Buy Property</Link>
                <Link to="/properties/rent" style={styles.footerLink}>Rentals</Link>
                <Link to="/add-property" style={styles.footerLink}>List Your Own</Link>
              </div>

              <div style={styles.linkCol}>
                <h4 style={styles.colTitle}>Support</h4>
                <div style={styles.contactItem}><Mail size={14} color="#3b82f6" /> info@urbankey.com</div>
                <div style={styles.contactItem}><Phone size={14} color="#10b981" /> +91 98765 43210</div>
                <Link to="/faqs" style={{...styles.footerLink, display: 'flex', alignItems: 'center', gap: '5px'}}>
                   <HelpCircle size={14} /> Help Center
                </Link>
              </div>
            </div>
          </div>

          <div style={styles.bottomBar}>
            <p style={styles.copyText}>© 2026 UrbanKey. Built with ❤️ in Gujarat.</p>
            <div style={styles.legalLinks}>
              <Link to="/privacy-policy" style={styles.tinyLink}>Privacy Policy</Link>
              <Link to="/terms" style={styles.tinyLink}>Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  footerWrapper: { 
    padding: '40px 15px', 
    backgroundColor: '#020617', 
    display: 'flex', 
    justifyContent: 'center', 
    marginTop: 'auto' 
  },
  footerCard: { 
    width: '100%', 
    maxWidth: '1200px', 
    backgroundColor: 'rgba(15, 23, 42, 0.5)', 
    backdropFilter: 'blur(16px)', 
    borderRadius: '30px', 
    border: '1px solid rgba(255, 255, 255, 0.08)', 
    padding: '40px 0 20px 0' 
  },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 25px' },
  mainGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '40px', 
    marginBottom: '40px' 
  },
  brandSection: { display: 'flex', flexDirection: 'column' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  logoIconBg: { 
    background: 'transparent', // Removed the gradient background
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  logoImage: {
    width: '40px', // Slightly increased size since background box is gone
    height: '40px',
    objectFit: 'contain'
  },
  logoText: { color: '#fff', fontSize: '22px', fontWeight: '800' },
  brandDesc: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' },
  socialIcons: { display: 'flex', gap: '12px', marginTop: '20px' },
  iconCircle: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.05)' },
  linksSection: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
    gap: '30px' 
  },
  linkCol: { display: 'flex', flexDirection: 'column', gap: '12px' },
  colTitle: { color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' },
  footerLink: { color: '#94a3b8', textDecoration: 'none', fontSize: '14px' },
  contactItem: { color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
  bottomBar: { 
    borderTop: '1px solid rgba(255,255,255,0.05)', 
    paddingTop: '20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    flexWrap: 'wrap', 
    gap: '15px' 
  },
  copyText: { color: '#64748b', fontSize: '12px' },
  legalLinks: { display: 'flex', gap: '20px' },
  tinyLink: { color: '#64748b', fontSize: '12px', textDecoration: 'none' }
};

export default Footer;
