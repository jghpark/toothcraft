// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export default function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  // While Firebase is checking auth state
  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  // If user is not logged in, redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the protected component
  return children;
}
