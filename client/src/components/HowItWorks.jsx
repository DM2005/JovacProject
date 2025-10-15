import React from 'react';

export default function HowItWorks() {
  const steps = [
    { n: 1, t: 'Book Online', d: 'Fill out our simple form with your device details and preferred time slot.' },
    { n: 2, t: 'Technician Arrives', d: 'Our certified technician arrives at your location with all necessary tools and parts.' },
    { n: 3, t: 'Quick Diagnosis', d: 'Free diagnosis and transparent pricing discussion before starting any repair work.' },
    { n: 4, t: 'Professional Repair', d: 'Your device gets repaired on-spot using genuine parts and professional techniques.' },
    { n: 5, t: 'Quality Check & Payment', d: 'Complete testing, quality assurance, and secure payment. Your phone is ready!' }
  ];

  return (
    <section id="how-it-works" className="container page">
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>How It Works</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
        {steps.map((s) => (
          <div key={s.n} className="card" style={{ padding: 18, textAlign: 'center' }}>
            <div style={{
              width: 46, height: 46, borderRadius: 999,
              background: 'linear-gradient(180deg, var(--brand), var(--brand-2))',
              display: 'grid', placeItems: 'center', margin: '0 auto 10px', fontWeight: 800
            }}>{s.n}</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{s.t}</div>
            <div style={{ color: 'var(--muted)' }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


