import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', backgroundColor: 'var(--clr-bg-page)', textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--clr-danger)' }}>403</h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>
        You do not have permission to view this page.
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

export default Unauthorized;
