import React, { useRef } from 'react';
import './CarDriveCanvas.css';

const CarControlsUI = ({
  speedKmH,
  activeZone,
  touchStateRef,
  onNavigateSection,
  onResetCar,
  onAutoDriveZone,
  camMode,
  onToggleCam,
  envTheme,
  onToggleEnv,
  isBoosting,
  isFullscreen,
  onToggleFullscreen,
  soundEnabled,
  onToggleSound,
  score,
  carTransform,
  checkpoints,
}) => {
  const touchStartPos = useRef({ x: 0, y: 0 });

  const handleTouchStartBtn = (key) => (e) => {
    e.stopPropagation();
    if (touchStateRef.current) {
      touchStateRef.current[key] = true;
    }
  };

  const handleTouchEndBtn = (key) => (e) => {
    e.stopPropagation();
    if (touchStateRef.current) {
      touchStateRef.current[key] = false;
    }
  };

  // Finger Drag Steering & Driving Gestures on Mobile Overlay
  const handleOverlayTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleOverlayTouchMove = (e) => {
    if (e.touches && e.touches.length > 0 && touchStateRef.current) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartPos.current.x;
      const dy = touch.clientY - touchStartPos.current.y;

      // Finger drag steering thresholds
      touchStateRef.current.left = dx < -15;
      touchStateRef.current.right = dx > 15;
      touchStateRef.current.forward = dy < -10;
      touchStateRef.current.backward = dy > 25;
    }
  };

  const handleOverlayTouchEnd = () => {
    if (touchStateRef.current) {
      touchStateRef.current.left = false;
      touchStateRef.current.right = false;
      touchStateRef.current.forward = false;
      touchStateRef.current.backward = false;
    }
  };

  return (
    <div
      className="car-hud-overlay"
      onTouchStart={handleOverlayTouchStart}
      onTouchMove={handleOverlayTouchMove}
      onTouchEnd={handleOverlayTouchEnd}
    >
      {/* Top Cockpit Bar */}
      <div className="car-hud-top">
        <div className="hud-badge-pill">
          <span className={`pulse-dot ${isBoosting ? 'boosting' : ''}`} />
          <span className="hud-mode-title">
            {envTheme === 'forest' ? 'FOREST GRAND PRIX' : 'CYBER GRAND PRIX'}
          </span>
        </div>

        {/* Center Pill Navigator */}
        <div className="center-nav-pills">
          <button className="nav-pill-item" onClick={() => onAutoDriveZone('about')}>
            <span>👤</span> About
          </button>
          <button className="nav-pill-item" onClick={() => onAutoDriveZone('skills')}>
            <span>⚡</span> Skills
          </button>
          <button className="nav-pill-item" onClick={() => onAutoDriveZone('projects')}>
            <span>💼</span> Projects
          </button>
          <button className="nav-pill-item" onClick={() => onAutoDriveZone('contact')}>
            <span>📧</span> Contact
          </button>
        </div>

        {/* Right Actions Bar */}
        <div className="hud-actions-group">
          <button className="glass-icon-btn" onClick={onToggleSound} title="Engine Sound SFX">
            {soundEnabled ? '🔊 SFX' : '🔇 MUTE'}
          </button>
          <button className="glass-icon-btn" onClick={onToggleEnv} title="Switch Environment">
            {envTheme === 'forest' ? '🌲' : '🌌'}
          </button>
          <button className="glass-icon-btn" onClick={onToggleCam} title="Toggle Camera Angle">
            📷 <span className="cam-mode-text">{camMode}</span>
          </button>
          <button className="glass-icon-btn" onClick={onResetCar} title="Reset Position (R)">
            🔄
          </button>
          <button className="glass-icon-btn primary" onClick={onToggleFullscreen} title="Fullscreen Mode">
            {isFullscreen ? '✕ EXIT' : '⛶ FULLSCREEN'}
          </button>
        </div>
      </div>

      {/* Speedometer & Score Counter */}
      <div className="hud-left-stack">
        <div className={`cockpit-speedometer ${isBoosting ? 'nitro-active' : ''}`}>
          <div className="speed-display">
            <span className="speed-number">{speedKmH}</span>
            <span className="speed-unit-text">KM/H</span>
          </div>
          {isBoosting && <div className="nitro-badge">⚡ NITRO BOOST</div>}
          <div className="speed-line-meter">
            <div
              className="speed-line-fill"
              style={{ width: `${Math.min(100, (speedKmH / 220) * 100)}%` }}
            />
          </div>
        </div>

        <div className="score-hud-pill">
          <span className="score-icon">🏆</span>
          <span className="score-val">{score.toString().padStart(6, '0')} PTS</span>
        </div>
      </div>

      {/* Gate Arrival Interactive Glass Modal */}
      {activeZone && (
        <div className="zone-arrival-card">
          <div className="zone-card-icon">🏁</div>
          <div className="zone-card-body">
            <span className="zone-tag">GATE ARRIVAL</span>
            <h3 className="zone-card-title">{activeZone.title}</h3>
            <p className="zone-card-sub">{activeZone.subtitle}</p>
          </div>
          <button
            className="zone-card-btn"
            onClick={() => onNavigateSection && onNavigateSection(activeZone.id)}
          >
            Enter Section ➔
          </button>
        </div>
      )}

      {/* Real-Time Mini-Map Radar */}
      <div className="minimap-radar">
        <div className="radar-grid-bg" />
        {checkpoints && checkpoints.map((cp) => {
          const mapX = 50 + (cp.pos.x / 50) * 40;
          const mapZ = 50 + (cp.pos.z / 50) * 40;
          return (
            <div
              key={cp.id}
              className="radar-blip-gate"
              style={{ left: `${mapX}%`, top: `${mapZ}%`, backgroundColor: `#${cp.color.toString(16).padStart(6, '0')}` }}
              title={cp.title}
            />
          );
        })}
        <div
          className="radar-car-arrow"
          style={{
            left: `${50 + (carTransform.x / 50) * 40}%`,
            top: `${50 + (carTransform.z / 50) * 40}%`,
            transform: `translate(-50%, -50%) rotate(${carTransform.rot}rad)`
          }}
        />
        <span className="radar-label">RADAR MAP</span>
      </div>

      {/* Bottom Floating Hints */}
      <div className="bottom-hud-bar">
        <div className="controls-capsule">
          <span className="ctrl-badge">W A S D</span>
          <span className="ctrl-desc">Drive</span>
          <span className="ctrl-divider">•</span>
          <span className="ctrl-badge">TOUCH / DRAG</span>
          <span className="ctrl-desc">Mobile Steering</span>
        </div>
      </div>

      {/* Mobile Touch Pad Buttons */}
      <div className="mobile-touch-controls">
        <div className="touch-steering">
          <button
            className="touch-btn steer-left"
            onTouchStart={handleTouchStartBtn('left')}
            onTouchEnd={handleTouchEndBtn('left')}
            onMouseDown={() => (touchStateRef.current.left = true)}
            onMouseUp={() => (touchStateRef.current.left = false)}
          >
            ◄
          </button>
          <button
            className="touch-btn steer-right"
            onTouchStart={handleTouchStartBtn('right')}
            onTouchEnd={handleTouchEndBtn('right')}
            onMouseDown={() => (touchStateRef.current.right = true)}
            onMouseUp={() => (touchStateRef.current.right = false)}
          >
            ►
          </button>
        </div>

        <div className="touch-pedals">
          <button
            className="touch-btn pedal-boost"
            onTouchStart={handleTouchStartBtn('boost')}
            onTouchEnd={handleTouchEndBtn('boost')}
            onMouseDown={() => (touchStateRef.current.boost = true)}
            onMouseUp={() => (touchStateRef.current.boost = false)}
          >
            ⚡
          </button>
          <button
            className="touch-btn pedal-reverse"
            onTouchStart={handleTouchStartBtn('backward')}
            onTouchEnd={handleTouchEndBtn('backward')}
            onMouseDown={() => (touchStateRef.current.backward = true)}
            onMouseUp={() => (touchStateRef.current.backward = false)}
          >
            ▼
          </button>
          <button
            className="touch-btn pedal-accel"
            onTouchStart={handleTouchStartBtn('forward')}
            onTouchEnd={handleTouchEndBtn('forward')}
            onMouseDown={() => (touchStateRef.current.forward = true)}
            onMouseUp={() => (touchStateRef.current.forward = false)}
          >
            ▲
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarControlsUI;
