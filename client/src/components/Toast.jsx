import React from 'react';

export default function Toast({ show, message, kind = 'info' }) {
  const bg = kind === 'success' ? 'linear-gradient(180deg,#22c55e,#1aa34a)' : kind === 'error' ? 'linear-gradient(180deg,#ff6b6b,#e45656)' : 'linear-gradient(180deg,#6c9eff,#4f7fe7)';
  return (
    <div className={`toast ${show ? 'show' : ''}`} style={{ background: bg }}>
      {message}
    </div>
  );
}


