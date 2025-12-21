import React from 'react';
import PropTypes from 'prop-types';
import { TEXTURES } from '../constants';

export const TextureSelector = ({ selectedTexture, onTextureChange }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '30px',
      left: '30px',
      zIndex: 1000
    }}>
      <label style={{
        color: '#fff',
        fontSize: '14px',
        marginRight: '10px',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}>
        Texture:
      </label>
      <select
        value={selectedTexture}
        onChange={(e) => onTextureChange(e.target.value)}
        style={{
          padding: '8px 12px',
          fontSize: '14px',
          borderRadius: '5px',
          border: '2px solid #fff',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '150px'
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
