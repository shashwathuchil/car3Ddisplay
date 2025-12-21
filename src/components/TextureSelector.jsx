import React from 'react';
import PropTypes from 'prop-types';
import { TEXTURES } from '../constants';

export const TextureSelector = ({ selectedTexture, onTextureChange }) => {
  const isMobile = window.innerWidth <= 768;
  
  return (
    <div style={{
      position: 'absolute',
      top: isMobile ? 'auto' : '30px',
      bottom: isMobile ? '70px' : 'auto',
      left: isMobile ? '10px' : '30px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: isMobile ? '5px' : '0'
    }}>
      <label style={{
        color: '#fff',
        fontSize: isMobile ? '11px' : '14px',
        marginRight: '8px',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        display: isMobile ? 'none' : 'block'
      }}>
        Texture:
      </label>
      <select
        value={selectedTexture}
        onChange={(e) => onTextureChange(e.target.value)}
        style={{
          padding: isMobile ? '5px 8px' : '8px 12px',
          fontSize: isMobile ? '11px' : '14px',
          borderRadius: '5px',
          border: isMobile ? '1px solid #fff' : '2px solid #fff',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          cursor: 'pointer',
          outline: 'none',
          minWidth: isMobile ? '100px' : '150px'
        }}
        aria-label="Select texture"
      >
        {TEXTURES.map((texture) => (
          <option key={texture.file} value={texture.file}>
            {texture.name}
          </option>
        ))}
      </select>
    </div>
  );
};

TextureSelector.propTypes = {
  selectedTexture: PropTypes.string.isRequired,
  onTextureChange: PropTypes.func.isRequired
};
