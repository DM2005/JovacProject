import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import HeroSection from '../components/HeroSection.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import BookingSection from '../components/BookingSection.jsx';
import Features from '../components/Features.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <HeroSection />
      <BookingSection />
      <Features />
      <HowItWorks />
      <section className="container page">
        <div className="surface" style={{ padding: 18 }}>
          <div className="space-between">
            <div className="stack">
              <div style={{ fontWeight: 700 }}>Ready to book?</div>
              <div style={{ color: 'var(--muted)' }}>Choose a time slot and we’ll come to you.</div>
            </div>
            {user ? (
              <Link className="btn btn-primary" to="/bookings">My bookings</Link>
            ) : (
              <div className="row">
                <Link className="btn btn-ghost" to="/login">Sign in</Link>
                <Link className="btn btn-primary" to="/register">Get started</Link>
              </div>
            )}
          </div>
        </div>
      </section>
      <footer id="contact" className="container page">
        <div className="surface" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Contact Rephome</h3>
          <div className="grid grid-2">
            <div>
              <div>Call us: +91 6353768151</div>
              <div>Email: support@rephome.com</div>
              <div>Location: Mathura, Uttar Pradesh</div>
            </div>
            <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
              <a className="btn btn-primary" href="tel:+916353768151">Call Now</a>
              <a className="btn btn-ghost" href="mailto:support@rephome.com?subject=Repair%20Inquiry&body=Hi%20Rephome,%0A%0AI%20need%20help%20with%20my%20device.%20Please%20contact%20me%20back.%0A%0AThanks,">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}


