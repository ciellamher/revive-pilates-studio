import { useEffect, useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { apiFetch } from '../../api/base';
import { imageFileToDataUrl } from '../../api/image';

const inputClass = 'w-full border border-brand-sand/50 rounded-lg px-4 py-2 focus:outline-none focus:border-brand-brown';

// One QR code: preview with a remove button, or a box to pick an image.
function QrField({ id, label, value, onChange }) {
  const [error, setError] = useState('');
  const pick = async (file) => {
    if (!file) return;
    setError('');
    try {
      // QR codes need sharp edges, so keep them larger and at high quality.
      onChange(await imageFileToDataUrl(file, { maxSide: 900, quality: 0.92 }));
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <p className="block text-sm font-bold text-brand-dark mb-2">{label}</p>
      {value ? (
        <div className="flex items-center gap-4 border border-brand-sand/50 rounded-xl p-3">
          <img src={value} alt={label} className="w-24 h-24 object-contain rounded-lg border border-brand-sand/50 bg-white" />
          <p className="flex-1 text-sm text-brand-dark/70">Shown to clients at checkout.</p>
          <button type="button" onClick={() => onChange('')} aria-label={`Remove ${label}`} className="p-2 rounded-lg text-brand-dark/60 hover:bg-black/5 hover:text-brand-dark transition-colors">
            <X size={18} />
          </button>
        </div>
      ) : (
        <label htmlFor={id} className="border-2 border-dashed border-brand-sand/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-black/5 focus-within:border-brand-brown transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-brand-brown/10 text-brand-brown flex items-center justify-center group-hover:scale-110 transition-transform">
            <ImageIcon size={24} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-brand-dark">Click to upload QR code</p>
            <p className="text-xs text-brand-dark/50 mt-1">PNG or JPG</p>
          </div>
          <input id={id} type="file" className="sr-only" accept="image/*" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
        </label>
      )}
      {error && <p role="alert" className="mt-2 text-sm font-medium text-[#E02424]">{error}</p>}
    </div>
  );
}

// The payment accounts clients see at checkout. Saved to the database.
export default function AdminStudioSettings({ theme }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    apiFetch('/api/settings/payment')
      .then(res => res.json())
      .then(data => setForm(data.payment))
      .catch(() => setMessage({ type: 'error', text: 'Could not load the settings.' }));
  }, []);

  const set = (key) => (value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiFetch('/api/settings/payment', { method: 'PUT', body: JSON.stringify(form) });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Could not save the settings');
      setForm(data.payment);
      setMessage({ type: 'ok', text: 'Saved. Checkout now shows these details.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const text = (key, label) => (
    <div>
      <label htmlFor={`setting-${key}`} className="block text-sm font-bold text-brand-dark mb-2">{label}</label>
      <input id={`setting-${key}`} type="text" required maxLength={key.endsWith('Name') ? 100 : 40} value={form[key]} onChange={(e) => set(key)(e.target.value)} className={inputClass} />
    </div>
  );

  return (
    <div className="animate-fade-in max-w-3xl">
      <h2 className="text-3xl font-bold text-brand-dark mb-8">Studio Settings</h2>

      {!form ? (
        message.text ? <p role="alert" className="text-sm font-medium text-[#E02424]">{message.text}</p> : <p className="text-brand-dark/50 font-medium">Loading…</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-brand-sand/30 p-6 sm:p-8 mb-8">
          <h3 className="text-xl font-bold text-brand-dark mb-2 border-b border-brand-sand/30 pb-4">Payment Methods</h3>
          <p className="text-sm text-brand-dark/60 mb-6 mt-4">Clients pay into these accounts at checkout and when buying packages.</p>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {text('gcashName', 'GCash Account Name')}
              {text('gcashNumber', 'GCash Number')}
            </div>
            <QrField id="setting-gcashQr" label="GCash QR Code" value={form.gcashQr} onChange={set('gcashQr')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {text('bpiName', 'BPI Account Name')}
              {text('bpiNumber', 'BPI Account Number')}
            </div>
            <QrField id="setting-bpiQr" label="BPI QR Code" value={form.bpiQr} onChange={set('bpiQr')} />

            {message.text && (
              <p role={message.type === 'error' ? 'alert' : 'status'} className={`text-sm font-medium ${message.type === 'error' ? 'text-[#E02424]' : 'text-green-700'}`}>{message.text}</p>
            )}
            <button type="submit" disabled={saving} className={`${theme.bg} ${theme.text} ${theme.bgHover} px-6 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-60`}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
