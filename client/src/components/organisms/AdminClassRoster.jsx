import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../../api/base';
import { useNotify } from '../Notifications';
import MoveBookingDialog from './MoveBookingDialog';

const STATUS = {
  pending: ['Checking payment', 'bg-amber-50 text-amber-700'],
  confirmed: ['Confirmed', 'bg-green-50 text-green-700'],
  rejected: ['Rejected', 'bg-red-50 text-red-700'],
  cancelled: ['Cancelled', 'bg-black/5 text-brand-dark/60'],
};

// Everyone booked in one class, inside the admin's class editor: check
// payments, move a booking to another class, or cancel it. Changes here show
// up in Pending Verifications too.
export default function AdminClassRoster({ cls, onChanged }) {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [openReceipt, setOpenReceipt] = useState(null); // { id, src }
  const [moving, setMoving] = useState(null); // the booking being moved
  const { confirm, toast } = useNotify();

  const load = useCallback(() => {
    apiFetch(`/api/classes/${cls.id}/bookings`)
      .then(async res => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error || 'Could not load the bookings');
        setBookings(data.bookings);
      })
      .catch(err => setError(err.message));
  }, [cls.id]);

  useEffect(() => { load(); }, [load]);

  // `ask` is a confirmation dialog to show first; `done` is the message after.
  const act = async (booking, request, { ask, done }) => {
    if (ask && !(await confirm(ask))) return;
    setError('');
    setBusyId(booking.id);
    try {
      const res = await apiFetch(request.path, { method: request.method, body: JSON.stringify(request.body) });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      if (data?.emailed === false) toast(`${done} The email to ${booking.clientName} could not be sent, so please let them know yourself.`, { type: 'error' });
      else toast(`${done}${data?.emailed ? ` ${booking.clientName} has been emailed.` : ''}`);
      load();
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const setStatus = (b, status, messages) => act(b, { path: `/api/bookings/${b.id}`, method: 'PATCH', body: { status } }, messages);

  const toggleReceipt = (b) => {
    if (openReceipt?.id === b.id) return setOpenReceipt(null);
    setOpenReceipt({ id: b.id, src: null });
    apiFetch(`/api/bookings/${b.id}/receipt`)
      .then(res => res.json())
      .then(data => setOpenReceipt(prev => (prev?.id === b.id ? { id: b.id, src: data.receipt } : prev)))
      .catch(() => setError('Could not load the receipt'));
  };

  const active = bookings?.filter(b => ['pending', 'confirmed'].includes(b.status)) ?? [];
  const small = 'px-2.5 py-1 rounded-md text-xs font-bold transition-colors disabled:opacity-50';

  return (
    <section className="mt-8 pt-6 border-t border-brand-sand/30">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h4 className="font-bold text-brand-dark">Booked clients</h4>
        {bookings && <span className="text-xs text-brand-dark/50">{active.length} of {cls.capacity} spots taken</span>}
      </div>
      {error && <p role="alert" className="mb-3 text-sm font-medium text-[#E02424]">{error}</p>}

      {bookings === null ? (
        <p className="text-sm text-brand-dark/50">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-brand-dark/50">Nobody has booked this class yet.</p>
      ) : (
        <ul className="divide-y divide-brand-sand/30 border border-brand-sand/40 rounded-lg">
          {bookings.map((b) => {
            const [label, badge] = STATUS[b.status] ?? [b.status, 'bg-black/5'];
            const isActive = ['pending', 'confirmed'].includes(b.status);
            const busy = busyId === b.id;
            return (
              <li key={b.id} className={`px-3 py-3 text-sm ${isActive ? '' : 'opacity-60'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-brand-dark break-words">{b.clientName}</p>
                    <p className="text-xs text-brand-dark/60 break-all">{b.clientEmail}</p>
                    <p className="text-xs text-brand-dark/60">
                      {b.isPrivate ? 'Private session' : `Spot ${b.spot}`}{b.guestNames?.length ? ` · with ${b.guestNames.map((n, i) => (b.guestEmails?.[i] ? `${n} (${b.guestEmails[i]})` : n)).join(' and ')}` : ''}{b.dryNeedling ? ' · + dry needling' : ''} · {b.paidWithPackage ? 'Package credit' : `${b.amount || 'Direct payment'}${b.referenceId ? ` · Ref ${b.referenceId}` : ''}`}
                    </p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${badge}`}>{label}</span>
                </div>

                {isActive && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {b.status === 'pending' && (
                      <>
                        <button type="button" disabled={busy} onClick={() => setStatus(b, 'confirmed', { done: `Payment confirmed for ${b.clientName}.` })} className={`${small} bg-brand-dark text-white hover:bg-black`}>Confirm payment</button>
                        <button type="button" disabled={busy} onClick={() => setStatus(b, 'rejected', {
                          ask: { title: 'Reject this payment?', message: `${b.clientName}'s booking will be rejected and their spot freed. They will be emailed that the payment could not be verified.`, confirmLabel: 'Reject payment', tone: 'danger' },
                          done: `Payment rejected for ${b.clientName}.`,
                        })} className={`${small} border border-[#ffb3b3] text-[#E02424] hover:bg-[#fff5f5]`}>Reject</button>
                      </>
                    )}
                    {b.hasReceipt && (
                      <button type="button" onClick={() => toggleReceipt(b)} className={`${small} border border-brand-sand text-brand-dark hover:bg-black/5`}>
                        {openReceipt?.id === b.id ? 'Hide receipt' : 'Receipt'}
                      </button>
                    )}
                    <button type="button" disabled={busy} onClick={() => setMoving(b)} className={`${small} border border-brand-sand text-brand-dark hover:bg-black/5`}>Move</button>
                    <button type="button" disabled={busy} onClick={() => setStatus(b, 'cancelled', {
                      ask: { title: 'Cancel this booking?', message: `${b.clientName}'s spot in this class will be freed, and they will be emailed.`, confirmLabel: 'Cancel booking', cancelLabel: 'Keep booking', tone: 'danger' },
                      done: `Booking cancelled for ${b.clientName}.`,
                    })} className={`${small} border border-[#ffb3b3] text-[#E02424] hover:bg-[#fff5f5]`}>Cancel booking</button>
                  </div>
                )}

                {openReceipt?.id === b.id && (
                  <div className="mt-2 border border-brand-sand/50 rounded-lg overflow-hidden bg-[#FAF7F2]">
                    {openReceipt.src ? <img src={openReceipt.src} alt={`${b.clientName}'s receipt`} className="w-full max-h-80 object-contain" /> : <p className="p-3 text-xs text-brand-dark/50">Loading receipt…</p>}
                  </div>
                )}

              </li>
            );
          })}
        </ul>
      )}
      {moving && (
        <MoveBookingDialog
          booking={moving}
          fromClass={cls}
          onClose={() => setMoving(null)}
          onMoved={({ target, emailed }) => {
            const where = `${target.title} on ${target.date} at ${target.time}`;
            if (emailed === false) toast(`${moving.clientName} moved to ${where}. The email could not be sent, so please let them know yourself.`, { type: 'error' });
            else toast(`${moving.clientName} moved to ${where} and emailed the new time.`);
            setMoving(null);
            load();
            onChanged();
          }}
        />
      )}
    </section>
  );
}
