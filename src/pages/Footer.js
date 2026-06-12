import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(10,10,20,0.95)',
      padding: '40px 24px 28px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'flex-start',
          gap: 32, marginBottom: 36,
        }}>

          {/* Brand */}
          <div style={{ minWidth: 200 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17,
              }}>🔄</div>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Skill<span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Swap</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, maxWidth: 220 }}>
              Trade skills, grow together. Connect with people who teach what you want to learn.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 12 }}>Platform</p>
              {[
                { to: '/marketplace', label: 'Explore Skills' },
                { to: '/matches', label: 'Matches' },
                { to: '/leaderboard', label: 'Leaderboard' },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)',
                  textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                >{l.label}</Link>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 12 }}>Account</p>
              {[
                { to: '/login', label: 'Sign In' },
                { to: '/register', label: 'Join Free' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)',
                  textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                >{l.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

        {/* Bottom row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center',
          gap: 12,
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', margin: 0 }}>
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>

          {/* Builder credit — the signature element */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 12px 5px 6px',
            borderRadius: 20,
            border: '1px solid rgba(99,102,241,0.2)',
            background: 'rgba(99,102,241,0.06)',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px',
              flexShrink: 0,
            }}>TB</div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
              Built by <span style={{
                background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontWeight: 600,
              }}>Tushar Bhatt</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;