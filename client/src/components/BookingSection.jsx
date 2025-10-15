import React, { useState } from 'react';
import FormField from './FormField.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

export default function BookingSection() {
  const { api, user } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', deviceModel: '', issue: '', preferredDate: '', preferredTime: '', address: '', description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  function updateField(k, v) { setForm(s => ({ ...s, [k]: v })); }

  async function submit() {
    try {
      setSubmitting(true);
      setMessage('');
      if (!user) {
        setMessage('Please login to schedule a repair.');
        setSubmitting(false);
        return;
      }
      const required = ['name','phone','email','deviceModel','issue','preferredDate','preferredTime','address'];
      for (const k of required) if (!form[k]) { setMessage('Please fill all required fields.'); setSubmitting(false); return; }
      await api('/bookings', { method: 'POST', body: JSON.stringify(form) });
      setMessage('Scheduled successfully!');
      setForm({ name: '', phone: '', email: '', deviceModel: '', issue: '', preferredDate: '', preferredTime: '', address: '', description: '' });
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
          <FormField label="Device Model">
            <input className="input" value={form.deviceModel} onChange={e => updateField('deviceModel', e.target.value)} />
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
        <div className="row" style={{ justifyContent: 'center', marginTop: 12 }}>
          <button className="btn btn-primary" onClick={submit} disabled={submitting}>{submitting ? 'Scheduling…' : 'Schedule Repair'}</button>
        </div>
        {message && <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 10 }}>{message}</p>}
      </div>
    </section>
  );
}


