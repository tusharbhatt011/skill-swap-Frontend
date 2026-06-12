import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/marketplace', label: 'Explore', icon: '🔍' },
    { path: '/matches', label: 'Matches', icon: '🤝' },
    { path: '/messages', label: 'Messages', icon: '💬' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  const Avatar = ({ size = 36 }) => (
    user?.avatar
      ? <img src={user.avatar} alt={user.name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />
      : <div style={{
          width: size, height: size, fontSize: size * 0.4,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, flexShrink: 0,
        }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
  );

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(15,15,26,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          height: 64, gap: 16,
          padding: '0 16px',
          maxWidth: 1200, margin: '0 auto',
        }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🔄</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
              Skill<span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Swap</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {user && !isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 16 }}>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} style={{
                  textDecoration: 'none', padding: '6px 14px', borderRadius: 8,
                  fontSize: 14, fontWeight: 500,
                  color: isActive(link.path) ? '#a5b4fc' : 'rgba(255,255,255,0.55)',
                  background: isActive(link.path) ? 'rgba(99,102,241,0.12)' : 'transparent',
                  transition: 'all 0.2s',
                }}>{link.label}</Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <>
                {/* Points (desktop only) */}
                {!isMobile && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', borderRadius: 20,
                    background: 'rgba(245,158,11,0.12)',
                    fontSize: 13, fontWeight: 600, color: '#fcd34d',
                  }}>
                    ⚡ {user.points}
                  </div>
                )}

                {/* Desktop Profile Dropdown */}
                {!isMobile && (
                  <div ref={profileRef} style={{ position: 'relative' }}>
                    <button onClick={() => setProfileOpen(!profileOpen)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <Avatar />
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>
                        {user.name.split(' ')[0]}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, transition: 'transform 0.2s', display: 'inline-block', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                    </button>
                    {profileOpen && (
                      <div style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12, padding: 8, minWidth: 180,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 300,
                      }}>
                        {[
                          { to: `/profile/${user._id}`, label: '👤 My Profile' },
                          { to: '/dashboard', label: '📊 Dashboard' },
                          ...(user.isAdmin ? [{ to: '/admin', label: '🔧 Admin' }] : []),
                        ].map(item => (
                          <Link key={item.to} to={item.to} onClick={() => setProfileOpen(false)} style={{
                            display: 'block', padding: '10px 14px', borderRadius: 8,
                            color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                            fontSize: 14, transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                          >{item.label}</Link>
                        ))}
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 0' }} />
                        <button onClick={handleLogout} style={{
                          width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 8,
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#f87171', fontSize: 14,
                        }}>🚪 Sign Out</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile Hamburger */}
                {isMobile && (
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    style={{
                      background: menuOpen ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10, cursor: 'pointer',
                      width: 42, height: 42,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 5,
                      transition: 'all 0.2s',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <span style={{
                      display: 'block', width: 18, height: 2,
                      background: menuOpen ? '#a5b4fc' : 'rgba(255,255,255,0.8)',
                      borderRadius: 2, transition: 'all 0.25s',
                      transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                    }} />
                    <span style={{
                      display: 'block', width: 18, height: 2,
                      background: menuOpen ? '#a5b4fc' : 'rgba(255,255,255,0.8)',
                      borderRadius: 2, transition: 'all 0.25s',
                      opacity: menuOpen ? 0 : 1,
                    }} />
                    <span style={{
                      display: 'block', width: 18, height: 2,
                      background: menuOpen ? '#a5b4fc' : 'rgba(255,255,255,0.8)',
                      borderRadius: 2, transition: 'all 0.25s',
                      transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                    }} />
                  </button>
                )}
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                  color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}>Sign In</Link>
                {!isMobile && (
                  <Link to="/register" style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    color: '#fff', textDecoration: 'none',
                  }}>Join Free</Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Full-Screen Overlay */}
      {isMobile && user && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: menuOpen ? 150 : -1,
              opacity: menuOpen ? 1 : 0,
              transition: 'opacity 0.25s',
              pointerEvents: menuOpen ? 'all' : 'none',
            }}
          />

          {/* Drawer Panel */}
          <div style={{
            position: 'fixed',
            top: 0, right: 0,
            width: '80%', maxWidth: 320,
            height: '100vh',
            background: '#0f0f1a',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            zIndex: 300,
            transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}>

            {/* Drawer Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                }}>🔄</div>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Skill<span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Swap</span>
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none',
                  borderRadius: 8, width: 34, height: 34,
                  color: 'rgba(255,255,255,0.6)', fontSize: 18,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >✕</button>
            </div>

            {/* User Info */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              margin: '16px 16px 8px',
              padding: '14px 16px', borderRadius: 12,
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.15)',
            }}>
              <Avatar size={44} />
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 15 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: '#fcd34d', marginTop: 2 }}>⚡ {user.points} points</div>
              </div>
            </div>

            {/* Nav Links */}
            <div style={{ padding: '8px 12px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', padding: '8px 8px 4px' }}>Navigate</p>
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 12px', borderRadius: 10, textDecoration: 'none',
                    fontSize: 15, fontWeight: 500,
                    color: isActive(link.path) ? '#a5b4fc' : 'rgba(255,255,255,0.75)',
                    background: isActive(link.path) ? 'rgba(99,102,241,0.12)' : 'transparent',
                    marginBottom: 2,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive(link.path) && (
                    <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                  )}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 16px' }} />

            {/* Profile Links */}
            <div style={{ padding: '8px 12px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', padding: '8px 8px 4px' }}>Account</p>
              {[
                { to: `/profile/${user._id}`, label: 'My Profile', icon: '👤' },
                { to: '/dashboard', label: 'Dashboard', icon: '📊' },
                ...(user.isAdmin ? [{ to: '/admin', label: 'Admin Panel', icon: '🔧' }] : []),
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 12px', borderRadius: 10, textDecoration: 'none',
                    fontSize: 15, color: 'rgba(255,255,255,0.65)',
                    marginBottom: 2,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Sign Out — pinned at bottom */}
            <div style={{ marginTop: 'auto', padding: '12px 16px 32px' }}>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 12,
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  cursor: 'pointer', color: '#f87171', fontSize: 15, fontWeight: 500,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default Navbar;