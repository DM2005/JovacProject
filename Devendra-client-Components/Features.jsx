import React from 'react';

const data = [
  { t: 'Doorstep Service', d: 'No need to visit service centers. Our certified technicians come to your location at your convenience.' },
  { t: 'Same Day Repair', d: 'Most repairs completed within 30-60 minutes. Get your phone back faster than traditional repair shops.' },
  { t: 'Certified Technicians', d: 'All our technicians are trained and certified. Your device is in safe hands with our skilled professionals.' },
  { t: 'Transparent Pricing', d: 'No hidden charges. Get upfront pricing with detailed cost breakdown before any repair work begins.' },
  { t: 'Real-time Tracking', d: 'Track your technician in real-time. Know exactly when they\'ll arrive at your location.' },
  { t: 'Warranty Included', d: 'All repairs come with a 90-day warranty. Peace of mind guaranteed with every service.' }
];

export default function Features() {
  return (
    <section id="services" className="container page">
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>Why Choose Rephome?</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {data.map((f, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>{f.t}</h3>
            <p style={{ color: 'var(--muted)' }}>{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


