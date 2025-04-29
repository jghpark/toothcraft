// src/pages/SkillTreePage.js

import React, { useState, useEffect } from 'react';
import { useAuthState }              from 'react-firebase-hooks/auth';
import { auth, db }                  from '../firebase';
import {
  doc, getDoc, setDoc,
  updateDoc, arrayUnion, arrayRemove
} from 'firebase/firestore';

export default function SkillTreePage() {
  // ─── Auth & Firestore state ────────────────────────────────────────────────
  const [user, loadingUser]     = useAuthState(auth);
  const [unlocked, setUnlocked] = useState([]); // holds IDs like "surgery", "surgery-lvl1", ...
  const [loadingData, setLoading] = useState(true);
  const progRef = user ? doc(db, 'users', user.uid) : null;

  // Reset on each mount so tree is fresh
  useEffect(() => {
    if (!user) return;
    setDoc(progRef, { unlocked: [] }).then(() => {
      setUnlocked([]);
      setLoading(false);
    });
  }, [user]);

  // Toggle any node and cascade‐close its descendants
  const toggle = async id => {
    if (!user) return;
    const isOpen = unlocked.includes(id);
    let newUnlocked = unlocked.filter(x => {
      if (x === id) return false;
      // closing a category: remove "-lvl*" children
      if (!id.includes('-lvl') && x.startsWith(id + '-lvl')) return false;
      // closing a level: remove deeper levels
      if (id.includes('-lvl') && x.startsWith(id + '-')) return false;
      return true;
    });
    if (!isOpen) newUnlocked = [...newUnlocked, id];
    await updateDoc(progRef, { unlocked: newUnlocked });
    setUnlocked(newUnlocked);
  };

  if (loadingUser || loadingData) {
    return <div style={{ padding: 20 }}>Loading…</div>;
  }

  // ─── Categories ──────────────────────────────────────────────────────────────
  const categories = [
    { id: 'surgery', label: 'Oral Surgery',          x: 100,    baseY: 150 },
    { id: 'ortho',   label: 'Orthodontics',          x: '50%',  baseY: 150 },
    { id: 'endo',    label: 'Endodontics',           x: 400,    baseY: 150 },
    { id: 'restor',  label: 'Restorative Dentistry', x: 100,    baseY: 300 },
    { id: 'implant', label: 'Implant Dentistry',     x: '50%',  baseY: 300 },
    { id: 'radio',   label: 'Radiology',             x: 400,    baseY: 300 },
    { id: 'tmd',     label: 'TMD / Orofacial Pain',  x: '50%',  baseY: 450 },
  ];

  const levelSpacing = 100; // px between levels
  let shift = 0;

  // ─── Compute positions with shifting ────────────────────────────────────────
  const positioned = categories.map(cat => {
    const openCount = ['-lvl1','-lvl2','-lvl3']
      .filter(suf => unlocked.includes(cat.id + suf)).length;
    const y = cat.baseY + shift;
    shift += openCount * levelSpacing;
    return { ...cat, y };
  });

  // ─── Build boxes & edges ────────────────────────────────────────────────────
  const boxes = [], edges = [];

  positioned.forEach(cat => {
    const { id, label, x, y } = cat;
    const open = unlocked.includes(id);

    // Category
    boxes.push({ id, label, x, y, open });

    // Level 1
    if (open) {
      boxes.push({
        id: `${id}-lvl1`,
        label: 'Level 1',
        x, y: y + levelSpacing,
        open: unlocked.includes(`${id}-lvl1`)
      });
      edges.push({ from: id, to: `${id}-lvl1` });
    }
    // Level 2
    if (unlocked.includes(`${id}-lvl1`)) {
      boxes.push({
        id: `${id}-lvl2`,
        label: 'Level 2',
        x, y: y + 2 * levelSpacing,
        open: unlocked.includes(`${id}-lvl2`)
      });
      edges.push({ from: `${id}-lvl1`, to: `${id}-lvl2` });
    }
    // Level 3
    if (unlocked.includes(`${id}-lvl2`)) {
      boxes.push({
        id: `${id}-lvl3`,
        label: 'Level 3',
        x, y: y + 3 * levelSpacing,
        open: unlocked.includes(`${id}-lvl3`)
      });
      edges.push({ from: `${id}-lvl2`, to: `${id}-lvl3` });
    }
  });

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'relative',
      width: '100vw', height: '100vh',
      background: '#f0f0f0',
      overflow: 'hidden'
    }}>
      {boxes.map(b => (
        <Box key={b.id} node={b} onClick={() => toggle(b.id)} />
      ))}
      {edges.map((e,i) => (
        <Edge key={i} from={e.from} to={e.to} />
      ))}
    </div>
  );
}

// ─── Box with smooth transitions ──────────────────────────────────────────────
function Box({ node, onClick }) {
  const left = typeof node.x === 'number'
    ? node.x
    : `calc(${node.x} - 75px)`; // half of 150px

  return (
    <div
      data-id={node.id}
      onClick={onClick}
      style={{
        position: 'absolute',
        left,
        top: node.y,
        width: 150,
        height: 40,
        border: `2px solid ${node.open ? 'green' : '#333'}`,
        background: node.open ? '#e0ffe0' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',

        // ✨ transitions:
        transition: 'top 0.3s ease, background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      {node.label}
    </div>
  );
}

// ─── Edge that fades in/out ✨ ────────────────────────────────────────────────
function Edge({ from, to }) {
  const a = document.querySelector(`[data-id="${from}"]`)?.getBoundingClientRect();
  const b = document.querySelector(`[data-id="${to}"]`)?.getBoundingClientRect();
  if (!a || !b) return null;

  const x1 = a.left + a.width/2, y1 = a.top + a.height;
  const x2 = b.left + b.width/2, y2 = b.top;

  return (
    <svg
      style={{
        position: 'absolute',
        width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
    >
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#333" strokeWidth={2}

        // ✨ simple fade-in:
        style={{ transition: 'opacity 0.3s ease', opacity: 1 }}  
      />
    </svg>
  );
}
