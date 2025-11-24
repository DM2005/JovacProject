import React from 'react';

export default function FormField({ label, children }) {
  return (
    <label className="stack">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}


