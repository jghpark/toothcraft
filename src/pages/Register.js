import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/skilltree');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: 'auto' }}>
      <h2>Create Your Toothcraft Account</h2>
      <form onSubmit={handleRegister}>
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
          placeholder="Password (6+ characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8 }}
          required
        />
        <br /><br />
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          Register
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      <p style={{ marginTop: 20 }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
