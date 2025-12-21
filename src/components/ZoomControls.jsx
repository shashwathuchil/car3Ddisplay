import React from 'react';
import PropTypes from 'prop-types';

const buttonStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  border: '2px solid #fff',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  fontSize: '24px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease'
};

export const ZoomControls = ({ onZoomIn, onZoomOut }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '30px',
      right: '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 1000
    }}>
      <button
        onClick={onZoomIn}
        style={buttonStyle}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={onZoomOut}
        style={buttonStyle}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  );
};

ZoomControls.propTypes = {
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired
};
