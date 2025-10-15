import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="stack" style={{ gap: 18 }}>
          <h1 style={{ fontSize: 44, margin: 0 }}>Phone Repair at Your Doorstep</h1>
          <p style={{ margin: 0, color: 'var(--muted)', maxWidth: 720 }}>
            Professional mobile repair services delivered to your home. Fast, reliable, and convenient — your phone fixed while you relax!
          </p>
          <div className="row" style={{ gap: 12 }}>
            <Link className="btn btn-primary" to="/bookings">Book Now</Link>
            <a className="btn btn-ghost" href="#how-it-works">How It Works</a>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', marginTop: 12 }}>
            <Stat value="10K+" label="Happy Customers" />
            <Stat value="500+" label="Expert Technicians" />
            <Stat value="4.9★" label="Average Rating" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="surface" style={{ padding: 18, textAlign: 'center', background: '#ffffff' }}>
      <div style={{ fontSize: 34, fontWeight: 900, color: '#111827' }}>{value}</div>
      <div style={{ color: '#374151', fontWeight: 700 }}>{label}</div>
    </div>
  );
}