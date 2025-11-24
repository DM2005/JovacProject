import React, { useState } from 'react';
import FormField from './FormField.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

export default function BookingSection() {
  const { api, user } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', brandName: '', deviceModel: '', issue: '', preferredDate: '', preferredTime: '', address: '', description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  // Hardcoded nearby shops for Mathura
  const nearbyShops = [
    {
      _id: '1',
      name: 'Cashify',
      rating: 4.8,
      reviewCount: 482,
      category: 'Mobile phone repair shop',
      address: 'Vikas Market, Mathura',
      openingHours: 'Open',
      closingHours: '9 pm',
      features: {
        inStoreShopping: true,
        inStorePickup: true,
        delivery: true
      },
      description: 'Buy, Sell & Repair in Mathura'
    },
    {
      _id: '2',
      name: 'Jaswant Telecom',
      rating: 4.4,
      reviewCount: 839,
      category: 'Mobile phone repair shop',
      address: 'Surya Nagar, Mathura',
      openingHours: 'Open',
      closingHours: '9 pm',
      yearsInBusiness: '15+ years in business',
      description: 'Mobile Repair Hub - Best iPhone mobile repair and best shop in mathura',
      features: {
        inStoreShopping: true,
        delivery: true
      }
    },
    {
      _id: '3',
      name: 'Manu Mobile',
      rating: 4.5,
      reviewCount: 120,
      category: 'Mobile phone repair shop',
      address: 'Rani ki Mandi, Mathura',
      openingHours: 'Open',
      closingHours: '9:30 pm',
      description: 'Repairing Centre - Expert mobile repair services',
      features: {
        inStoreShopping: true
      }
    },
    {
      _id: '4',
      name: 'Sharma Telecom',
      rating: 4.8,
      reviewCount: 156,
      category: 'Mobile phone repair shop',
      address: 'NH 19, near Jaigurudev, Mathura',
      openingHours: 'Open',
      closingHours: '9 pm',
      yearsInBusiness: '3+ years in business',
      description: 'Mobile Repairing & Electronics - Quality service and repairs',
      features: {
        inStoreShopping: true,
        delivery: true
      }
    },
    {
      _id: '5',
      name: 'Priya Telecom',
      rating: 4.6,
      reviewCount: 95,
      category: 'Mobile phone repair shop',
      address: 'Krishna Nagar Road, Krishna Nagar, Mathura',
      openingHours: 'Open',
      closingHours: '10 pm',
      description: 'Expert mobile repair and service center',
      features: {
        inStoreShopping: true,
        kerbsidePickup: true
      }
    }
  ];

  const brandModels = {
    'Apple': ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone SE', 'iPad Pro', 'iPad Air', 'iPad'],
    'Samsung': ['Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy Note 20', 'Galaxy A Series', 'Galaxy Tab'],
    'Xiaomi': ['Mi 14', 'Mi 13', 'Redmi Note 13', 'Redmi Note 12', 'Poco X6', 'Poco M6'],
    'OnePlus': ['OnePlus 12', 'OnePlus 11', 'OnePlus Nord', 'OnePlus 10T'],
    'Google': ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7'],
    'Oppo': ['Find X7', 'Reno 11', 'A Series'],
    'Vivo': ['V30 Pro', 'V29', 'Y Series'],
    'Realme': ['GT 6', 'C55', 'Narzo Series'],
    'Nokia': ['X30', 'G60', 'C Series'],
    'Motorola': ['Razr 40', 'Edge 40', 'G Series']
  };

  const brandMultipliers = {
    'Apple': 1.8,
    'Samsung': 1.3,
    'Google': 1.2,
    'OnePlus': 1.1,
    'Xiaomi': 1.0,
    'Oppo': 0.9,
    'Vivo': 0.9,
    'Realme': 0.85,
    'Nokia': 0.85,
    'Motorola': 0.8
  };

  const issuePrices = {
    'screen-crack': 3500,
    'battery': 1500,
    'charging': 800,
    'speaker': 1000,
    'camera': 2000,
    'water-damage': 4000,
    'software': 500,
    'other': 2000
  };

  function updateField(k, v) { setForm(s => ({ ...s, [k]: v })); }

  function calculateEstimate() {
    if (!form.brandName || !form.deviceModel || !form.issue) return null;
    
    const basePrice = issuePrices[form.issue] || issuePrices['other'];
    const brandMultiplier = brandMultipliers[form.brandName] || 1;
    const estimate = Math.round(basePrice * brandMultiplier);
    
    return estimate;
  }

  const estimate = calculateEstimate();

  async function submit() {
    try {
      setSubmitting(true);
      setMessage('');
      if (!user) {
        setMessage('Please login to schedule a repair.');
        setSubmitting(false);
        return;
      }
      const required = ['name','phone','email','brandName','deviceModel','issue','preferredDate','preferredTime','address'];
      for (const k of required) if (!form[k]) { setMessage('Please fill all required fields.'); setSubmitting(false); return; }
      const result = await api('/bookings', { method: 'POST', body: JSON.stringify({ ...form, estimatedPrice: estimate }) });
      setCreatedBookingId(result.bookingId);
      setShowOTPVerification(true);
      setMessage(result.message || 'Booking created! Please check your email for OTP.');
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyOTP() {
    try {
      setVerifying(true);
      setOtpMessage('');
      if (!otp || otp.length !== 6) {
        setOtpMessage('Please enter a valid 6-digit OTP');
        setVerifying(false);
        return;
      }
      await api('/bookings/verify-otp', { 
        method: 'POST', 
        body: JSON.stringify({ bookingId: createdBookingId, otp }) 
      });
      setOtpMessage('Booking verified successfully!');
      setShowOTPVerification(false);
      setForm({ name: '', phone: '', email: '', brandName: '', deviceModel: '', issue: '', preferredDate: '', preferredTime: '', address: '', description: '' });
      setOtp('');
      setCreatedBookingId(null);
      setTimeout(() => {
        setMessage('');
        setOtpMessage('');
      }, 3000);
    } catch (e) {
      setOtpMessage(e.message);
    } finally {
      setVerifying(false);
    }
  }

  async function resendOTP() {
    try {
      setOtpMessage('Resending OTP...');
      const result = await api('/bookings/resend-otp', { 
        method: 'POST', 
        body: JSON.stringify({ bookingId: createdBookingId }) 
      });
      setOtpMessage(result.message || 'OTP resent! Please check your email.');
      setOtp('');
    } catch (e) {
      setOtpMessage(e.message || 'Failed to resend OTP. Please try again.');
    }
  }

  return (
    <section id="booking" className="container page">
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>Book Your Repair</h2>
      <div className="card" style={{ padding: 16, position: 'relative' }}>
        <div className="grid grid-2">
          <FormField label="Full Name">
            <input className="input" value={form.name} onChange={e => updateField('name', e.target.value)} />
          </FormField>
          <FormField label="Phone Number">
            <input className="input" value={form.phone} onChange={e => updateField('phone', e.target.value)} />
          </FormField>
          <FormField label="Email Address">
            <input className="input" value={form.email} onChange={e => updateField('email', e.target.value)} />
          </FormField>
          <FormField label="Brand Name">
            <select className="input" value={form.brandName} onChange={e => {
              updateField('brandName', e.target.value);
              updateField('deviceModel', '');
            }}>
              <option value="">Select Brand</option>
              {Object.keys(brandModels).map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Device Model">
            <select className="input" value={form.deviceModel} onChange={e => updateField('deviceModel', e.target.value)} disabled={!form.brandName}>
              <option value="">Select Device Model</option>
              {form.brandName && brandModels[form.brandName]?.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Select Issue">
            <select className="input" value={form.issue} onChange={e => updateField('issue', e.target.value)}>
              <option value="">Choose an issue</option>
              <option value="screen-crack">Cracked Screen</option>
              <option value="battery">Battery Issues</option>
              <option value="charging">Charging Problems</option>
              <option value="speaker">Speaker/Audio Issues</option>
              <option value="camera">Camera Problems</option>
              <option value="water-damage">Water Damage</option>
              <option value="software">Software Issues</option>
              <option value="other">Other</option>
            </select>
          </FormField>
          <FormField label="Preferred Date">
            <input type="date" className="input" value={form.preferredDate} onChange={e => updateField('preferredDate', e.target.value)} />
          </FormField>
          <FormField label="Preferred Time">
            <select className="input" value={form.preferredTime} onChange={e => updateField('preferredTime', e.target.value)}>
              <option value="">Choose time slot</option>
              <option value="09:00">9:00 AM - 11:00 AM</option>
              <option value="11:00">11:00 AM - 1:00 PM</option>
              <option value="13:00">1:00 PM - 3:00 PM</option>
              <option value="15:00">3:00 PM - 5:00 PM</option>
              <option value="17:00">5:00 PM - 7:00 PM</option>
            </select>
          </FormField>
          <FormField label="Full Address">
            <textarea className="input" rows="3" value={form.address} onChange={e => updateField('address', e.target.value)} />
          </FormField>
          <FormField label="Additional Details (Optional)">
            <textarea className="input" rows="3" value={form.description} onChange={e => updateField('description', e.target.value)} />
          </FormField>
        </div>
        {form.address && form.address.trim().length >= 7 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: '1.2rem', color: 'var(--text)' }}>Nearby Mobile Repair Shops</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {nearbyShops.map((shop) => (
                  <div
                    key={shop._id}
                    style={{
                      padding: 16,
                      backgroundColor: 'var(--surface)',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>
                          {shop.nameHindi ? `${shop.name} (${shop.nameHindi})` : shop.name}
                        </div>
                        {shop.rating > 0 && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>⭐ {shop.rating}</span>
                            {shop.reviewCount > 0 && <span>({shop.reviewCount})</span>}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        {shop.category}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: 8 }}>
                      📍 {shop.address}
                    </div>
                    {shop.phone && (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: 8 }}>
                        📞 {shop.phone}
                      </div>
                    )}
                    {shop.openingHours && shop.closingHours && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 8 }}>
                        🕐 Open · Closes {shop.closingHours}
                      </div>
                    )}
                    {shop.features && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                        {shop.features.inStoreShopping && (
                          <span style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 4 }}>
                            In-store shopping
                          </span>
                        )}
                        {shop.features.kerbsidePickup && (
                          <span style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 4 }}>
                            Kerbside pickup
                          </span>
                        )}
                        {shop.features.delivery && (
                          <span style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 4 }}>
                            Delivery
                          </span>
                        )}
                        {shop.features.inStorePickup && (
                          <span style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 4 }}>
                            In-store pick-up
                          </span>
                        )}
                      </div>
                    )}
                    {shop.description && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 8, fontStyle: 'italic' }}>
                        "{shop.description}"
                      </div>
                    )}
                  </div>
              ))}
            </div>
          </div>
        )}
        {estimate && (
          <div style={{ 
            marginTop: 20, 
            padding: 16, 
            backgroundColor: 'var(--surface)', 
            borderRadius: 8, 
            border: '2px solid var(--primary)',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>Estimated Repair Cost</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>₹{estimate.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 }}>
              *Final cost may vary based on actual assessment
            </div>
          </div>
        )}
        <div className="row" style={{ justifyContent: 'center', marginTop: 12 }}>
          <button className="btn btn-primary" onClick={submit} disabled={submitting}>{submitting ? 'Scheduling…' : 'Schedule Repair'}</button>
        </div>
        {message && <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 10 }}>{message}</p>}
        
        {showOTPVerification && (
          <div style={{ 
            marginTop: 24, 
            padding: 20, 
            backgroundColor: 'var(--surface)', 
            borderRadius: 8, 
            border: '2px solid var(--primary)' 
          }}>
            <h3 style={{ marginBottom: 16, fontSize: '1.2rem', color: 'var(--text)' }}>Verify Your Booking</h3>
            <p style={{ marginBottom: 16, color: 'var(--muted)' }}>
              We've sent a 6-digit OTP to your email. Please enter it below to confirm your booking.
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <input
                type="text"
                className="input"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                style={{ flex: 1, textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button 
                className="btn btn-primary" 
                onClick={verifyOTP} 
                disabled={verifying || otp.length !== 6}
              >
                {verifying ? 'Verifying…' : 'Verify OTP'}
              </button>
              <button 
                className="btn" 
                onClick={resendOTP}
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                Resend OTP
              </button>
            </div>
            {otpMessage && (
              <p style={{ 
                textAlign: 'center', 
                marginTop: 12, 
                color: otpMessage.includes('successfully') ? 'green' : 'var(--muted)' 
              }}>
                {otpMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}


