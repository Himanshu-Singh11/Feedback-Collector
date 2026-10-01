import React from 'react';
import logoImg from '../../assets/logo.png';

/**
 * The global app logo — exact uploaded image.
 */
function Logo({ size = 24, className = '' }) {
  return (
    <img 
      src={logoImg} 
      alt="Feedback Collector Logo" 
      width={size} 
      height={size} 
      className={className}
      style={{ objectFit: 'contain', borderRadius: '4px' }}
    />
  );
}

export default Logo;
