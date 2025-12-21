import React from 'react';
import PropTypes from 'prop-types';

export const LoadingOverlay = React.memo(({ loading, error }) => {
  if (!loading && !error) return null;

  const isMobile = window.innerWidth <= 768;

  return (
    <>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontSize: isMobile ? '16px' : '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: isMobile ? '15px 25px' : '20px 40px',
          borderRadius: '10px',
          zIndex: 1000
        }}
        role="status"
        aria-live="polite"
        >
          Loading 3D Model...
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#ff4444',
          fontSize: isMobile ? '14px' : '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: isMobile ? '15px 25px' : '20px 40px',
          borderRadius: '10px',
          zIndex: 1000,
          maxWidth: isMobile ? '90%' : '80%',
          textAlign: 'center'
        }}
        role="alert"
        aria-live="assertive"
        >
          {error}
        </div>
      )}
    </>
  );
});

LoadingOverlay.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
};
