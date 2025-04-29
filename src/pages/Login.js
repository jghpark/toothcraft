import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/skilltree');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: 'auto' }}>
      <h2>Login to Toothcraft</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 8 }}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8 }}
          required
        />
        <br /><br />
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          Login
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      <p style={{ marginTop: 20 }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}