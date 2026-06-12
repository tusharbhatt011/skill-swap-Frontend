import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  // phase 0 = mounting, 1 = logo in, 2 = text in, 3 = tagline in, 4 = fading out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),   // logo animates in
      setTimeout(() => setPhase(2), 600),   // brand name types in
      setTimeout(() => setPhase(3), 1100),  // tagline fades in
      setTimeout(() => setPhase(4), 2400),  // whole screen fades out
      setTimeout(() => onComplete(), 2900), // unmount
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#080812',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 4 ? 0 : 1,
      transition: 'opacity 0.5s ease',
      userSelect: 'none',
    }}>

      {/* Ambient glow blobs */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
        top: '20%', left: '50%', transform: 'translateX(-50%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        bottom: '25%', left: '30%',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 0,
        transform: phase >= 1 ? 'translateY(0)' : 'translateY(30px)',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* Logo icon with orbit ring */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          {/* Orbit ring */}
          <div style={{
            position: 'absolute', inset: -14,
            borderRadius: '50%',
            border: '1.5px solid rgba(99,102,241,0.25)',
            animation: phase >= 1 ? 'orbit 3s linear infinite' : 'none',
          }} />
          {/* Orbit dot */}
          <div style={{
            position: 'absolute', inset: -14,
            borderRadius: '50%',
            animation: phase >= 1 ? 'orbit 3s linear infinite' : 'none',
          }}>
            <div style={{
              position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
              width: 8, height: 8, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              boxShadow: '0 0 12px rgba(99,102,241,0.8)',
            }} />
          </div>

          {/* Main logo box */}
          <div style={{
            width: 80, height: 80, borderRadius: 22,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 40%, #06b6d4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38,
            boxShadow: '0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2)',
            animation: phase >= 1 ? 'pulse 2.5s ease-in-out infinite' : 'none',
          }}>
            🔄
          </div>
        </div>

        {/* Brand name */}
        <div style={{
          fontSize: 38, fontWeight: 800,
          fontFamily: 'Space Grotesk, system-ui, sans-serif',
          letterSpacing: '-1px',
          lineHeight: 1,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.5s ease',
          marginBottom: 10,
        }}>
          <span style={{ color: '#fff' }}>Skill</span>
          <span style={{
            background: 'linear-gradient(135deg, #818cf8, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Swap</span>
          <span style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: 22, fontWeight: 500,
            letterSpacing: 0,
            marginLeft: 6,
          }}>Hub</span>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.38)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          fontWeight: 500, margin: 0,
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          Trade Skills · Grow Together
        </p>
      </div>

      {/* Loading bar */}
      <div style={{
        position: 'absolute', bottom: 80,
        width: 120, height: 2,
        background: 'rgba(255,255,255,0.07)',
        borderRadius: 2,
        overflow: 'hidden',
        opacity: phase >= 2 ? 1 : 0,
        transition: 'opacity 0.4s',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
          borderRadius: 2,
          animation: phase >= 2 ? 'loadbar 1.8s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
        }} />
      </div>

      {/* Built by credit */}
      <div style={{
        position: 'absolute', bottom: 32,
        display: 'flex', alignItems: 'center', gap: 8,
        opacity: phase >= 3 ? 1 : 0,
        transition: 'opacity 0.6s ease 0.2s',
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px',
        }}>TB</div>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>
          crafted by{' '}
          <span style={{
            background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
          }}>Tushar Bhatt</span>
        </span>
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2); }
          50%       { box-shadow: 0 0 60px rgba(99,102,241,0.7), 0 0 100px rgba(99,102,241,0.3); }
        }
        @keyframes loadbar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;