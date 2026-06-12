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
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Track screen size
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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
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
      ? <img src={user.avatar} alt={user.name} className="avatar" style={{ width: size, height: size }} />
      : <div className="avatar" style={{
          width: size, height: size, fontSize: size * 0.4,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700,
        }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
  );

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(15,15,26,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="container" style={{
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
            <span style={{ fontSize: 18, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text, #fff)' }}>
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
                {/* Points badge — hidden on very small screens */}
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

                {/* Profile Dropdown (desktop) */}
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
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                    </button>
                    {profileOpen && (
                      <div style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12, padding: 8, minWidth: 180,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 200,
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

                {/* Hamburger Button (mobile only) */}
                {isMobile && (
                  <div ref={mobileMenuRef} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      aria-label="Toggle menu"
                      style={{
                        background: menuOpen ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, cursor: 'pointer',
                        width: 40, height: 40,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 5,
                        transition: 'all 0.2s',
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
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                  color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.12)',
                  transition: 'all 0.2s',
                }}>Sign In</Link>
                {!isMobile && (
                  <Link to="/register" style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    color: '#fff', textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}>Join Free</Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobile && menuOpen && user && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
          zIndex: 99,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
        }} onClick={() => setMenuOpen(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              background: '#13131f',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: 16,
              animation: 'slideDown 0.2s ease',
            }}
          >
            {/* User Info Row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 12,
              background: 'rgba(99,102,241,0.08)',
              marginBottom: 12,
            }}>
              <Avatar size={44} />
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 15 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: '#fcd34d', marginTop: 2 }}>⚡ {user.points} points</div>
              </div>
            </div>

            {/* Nav Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 10, textDecoration: 'none',
                  fontSize: 15, fontWeight: 500,
                  color: isActive(link.path) ? '#a5b4fc' : 'rgba(255,255,255,0.7)',
                  background: isActive(link.path) ? 'rgba(99,102,241,0.12)' : 'transparent',
                  transition: 'all 0.15s',
                }}>
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive(link.path) && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 12 }} />

            {/* Profile Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
              {[
                { to: `/profile/${user._id}`, label: 'My Profile', icon: '👤' },
                { to: '/dashboard', label: 'Dashboard', icon: '📊' },
                ...(user.isAdmin ? [{ to: '/admin', label: 'Admin Panel', icon: '🔧' }] : []),
              ].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 10, textDecoration: 'none',
                  fontSize: 15, color: 'rgba(255,255,255,0.6)',
                  transition: 'all 0.15s',
                }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Sign Out */}
            <button onClick={handleLogout} style={{
              width: '100%', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 10,
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.15)',
              cursor: 'pointer', color: '#f87171', fontSize: 15,
            }}>
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Navbar;