import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>Welcome to Toothcraft</h1>
      <p>Plan your CE journey with an interactive dental skill tree.</p>
      <div style={{ marginTop: 20 }}>
        <Link to="/login">
          <button style={{ marginRight: 10 }}>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}
