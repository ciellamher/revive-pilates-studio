import { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import { apiFetch } from '../../api/base';
import { creditLabel } from '../../api/packages';

const BOOKING_STATUS = {
  pending: 'Checking payment',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
  cancelled: 'Cancelled by client',
};

const formatDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

// The admin's view of one client: contact details, packages and bookings.
export default function AdminClientProfile({ email, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/api/users/${encodeURIComponent(email)}`)
      .then(async res => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error || 'Could not load this client');
        setData(body);
      })
      .catch(err => setError(err.message));
  }, [email]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const detail = (label, value) => (
    <div>
      <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-medium text-brand-dark break-words">{value || <span className="text-brand-dark/40">Not added</span>}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Client profile" className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold text-brand-dark break-words">{data?.profile.name || email}</h3>
            {data && <p className="text-sm text-brand-dark/60">Client No {data.profile.clientNo} • Joined {formatDate(data.profile.joined)}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="text-brand-dark/40 hover:text-brand-dark transition-colors shrink-0">
            <XCircle size={24} />
          </button>
        </div>

        {error ? (
          <p role="alert" className="text-sm font-medium text-[#E02424]">{error}</p>
        ) : !data ? (
          <p className="text-brand-dark/50 font-medium">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {detail('Email', data.profile.email)}
              {detail('Mobile', data.profile.phone)}
              {detail('Date of birth', data.profile.birthDate && formatDate(data.profile.birthDate))}
              {detail('Gender', data.profile.gender)}
              <div className="sm:col-span-2">{detail('Address', data.profile.address)}</div>
              {detail('Class reminders', data.profile.emailReminders ? 'On' : 'Off')}
              {detail('Promotions', data.profile.emailPromotions ? 'Subscribed' : 'Not subscribed')}
            </div>

            <h4 className="font-bold text-brand-dark mb-3">Packages</h4>
            {data.packages.length === 0 ? (
              <p className="text-sm text-brand-dark/50 mb-8">No packages.</p>
            ) : (
              <ul className="space-y-2 mb-8">
                {data.packages.map((p) => (
                  <li key={p.id} className="border border-brand-sand/40 rounded-lg px-4 py-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="font-bold text-brand-dark">{p.name}</span>
                      <span className="text-brand-dark/60 capitalize shrink-0">{p.status}</span>
                    </div>
                    <p className="text-brand-dark/60 mt-1">
                      {Object.entries(p.credits).map(([type, c]) => `${c.left}/${c.total} ${creditLabel(type).toLowerCase()}`).join(' • ')}
                      {p.expiresAt && ` • until ${formatDate(p.expiresAt)}`}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <h4 className="font-bold text-brand-dark mb-3">Bookings</h4>
            {data.bookings.length === 0 ? (
              <p className="text-sm text-brand-dark/50">No bookings.</p>
            ) : (
              <ul className="divide-y divide-brand-sand/30 border border-brand-sand/40 rounded-lg">
                {data.bookings.map((b) => (
                  <li key={b.id} className="px-4 py-3 text-sm flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-brand-dark">{b.className}</p>
                      <p className="text-brand-dark/60">{formatDate(b.date)} • {b.time} • {b.branch} • Spot {b.spot}</p>
                    </div>
                    <span className="text-brand-dark/60 shrink-0 text-right">{b.classCancelled ? 'Class cancelled' : BOOKING_STATUS[b.status] ?? b.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
