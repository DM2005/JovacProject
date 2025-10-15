import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import Toast from '../components/Toast.jsx';
import FormField from '../components/FormField.jsx';

export default function Bookings() {
  const { api } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    setLoading(true);
    try {
      const data = await api('/bookings');
      setBookings(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', kind: 'info' });
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', deviceModel: '', issue: '', description: '', preferredDate: '', preferredTime: ''
  });

  function openCreate() { setShowModal(true); }
  function closeCreate() { setShowModal(false); }
  function updateField(k, v) { setForm(s => ({ ...s, [k]: v })); }

  async function create() {
    try {
      if (!form.name || !form.phone || !form.email || !form.address || !form.deviceModel || !form.issue || !form.preferredDate || !form.preferredTime) {
        setToast({ show: true, message: 'Please fill all required fields', kind: 'error' });
        setTimeout(() => setToast({ show: false }), 2500);
        return;
      }
      await api('/bookings', { method: 'POST', body: JSON.stringify(form) });
      setToast({ show: true, message: 'Booking created', kind: 'success' });
      setTimeout(() => setToast({ show: false }), 2000);
      setShowModal(false);
      setForm({ name: '', phone: '', email: '', address: '', deviceModel: '', issue: '', description: '', preferredDate: '', preferredTime: '' });
      await load();
    } catch (e) {
      setToast({ show: true, message: e.message, kind: 'error' });
      setTimeout(() => setToast({ show: false }), 2500);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div className="container page">Loading...</div>;
  if (error) return <div className="container page" style={{ color: 'crimson' }}>{error}</div>;

  return (
    <div className="container page stack">
      <div className="space-between">
        <h2 style={{ margin: 0 }}>My Bookings</h2>
        <div className="row">
          <button className="btn btn-primary" onClick={openCreate}>Create booking</button>
        </div>
      </div>
      <div className="card">
        {bookings.length === 0 ? (
          <p style={{ padding: 16, color: 'var(--muted)' }}>No bookings yet.</p>
        ) : (
          <ul className="list">
            {bookings.map(b => (
              <li key={b._id}>
                <div className="space-between">
                  <div className="stack">
                    <strong>{b.deviceModel}</strong>
                    <span style={{ color: 'var(--muted)' }}>{b.issue} • {b.bookingId}</span>
                  </div>
                  <span className="btn btn-ghost" style={{ cursor: 'default' }}>{b.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={closeCreate}>
          <div className="modal card" onClick={(e) => e.stopPropagation()} style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Create booking</h3>
            <div className="grid grid-2">
              <FormField label="Full name">
                <input className="input" value={form.name} onChange={e => updateField('name', e.target.value)} />
              </FormField>
              <FormField label="Phone">
                <input className="input" value={form.phone} onChange={e => updateField('phone', e.target.value)} />
              </FormField>
              <FormField label="Email">
                <input className="input" value={form.email} onChange={e => updateField('email', e.target.value)} />
              </FormField>
              <FormField label="Device model">
                <input className="input" value={form.deviceModel} onChange={e => updateField('deviceModel', e.target.value)} />
              </FormField>
              <FormField label="Issue">
                <select className="input" value={form.issue} onChange={e => updateField('issue', e.target.value)}>
                  <option value="">Select issue</option>
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
              <FormField label="Preferred date">
                <input type="date" className="input" value={form.preferredDate} onChange={e => updateField('preferredDate', e.target.value)} />
              </FormField>
              <FormField label="Preferred time">
                <select className="input" value={form.preferredTime} onChange={e => updateField('preferredTime', e.target.value)}>
                  <option value="">Choose time slot</option>
                  <option value="09:00">9:00 AM - 11:00 AM</option>
                  <option value="11:00">11:00 AM - 1:00 PM</option>
                  <option value="13:00">1:00 PM - 3:00 PM</option>
                  <option value="15:00">3:00 PM - 5:00 PM</option>
                  <option value="17:00">5:00 PM - 7:00 PM</option>
                </select>
              </FormField>
              <FormField label="Address" >
                <input className="input" value={form.address} onChange={e => updateField('address', e.target.value)} />
              </FormField>
              <FormField label="Additional details">
                <input className="input" value={form.description} onChange={e => updateField('description', e.target.value)} />
              </FormField>
            </div>
            <div className="space-between" style={{ marginTop: 12 }}>
              <button className="btn btn-ghost" onClick={closeCreate}>Close</button>
              <button className="btn btn-primary" onClick={create}>Submit</button>
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} />
    </div>
  );
}


