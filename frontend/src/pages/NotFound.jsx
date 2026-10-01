import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', backgroundColor: 'var(--clr-bg-page)', textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--clr-text-primary)' }}>404</h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>
        Oops! The page you are looking for does not exist.
      </p>
      <Link 
        to="/" 
        style={{
          background: 'var(--clr-accent)', color: 'white', padding: '0.75rem 1.5rem', 
          borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 500
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
