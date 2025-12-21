import React from 'react';
import PropTypes from 'prop-types';

export const ZoomControls = React.memo(({ onZoomIn, onZoomOut }) => {
  const isMobile = window.innerWidth <= 768;
  
  return (
    <div style={{
      position: 'absolute',
      bottom: isMobile ? '10px' : '30px',
      right: isMobile ? '10px' : '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '6px' : '10px',
      zIndex: 1000
    }}>
      <button
        onClick={onZoomIn}
        style={{
          width: isMobile ? '35px' : '50px',
          height: isMobile ? '35px' : '50px',
          borderRadius: '50%',
          border: isMobile ? '1px solid #fff' : '2px solid #fff',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fontSize: isMobile ? '18px' : '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => !isMobile && (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
        onMouseLeave={(e) => !isMobile && (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)')}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={onZoomOut}
        style={{
          width: isMobile ? '35px' : '50px',
          height: isMobile ? '35px' : '50px',
          borderRadius: '50%',
          border: isMobile ? '1px solid #fff' : '2px solid #fff',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fontSize: isMobile ? '18px' : '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => !isMobile && (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
        onMouseLeave={(e) => !isMobile && (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)')}
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  );
});

ZoomControls.displayName = 'ZoomControls';

ZoomControls.propTypes = {
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired
};
