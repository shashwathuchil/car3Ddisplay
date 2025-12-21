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

export const Controls = React.memo(({ 
  animations, 
  fbxAnimations, 
  activeAnimation, 
  onToggleRotate, 
  onPlayAnimation, 
  onStopAll 
}) => {
  const isMobile = window.innerWidth <= 768;
  
  return (
    <div style={{
      position: 'absolute',
      top: isMobile ? '10px' : '30px',
      right: isMobile ? '10px' : '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '6px' : '10px',
      zIndex: 1000,
      maxHeight: isMobile ? '40vh' : '80vh',
      overflowY: 'auto',
      backgroundColor: isMobile ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
      padding: isMobile ? '5px' : '0',
      borderRadius: isMobile ? '8px' : '0'
    }}>
      <button
        onClick={onToggleRotate}
        style={{
          padding: isMobile ? '6px 10px' : '10px 20px',
          fontSize: isMobile ? '11px' : '14px',
          borderRadius: '5px',
          border: isMobile ? '1px solid #fff' : '2px solid #fff',
          backgroundColor: animations.rotate ? 'rgba(0, 200, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          minWidth: isMobile ? '100px' : '150px'
        }}
        onMouseEnter={(e) => !isMobile && (e.target.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => !isMobile && (e.target.style.transform = 'scale(1)')}
        aria-label={animations.rotate ? 'Stop rotation' : 'Start auto rotation'}
      >
        {animations.rotate ? '⏸ Stop Rotate' : '🔄 Auto Rotate'}
      </button>
      
      {fbxAnimations.length > 0 && (
        <>
          <div style={{
            color: '#fff',
            fontSize: isMobile ? '9px' : '12px',
            fontWeight: 'bold',
            marginTop: isMobile ? '3px' : '10px',
            padding: isMobile ? '2px' : '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '3px',
            textAlign: 'center'
          }}>
            FBX Animations ({fbxAnimations.length})
          </div>
          {fbxAnimations.map((clip, index) => (
            <button
              key={index}
              onClick={() => onPlayAnimation(clip.name)}
              style={{
                padding: isMobile ? '5px 8px' : '10px 15px',
                fontSize: isMobile ? '10px' : '13px',
                borderRadius: '5px',
                border: isMobile ? '1px solid #fff' : '2px solid #fff',
                backgroundColor: activeAnimation === clip.name ? 'rgba(0, 200, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                minWidth: isMobile ? '100px' : '150px',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => !isMobile && (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => !isMobile && (e.target.style.transform = 'scale(1)')}
              aria-label={`Play ${clip.name} animation`}
            >
              ▶ {clip.name}
            </button>
          ))}
          <button
            onClick={onStopAll}
            style={{
              padding: isMobile ? '6px 10px' : '10px 20px',
              fontSize: isMobile ? '11px' : '14px',
              borderRadius: '5px',
              border: isMobile ? '1px solid #ff4444' : '2px solid #ff4444',
              backgroundColor: 'rgba(255, 0, 0, 0.8)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              minWidth: isMobile ? '100px' : '150px'
            }}
            onMouseEnter={(e) => !isMobile && (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => !isMobile && (e.target.style.transform = 'scale(1)')}
            aria-label="Stop all animations"
          >
            ⏹ Stop All
          </button>
        </>
      )}
    </div>
  );
});

Controls.displayName = 'Controls';

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
