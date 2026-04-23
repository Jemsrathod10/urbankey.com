import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, Heart, LogOut, Plus, User, MessageSquare, LayoutDashboard } from 'lucide-react';

const Header = () => {
  // Logic Addition: Added 'loading' to prevent flickering during refresh
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [unreadCount, setUnreadCount] = useState(1); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showMenu]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMenu(false);
  };

  const isAgentOrOwner = user && (user.role === 'agent' || user.role === 'owner');

  // Logic Addition: If auth is loading, don't render the action buttons yet
  // This prevents the header from showing "Login" buttons for a split second on refresh
  const renderAuthSection = () => {
    if (loading) {
      return <div style={{ width: '100px' }}></div>; // Placeholder while loading
    }

    if (user) {
      return (
        <>
          <Link to="/messages" className="notification-container" style={styles.iconBtn} title="Messages">
            <MessageSquare size={20} color={location.pathname === '/messages' ? '#3b82f6' : '#94a3b8'} />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </Link>
          <Link to="/favorites" style={styles.iconBtn} title="My Favorites">
            <Heart size={20} color={location.pathname === '/favorites' ? '#ef4444' : '#94a3b8'} fill={location.pathname === '/favorites' ? '#ef4444' : 'none'} />
          </Link>

          {isAgentOrOwner && (
            <>
              <Link to="/dashboard" style={styles.iconBtn} title="Dashboard">
                <LayoutDashboard size={20} color={location.pathname === '/dashboard' ? '#3b82f6' : '#94a3b8'} />
              </Link>
              <Link to="/add-property" style={styles.addBtn}>
                <Plus size={18} /> <span>List Property</span>
              </Link>
            </>
          )}

          <div style={styles.profileSection}>
            <div style={styles.userBadge}>
              <User size={16} color="#3b82f6" />
              <span style={{color: '#f8fafc'}}>{user.name ? user.name.split(' ')[0] : 'User'}</span>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </>
      );
    }

    return (
      <div style={styles.authButtons}>
        <Link to="/login" style={styles.loginLink}>Login</Link>
        <Link to="/register" style={styles.registerBtn}>Register</Link>
      </div>
    );
  };

  return (
    <div style={styles.navWrapper}>
      <style>{`
        @media (max-width: 1024px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .header-main { 
            height: ${scrolled ? '60px' : '75px'} !important; 
            border-radius: 18px !important; 
            padding: 0 12px !important;
            display: flex !important;
            align-items: center !important;
            transition: all 0.3s ease-in-out !important;
          }
          .container-mobile {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
          }
          .logo-link-mobile {
            display: flex !important;
            align-items: center !important;
            height: 100% !important;
            max-width: 160px !important;
          }
          .logo-img-mobile { 
            height: ${scrolled ? '35px' : '45px'} !important; 
            width: auto !important;
            margin: 0 !important;
            object-fit: contain !important;
            display: block !important;
            transition: all 0.3s ease !important;
          }
          .menu-btn-mobile {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
        @media (min-width: 1025px) {
          .show-mobile { display: none !important; }
        }
        .notification-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        .notification-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          border: 2px solid #030712;
        }
        .nav-item-hover:hover {
          color: #3b82f6 !important;
        }
      `}</style>

      <header className="header-main" style={{
        ...styles.header,
        ...(scrolled ? styles.headerScrolled : {}),
        height: scrolled ? '65px' : '80px',
      }}>
        <div className="container container-mobile" style={styles.container}>
          
          <Link to="/" className="logo-link-mobile" onClick={() => setShowMenu(false)}>
            <img 
              src="/logo.png" 
              alt="UrbanKey" 
              className="logo-img-mobile"
              style={{
                ...styles.logoImage,
                height: scrolled ? '38px' : '48px'
              }} 
            />
          </Link>

          <nav className="hide-mobile" style={styles.desktopNav}>
            <div style={styles.navLinksGroup}>
              <Link to="/" className="nav-item-hover" style={{...styles.navLink, color: location.pathname === '/' ? '#3b82f6' : '#e2e8f0'}}>
                Home {location.pathname === '/' && <div style={styles.activeDot} />}
              </Link>
              <Link to="/properties/buy" className="nav-item-hover" style={{...styles.navLink, color: location.pathname === '/properties/buy' ? '#3b82f6' : '#e2e8f0'}}>
                Buy {location.pathname === '/properties/buy' && <div style={styles.activeDot} />}
              </Link>
              <Link to="/properties/rent" className="nav-item-hover" style={{...styles.navLink, color: location.pathname === '/properties/rent' ? '#3b82f6' : '#e2e8f0'}}>
                Rent {location.pathname === '/properties/rent' && <div style={styles.activeDot} />}
              </Link>
              <Link to="/about" className="nav-item-hover" style={{...styles.navLink, color: location.pathname === '/about' ? '#3b82f6' : '#e2e8f0'}}>
                About {location.pathname === '/about' && <div style={styles.activeDot} />}
              </Link>
              <Link to="/contact" className="nav-item-hover" style={{...styles.navLink, color: location.pathname === '/contact' ? '#3b82f6' : '#e2e8f0'}}>
                Contact {location.pathname === '/contact' && <div style={styles.activeDot} />}
              </Link>
            </div>

            <div style={styles.actionGroup}>
              {/* Using the render function to respect loading state */}
              {renderAuthSection()}
            </div>
          </nav>

          <button onClick={() => setShowMenu(!showMenu)} style={styles.menuBtn} className="show-mobile menu-btn-mobile">
            {showMenu ? <X size={28} color="#fff" /> : <Menu size={28} color="#fff" />}
          </button>
        </div>

        {showMenu && (
          <div style={styles.mobileOverlay}>
            <div style={styles.mobileNav}>
              {loading ? (
                <p style={{color: '#94a3b8', textAlign: 'center'}}>Loading...</p>
              ) : user ? (
                <>
                  <div style={styles.mobileUserInfo}>
                      <div style={styles.mobileUserName}>
                        <User size={18} color="#3b82f6" />
                        <span>{user.name}</span>
                      </div>
                      <span style={styles.roleBadge}>{user.role.toUpperCase()}</span>
                  </div>
                  <Link to="/" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>Home</Link>
                  <Link to="/properties/buy" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>Buy</Link>
                  <Link to="/properties/rent" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>Rent</Link>
                  <Link to="/about" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>About</Link>
                  <Link to="/contact" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>Contact</Link>
                  <div style={{height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '5px 0'}} />
                  {isAgentOrOwner && (
                    <Link to="/dashboard" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>Dashboard</Link>
                  )}
                  <Link to="/messages" style={{...styles.mobileNavLink, display: 'flex', alignItems: 'center', gap: '10px', position: 'relative'}} onClick={() => setShowMenu(false)}>
                    <MessageSquare size={18} /> Messages
                    {unreadCount > 0 && <span style={styles.mobileRedDot}></span>}
                  </Link>
                  <Link to="/favorites" style={{...styles.mobileNavLink, display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => setShowMenu(false)}>
                    <Heart size={18} /> Favorites
                  </Link>
                  {isAgentOrOwner && (
                    <Link to="/add-property" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>List Property</Link>
                  )}
                  <div style={{height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '15px 0'}} />
                  <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                    <LogOut size={20} />
                    <span>Logout Account</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>Home</Link>
                  <Link to="/properties/buy" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>Buy</Link>
                  <Link to="/properties/rent" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>Rent</Link>
                  <Link to="/about" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>About</Link>
                  <Link to="/contact" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>Contact</Link>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px'}}>
                    <Link to="/login" style={styles.mobileNavLink} onClick={() => setShowMenu(false)}>Login</Link>
                    <Link to="/register" style={styles.registerBtnMobile} onClick={() => setShowMenu(false)}>Register Account</Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

const styles = {
  navWrapper: { position: 'sticky', top: 0, zIndex: 1000, padding: '12px', display: 'flex', justifyContent: 'center', backgroundColor: '#030712' },
  header: { width: '100%', maxWidth: '1240px', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' },
  headerScrolled: { backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(59, 130, 246, 0.2)' },
  container: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px', width: '100%' },
  logoImage: { width: 'auto', objectFit: 'contain', display: 'block', transition: 'all 0.3s ease' },
  desktopNav: { display: 'flex', alignItems: 'center', flex: 1 },
  navLinksGroup: { display: 'flex', gap: '25px', alignItems: 'center', marginLeft: 'auto', marginRight: '40px' },
  navLink: { textDecoration: 'none', fontSize: '15px', fontWeight: '500', transition: '0.3s', position: 'relative', whiteSpace: 'nowrap' },
  activeDot: { position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', width: '5px', height: '5px', backgroundColor: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 8px #3b82f6' },
  actionGroup: { display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0, minWidth: '200px', justifyContent: 'flex-end' },
  iconBtn: { color: '#94a3b8', display: 'flex', alignItems: 'center', textDecoration: 'none', transition: '0.3s' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', borderRadius: '14px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' },
  profileSection: { display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 14px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' },
  logoutBtn: { background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '10px' },
  authButtons: { display: 'flex', alignItems: 'center', gap: '18px' },
  loginLink: { color: '#e2e8f0', textDecoration: 'none', fontSize: '15px', fontWeight: '500' },
  registerBtn: { padding: '10px 24px', background: '#fff', color: '#0f172a', borderRadius: '14px', fontWeight: '700', textDecoration: 'none', transition: '0.3s' },
  menuBtn: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer' },
  mobileOverlay: { position: 'absolute', top: '80px', left: '12px', right: '12px', backgroundColor: '#0f172a', borderRadius: '24px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1100, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' },
  mobileNav: { display: 'flex', flexDirection: 'column', gap: '5px' },
  mobileNavLink: { color: '#e2e8f0', textDecoration: 'none', fontSize: '17px', fontWeight: '500', padding: '12px 10px', borderRadius: '10px' },
  registerBtnMobile: { padding: '14px', background: '#3b82f6', color: '#fff', borderRadius: '14px', fontWeight: '700', textDecoration: 'none', textAlign: 'center' },
  mobileUserInfo: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '10px' },
  mobileUserName: { display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '18px', fontWeight: '600' },
  roleBadge: { padding: '5px 10px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', borderRadius: '8px', fontSize: '11px', fontWeight: '800' },
  mobileRedDot: { width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' },
  mobileLogoutBtn: { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '10px', marginBottom: '10px' }
};

export default Header;