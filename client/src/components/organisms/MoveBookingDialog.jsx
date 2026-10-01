import { useEffect, useMemo, useState } from 'react';
import { XCircle, Clock, User, MapPin, ArrowRight } from 'lucide-react';
import { API_BASE, apiFetch } from '../../api/base';
import { labelToMinutes, durationOf, shortLabel } from '../../api/time';

const dayLabel = (iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', opts);
};
const spotsLeft = (c) => Math.max(0, c.capacity - (c.takenSpots?.length ?? 0));

// Picks another class for one booking: a strip of days, then that day's
// classes as cards. Only classes that can take the booking are offered.
export default function MoveBookingDialog({ booking, fromClass, onClose, onMoved }) {
  const [classes, setClasses] = useState(null);
  const [bothBranches, setBothBranches] = useState(false);
  const [day, setDay] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/classes`)
      .then(res => res.json())
      .then(data => setClasses(data.classes ?? []))
      .catch(() => setError('Could not load the schedule'));
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const options = useMemo(() => (classes ?? [])
    .filter(c => c.id !== fromClass.id && !c.isCancelled && !c.isDone)
    .filter(c => bothBranches || c.branch === fromClass.branch)
    // A private session needs a Reformer class nobody else has booked.
    .filter(c => (booking.isPrivate ? c.title.toLowerCase().includes('reformer') && (c.takenSpots?.length ?? 0) === 0 : spotsLeft(c) > 0))
    .sort((a, b) => a.date.localeCompare(b.date) || (labelToMinutes(a.time) ?? 0) - (labelToMinutes(b.time) ?? 0)),
  [classes, bothBranches, fromClass, booking.isPrivate]);

  const days = useMemo(() => [...new Set(options.map(c => c.date))], [options]);
  const activeDay = days.includes(day) ? day : days[0];
  const dayClasses = options.filter(c => c.date === activeDay);
  const target = options.find(c => c.id === selected);

  const move = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await apiFetch(`/api/bookings/${booking.id}/move`, { method: 'POST', body: JSON.stringify({ classId: Number(selected) }) });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Could not move the booking');
      onMoved({ target, emailed: data?.emailed });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const firstName = booking.clientName.split(' ')[0];

  return (
    <div className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="move-title" onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 pb-4 border-b border-brand-sand/30">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id="move-title" className="text-xl font-bold text-brand-dark">Move {booking.clientName}</h2>
              <p className="text-sm text-brand-dark/60 mt-1">
                From {fromClass.title} · {dayLabel(fromClass.date)} · {shortLabel(labelToMinutes(fromClass.time) ?? 0)} · {booking.isPrivate ? 'Private session' : `Spot ${booking.spot}`}
              </p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="text-brand-dark/40 hover:text-brand-dark shrink-0"><XCircle size={24} /></button>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-brand-dark/70 cursor-pointer w-fit">
            <input type="checkbox" checked={bothBranches} onChange={(e) => { setBothBranches(e.target.checked); setSelected(null); }} className="w-4 h-4 accent-[#3A2A20]" />
            Include the other branch
          </label>

          {days.length > 0 && (
            <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto pb-1 px-1" role="tablist" aria-label="Day">
              {days.map(d => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={d === activeDay}
                  onClick={() => { setDay(d); setSelected(null); }}
                  className={`shrink-0 px-3 py-2 rounded-xl text-sm font-bold border transition-colors ${d === activeDay ? 'bg-brand-dark text-white border-brand-dark' : 'border-brand-sand/60 text-brand-dark hover:bg-black/5'}`}
                >
                  {dayLabel(d)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {classes === null ? (
            <p className="text-sm text-brand-dark/50">Loading classes…</p>
          ) : options.length === 0 ? (
            <p className="text-sm text-brand-dark/60">
              No upcoming class has room for this booking{bothBranches ? '' : ' at this branch'}.
              {!bothBranches && ' Try including the other branch.'}
            </p>
          ) : (
            <div role="radiogroup" aria-label="Class to move to" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dayClasses.map(c => {
                const start = labelToMinutes(c.time) ?? 0;
                const isSelected = selected === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelected(c.id)}
                    className={`text-left rounded-xl border-2 p-4 transition-colors ${isSelected ? 'border-brand-dark bg-brand-sand/20' : 'border-brand-sand/40 hover:border-brand-sand'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-bold text-brand-dark">{c.title}</p>
                      <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                        {booking.isPrivate ? 'Empty' : `${spotsLeft(c)} left`}
                      </span>
                    </div>
                    <p className="text-sm text-brand-dark/70 flex items-center gap-1.5"><Clock size={14} /> {shortLabel(start)} – {shortLabel(start + durationOf(c))}</p>
                    <p className="text-sm text-brand-dark/70 flex items-center gap-1.5"><User size={14} /> {c.instructor}</p>
                    {bothBranches && <p className="text-sm text-brand-dark/70 flex items-center gap-1.5"><MapPin size={14} /> {c.branch}</p>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 pt-4 border-t border-brand-sand/30">
          {error && <p role="alert" className="mb-3 text-sm font-medium text-[#E02424]">{error}</p>}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="flex-1 text-sm text-brand-dark/70">
              {target
                ? <>To <strong className="text-brand-dark">{target.title}</strong>, {dayLabel(target.date, { weekday: 'long', day: 'numeric', month: 'long' })} at {shortLabel(labelToMinutes(target.time) ?? 0)}. {firstName} will be emailed the new time.</>
                : 'Choose a class to move to.'}
            </p>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-sm text-brand-dark hover:bg-black/5">Cancel</button>
              <button type="button" onClick={move} disabled={!target || saving} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-dark text-white hover:bg-black disabled:opacity-40 flex items-center gap-2">
                {saving ? 'Moving…' : <>Move booking <ArrowRight size={16} /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
