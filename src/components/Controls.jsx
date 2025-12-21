import React from 'react';
import PropTypes from 'prop-types';

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '14px',
  borderRadius: '5px',
  border: '2px solid #fff',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  minWidth: '150px'
};

export const Controls = ({ 
  animations, 
  fbxAnimations, 
  activeAnimation, 
  onToggleRotate, 
  onPlayAnimation, 
  onStopAll 
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: '30px',
      right: '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 1000,
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <button
        onClick={onToggleRotate}
        style={{
          ...buttonStyle,
          backgroundColor: animations.rotate ? 'rgba(0, 200, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        aria-label={animations.rotate ? 'Stop rotation' : 'Start rotation'}
      >
        {animations.rotate ? '⏸ Stop Rotate' : '🔄 Auto Rotate'}
      </button>
      
      {fbxAnimations.length > 0 && (
        <>
          <div style={{
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: '10px',
            padding: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '3px',
            textAlign: 'center'
          }}>
            FBX Animations ({fbxAnimations.length})
          </div>
          {fbxAnimations.map((clip, index) => (
            <button
              key={`${clip.name}-${index}`}
              onClick={() => onPlayAnimation(clip.name)}
              style={{
                ...buttonStyle,
                backgroundColor: activeAnimation === clip.name ? 'rgba(0, 200, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                textAlign: 'left',
                padding: '10px 15px',
                fontSize: '13px'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              aria-label={`Play ${clip.name} animation`}
            >
              ▶ {clip.name}
            </button>
          ))}
          <button
            onClick={onStopAll}
            style={{
              ...buttonStyle,
              border: '2px solid #ff4444',
              backgroundColor: 'rgba(255, 0, 0, 0.7)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            aria-label="Stop all animations"
          >
            ⏹ Stop All
          </button>
        </>
      )}
    </div>
  );
};

Controls.propTypes = {
  animations: PropTypes.shape({
    rotate: PropTypes.bool.isRequired
  }).isRequired,
  fbxAnimations: PropTypes.array.isRequired,
  activeAnimation: PropTypes.string,
  onToggleRotate: PropTypes.func.isRequired,
  onPlayAnimation: PropTypes.func.isRequired,
  onStopAll: PropTypes.func.isRequired
};
