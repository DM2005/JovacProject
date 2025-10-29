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
      await api('/bookings', { method: 'POST', body: JSON.stringify({ ...form, estimatedPrice: estimate }) });
      setMessage('Scheduled successfully!');
      setForm({ name: '', phone: '', email: '', brandName: '', deviceModel: '', issue: '', preferredDate: '', preferredTime: '', address: '', description: '' });
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSubmitting(false);
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
      </div>
    </section>
  );
}


