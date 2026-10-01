import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import { User, Calendar, Package, Receipt, Bell, Clock, MapPin } from 'lucide-react';
import CustomDropdown from '../components/atoms/CustomDropdown';
import ContactFAQSection from '../components/organisms/ContactFAQSection';
import Footer from '../components/organisms/Footer';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch, readSession } from '../api/base';
import { creditLabel, expiryLabel } from '../api/packages';
import { useNotify } from '../components/Notifications';

const MENU_ITEMS = [
  { id: 'profile', label: 'My profile', icon: User },
  { id: 'schedule', label: 'My schedule', icon: Calendar },
  { id: 'packages', label: 'My packages', icon: Package },
  { id: 'billing', label: 'Billing', icon: Receipt },
  { id: 'notifications', label: 'Notification settings', icon: Bell },
];

const GENDER_OPTIONS = ['Prefer not to say', 'Female', 'Male'];
const TYPE_OPTIONS = ['All types', 'Reformer Flow', 'Mat Pilates', 'Barre'];

// '2026-10-01' -> 'Thu, 1 Oct 2026', built from its parts so the visitor's
// timezone cannot move the day.
function formatDate(isoDate, options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', options);
}

// How a booking's state reads to the client.
function bookingStatus(booking) {
  if (booking.classCancelled) return { label: 'Class cancelled by studio', className: 'bg-red-50 text-red-700' };
  switch (booking.status) {
    case 'confirmed': return { label: 'Confirmed', className: 'bg-green-50 text-green-700' };
    case 'pending': return { label: 'Checking payment', className: 'bg-amber-50 text-amber-700' };
    case 'rejected': return { label: 'Payment not accepted', className: 'bg-red-50 text-red-700' };
    case 'cancelled': return { label: 'Cancelled', className: 'bg-black/5 text-brand-dark/60' };
    default: return { label: booking.status, className: 'bg-black/5 text-brand-dark/60' };
  }
}

function packageStatus(purchase) {
  switch (purchase.status) {
    case 'active': return { label: 'Active', className: 'bg-green-50 text-green-700' };
    case 'pending': return { label: 'Checking payment', className: 'bg-amber-50 text-amber-700' };
    case 'expired': return { label: 'Expired', className: 'bg-black/5 text-brand-dark/60' };
    case 'rejected': return { label: 'Payment not accepted', className: 'bg-red-50 text-red-700' };
    default: return { label: purchase.status, className: 'bg-black/5 text-brand-dark/60' };
  }
}

const isActive = (booking) => booking.isUpcoming && !booking.classCancelled && ['pending', 'confirmed'].includes(booking.status);

const cardClass = 'bg-white rounded-xl shadow-sm border border-brand-sand/30';
const labelClass = 'block text-xs text-brand-dark/50 mb-1';
const inputClass = 'w-full border border-brand-sand/50 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-brown font-medium text-brand-dark bg-white';

function Toggle({ id, checked, onChange, disabled }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative shrink-0 transition-colors disabled:opacity-50 ${checked ? 'bg-green-500' : 'bg-brand-dark/20'}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

export default function Dashboard() {
  const { user, login } = useAuth();
  const { confirm, toast } = useNotify();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = MENU_ITEMS.some(item => item.id === searchParams.get('tab')) ? searchParams.get('tab') : 'profile';
  const setActiveTab = (tab) => setSearchParams({ tab }, { replace: true });

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [purchases, setPurchases] = useState(null);
  const [loadError, setLoadError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const [scheduleView, setScheduleView] = useState('upcoming');
  const [scheduleFilter, setScheduleFilter] = useState('All types');
  const [cancellingId, setCancellingId] = useState(null);
  const [scheduleError, setScheduleError] = useState('');
  const [prefsError, setPrefsError] = useState('');

  const loadBookings = useCallback(() => {
    return apiFetch('/api/me/bookings')
      .then(async res => {
        if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Could not load your bookings');
        setBookings((await res.json()).bookings);
      })
      .catch(err => setLoadError(err.message));
  }, []);

  useEffect(() => {
    apiFetch('/api/me/profile')
      .then(async res => {
        if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Could not load your profile');
        setProfile((await res.json()).profile);
      })
      .catch(err => setLoadError(err.message));
    loadBookings();
    apiFetch('/api/me/packages')
      .then(async res => {
        if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Could not load your packages');
        setPurchases((await res.json()).packages);
      })
      .catch(err => setLoadError(err.message));
  }, [loadBookings]);

  const displayName = profile?.name || user?.name || user?.email?.split('@')[0] || '';

  // Saves part of the profile and keeps the navbar's name in step.
  const saveProfile = async (changes) => {
    const res = await apiFetch('/api/me/profile', { method: 'PUT', body: JSON.stringify(changes) });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || 'Could not save your changes');
    setProfile(data.profile);
    const session = readSession();
    if (session && data.profile.name !== session.user.name) {
      login({ token: session.token, user: { ...session.user, name: data.profile.name } });
    }
    return data.profile;
  };

  const startEditing = () => {
    setForm({
      name: profile.name,
      phone: profile.phone,
      birthDate: profile.birthDate,
      gender: profile.gender,
      address: profile.address,
    });
    setProfileError('');
    setProfileSaved(false);
    setIsEditing(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileError('');
    try {
      await saveProfile(form);
      setIsEditing(false);
      setProfileSaved(true);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreference = async (key, value) => {
    setPrefsError('');
    const previous = profile[key];
    setProfile(prev => ({ ...prev, [key]: value }));
    try {
      await saveProfile({ [key]: value });
    } catch (err) {
      setProfile(prev => ({ ...prev, [key]: previous }));
      setPrefsError(err.message);
    }
  };

  const handleCancelBooking = async (booking) => {
    if (!(await confirm({
      title: 'Cancel this booking?',
      message: `${booking.className} on ${formatDate(booking.date)} at ${booking.time}. Your spot will be given up${booking.amount === '1 credit' ? ' and the package credit returned' : ''}.`,
      confirmLabel: 'Cancel booking',
      cancelLabel: 'Keep booking',
      tone: 'danger',
    }))) return;
    setCancellingId(booking.id);
    setScheduleError('');
    try {
      const res = await apiFetch(`/api/me/bookings/${booking.id}/cancel`, { method: 'POST' });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Could not cancel the booking');
      await loadBookings();
      toast('Your booking is cancelled.');
    } catch (err) {
      setScheduleError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const loading = <p className="text-brand-dark/50 font-medium py-12">Loading…</p>;

  const renderProfile = () => {
    if (!profile) return loading;
    const field = (label, value) => (
      <div>
        <p className={labelClass}>{label}</p>
        <p className="font-medium text-brand-dark break-words">{value || <span className="text-brand-dark/40">Not added</span>}</p>
      </div>
    );

    return (
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-brand-dark mb-8">My profile</h2>

        <div className={`${cardClass} p-6 sm:p-8 mb-6`}>
          <h3 className="text-xl font-bold text-brand-dark mb-6">Account information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className={labelClass}>Email address</p>
              <p className="font-medium text-brand-dark break-all">{profile.email}</p>
              <p className="text-xs text-brand-dark/50 mt-2">You sign in with this address, and confirmations and reminders are sent here. To use a different email, sign in with it instead.</p>
            </div>
            <div>
              <p className={labelClass}>Password</p>
              <p className="font-medium text-brand-dark">None needed</p>
              <p className="text-xs text-brand-dark/50 mt-2">Each time you sign in we email you a one-time link.</p>
            </div>
          </div>
        </div>

        <div className={`${cardClass} p-6 sm:p-8`}>
          <div className="flex justify-between items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-brand-dark">Personal information</h3>
            {!isEditing && (
              <button onClick={startEditing} className="border border-brand-dark/20 rounded-full px-6 py-2 text-sm font-medium hover:bg-brand-sand/10 transition-colors">Edit</button>
            )}
          </div>

          {profileSaved && !isEditing && <p role="status" className="mb-6 text-sm font-medium text-green-700">Your changes are saved.</p>}

          {isEditing ? (
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label htmlFor="profile-name" className={labelClass}>Name</label>
                <input id="profile-name" required maxLength={100} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="profile-phone" className={labelClass}>Mobile number</label>
                <input id="profile-phone" type="tel" maxLength={30} autoComplete="tel" placeholder="+63 9XX XXX XXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="profile-birth" className={labelClass}>Date of birth</label>
                <input id="profile-birth" type="date" max={new Date().toISOString().slice(0, 10)} value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <p className={labelClass}>Gender</p>
                <div className="border border-brand-sand/50 rounded-lg bg-white relative z-20">
                  <CustomDropdown
                    value={form.gender || 'Prefer not to say'}
                    onChange={(value) => setForm({ ...form, gender: value === 'Prefer not to say' ? '' : value })}
                    options={GENDER_OPTIONS}
                    triggerClassName="px-4 py-2.5"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="profile-address" className={labelClass}>Address</label>
                <input id="profile-address" maxLength={200} autoComplete="street-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
              </div>
              {profileError && <p role="alert" className="md:col-span-2 text-sm font-medium text-[#E02424]">{profileError}</p>}
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-full font-medium text-brand-dark hover:bg-black/5 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="bg-brand-brown text-brand-beige px-8 py-2.5 rounded-full font-medium hover:bg-brand-dark transition-colors disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {field('Name', profile.name)}
              {field('Mobile number', profile.phone)}
              {field('Date of birth', profile.birthDate && formatDate(profile.birthDate, { day: 'numeric', month: 'short', year: 'numeric' }))}
              {field('Gender', profile.gender)}
              <div className="md:col-span-2">{field('Address', profile.address)}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSchedule = () => {
    const list = (bookings ?? [])
      .filter(b => (scheduleView === 'upcoming' ? isActive(b) : !isActive(b)))
      .filter(b => scheduleFilter === 'All types' || b.className === scheduleFilter);
    // Upcoming reads soonest first; history reads most recent first.
    if (scheduleView === 'upcoming') list.reverse();

    return (
      <div className="animate-fade-in h-full flex flex-col">
        <h2 className="text-3xl font-bold text-brand-dark mb-6">My schedule</h2>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-brand-sand/40 mb-8">
          <div className="flex gap-6" role="tablist">
            {[['upcoming', 'Upcoming'], ['history', 'History']].map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={scheduleView === id}
                onClick={() => setScheduleView(id)}
                className={`font-bold pb-3 -mb-[1px] border-b-2 transition-colors ${scheduleView === id ? 'text-brand-dark border-brand-dark' : 'text-brand-dark/40 border-transparent hover:text-brand-dark'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="border border-brand-sand/50 rounded-lg bg-white min-w-[170px] font-medium relative z-20 mb-3">
            <CustomDropdown value={scheduleFilter} onChange={setScheduleFilter} options={TYPE_OPTIONS} triggerClassName="px-4 py-2" />
          </div>
        </div>

        {scheduleError && <p role="alert" className="mb-6 text-sm font-medium text-[#E02424]">{scheduleError}</p>}

        {bookings === null ? loading : list.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <Calendar size={48} className="text-brand-dark/20 mb-6 mx-auto stroke-1" />
            <h3 className="text-xl font-bold text-brand-dark mb-6">
              {scheduleView === 'upcoming' ? 'You have no upcoming classes' : 'No past or cancelled bookings yet'}
            </h3>
            <Link to="/book" className="bg-brand-brown text-brand-beige px-8 py-3 rounded-full font-medium hover:bg-brand-dark transition-colors">
              Book a class
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((booking) => {
              const status = bookingStatus(booking);
              return (
                <div key={booking.id} className={`${cardClass} p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4`}>
                  <div className="sm:w-28 shrink-0">
                    <p className="font-bold text-brand-dark">{formatDate(booking.date, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <p className="text-sm text-brand-dark/60">{booking.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-brand-dark">{booking.className}</h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${status.className}`}>{status.label}</span>
                    </div>
                    <p className="text-sm text-brand-dark/70 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1"><User size={14} /> {booking.instructor}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {booking.branch} · {booking.isPrivate ? 'Private session' : `Spot ${booking.spot}`}</span>
                      {booking.guestNames?.length > 0 && <span className="flex items-center gap-1"><User size={14} /> With {booking.guestNames.join(' and ')}</span>}
                      <span className="flex items-center gap-1"><Clock size={14} /> {booking.duration}</span>
                    </p>
                  </div>
                  {isActive(booking) && (
                    booking.canCancel ? (
                      <button
                        onClick={() => handleCancelBooking(booking)}
                        disabled={cancellingId === booking.id}
                        className="self-start sm:self-center shrink-0 border border-[#ffb3b3] text-[#E02424] px-5 py-2 rounded-full text-sm font-bold hover:bg-[#fff5f5] transition-colors disabled:opacity-60"
                      >
                        {cancellingId === booking.id ? 'Cancelling…' : 'Cancel booking'}
                      </button>
                    ) : (
                      <p className="sm:w-44 shrink-0 text-xs text-brand-dark/50">Less than 12 hours to go. To change this booking, message the studio.</p>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderPackages = () => {
    if (purchases === null) return loading;
    const groups = [
      ['Active and pending', purchases.filter(p => ['active', 'pending'].includes(p.status))],
      ['Past', purchases.filter(p => !['active', 'pending'].includes(p.status))],
    ];
    return (
      <div className="animate-fade-in">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-brand-dark">My packages</h2>
          <Link to="/pricing" className="bg-brand-brown text-brand-beige px-6 py-2.5 rounded-full font-medium hover:bg-brand-dark transition-colors">Buy a package</Link>
        </div>
        {purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <Package size={56} className="text-brand-dark/20 mb-6 mx-auto stroke-1" />
            <p className="font-medium text-brand-dark mb-2">You don't have any packages yet.</p>
            <p className="text-sm text-brand-dark/60">Packages give you class credits at a lower price per session.</p>
          </div>
        ) : groups.map(([title, list]) => list.length > 0 && (
          <section key={title} className="mb-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark/50 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {list.map((p) => {
                const status = packageStatus(p);
                return (
                  <div key={p.id} className={`${cardClass} p-6 flex flex-col`}>
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="font-bold text-brand-dark">{p.name}</h4>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${status.className}`}>{status.label}</span>
                    </div>
                    <p className="text-sm text-brand-dark/60 mb-4">
                      {p.status === 'pending' && `Bought ${formatDate(String(p.purchasedAt), { day: 'numeric', month: 'short', year: 'numeric' })}. The studio is checking your payment.`}
                      {p.status === 'active' && (p.expiresAt ? (() => {
                        const daysLeft = Math.max(0, Math.ceil((new Date(p.expiresAt) - Date.now()) / 86400000));
                        return (
                          <>
                            Use it to book classes until <strong className={daysLeft <= 3 ? 'text-[#E02424]' : 'text-brand-dark'}>{new Date(p.expiresAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                            {' '}({daysLeft === 0 ? 'last day' : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`})
                          </>
                        );
                      })() : `Ready to use. Valid for ${expiryLabel(p.expiryDays)} from your first booking.`)}
                      {p.status === 'expired' && `Expired on ${new Date(p.expiresAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}. Unused credits can no longer be booked.`}
                      {p.status === 'rejected' && 'The studio could not match this payment. Please message them.'}
                    </p>
                    <ul className="space-y-2 mt-auto">
                      {p.unlimited && (
                        <li className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-brand-dark/80">{creditLabel('unlimited')}</span>
                          <span className="font-bold text-brand-dark">Unlimited</span>
                        </li>
                      )}
                      {Object.entries(p.credits).map(([type, credit]) => (
                        <li key={type} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-brand-dark/80">{creditLabel(type)}</span>
                          <span className="font-bold text-brand-dark">{credit.left} <span className="font-normal text-brand-dark/50">of {credit.total} left</span></span>
                        </li>
                      ))}
                    </ul>
                    {p.status === 'active' && p.credits.clinical && (
                      <p className="text-xs text-brand-dark/50 mt-4">Clinical sessions are booked with the studio directly.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderBilling = () => {
    // Everything paid for: class bookings paid directly, and package purchases.
    // Classes booked with a package credit are not separate payments.
    const payments = [
      ...(bookings ?? []).filter(b => b.amount !== '1 credit').map(b => ({
        key: `b${b.id}`, title: b.className, detail: `Class on ${formatDate(b.date)} · ${b.time}`,
        reference: b.referenceId, amount: b.amount, at: b.bookedAt, status: bookingStatus(b),
      })),
      ...(purchases ?? []).map(p => ({
        key: `p${p.id}`, title: p.name, detail: 'Package',
        reference: p.referenceId, amount: p.price, at: p.purchasedAt, status: packageStatus(p),
      })),
    ].sort((a, b) => String(b.at).localeCompare(String(a.at)));
    return (
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">Billing</h2>
        <p className="text-sm text-brand-dark/60 mb-8">Every payment you have sent, for classes and packages, and whether the studio has accepted it.</p>
        {bookings === null || purchases === null ? loading : payments.length === 0 ? (
          <div className={`${cardClass} py-12 px-6 text-center`}>
            <Receipt size={40} className="text-brand-dark/20 mb-4 mx-auto stroke-1" />
            <p className="font-medium text-brand-dark">No payments yet.</p>
          </div>
        ) : (
          <>
            <div className="md:hidden space-y-3">
              {payments.map((p) => (
                <div key={p.key} className={`${cardClass} p-5`}>
                  <div className="flex justify-between gap-3 mb-1">
                    <p className="font-bold text-brand-dark">{p.title}</p>
                    <p className="font-bold text-brand-dark shrink-0">{p.amount || '—'}</p>
                  </div>
                  <p className="text-xs text-brand-dark/60 mb-3">{p.detail} · Ref {p.reference || '—'}</p>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${p.status.className}`}>{p.status.label}</span>
                </div>
              ))}
            </div>
            <div className={`hidden md:block ${cardClass} overflow-hidden`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-sand/10 border-b border-brand-sand/50">
                    <th className="py-3 px-5 font-bold text-brand-dark text-sm">Booked</th>
                    <th className="py-3 px-5 font-bold text-brand-dark text-sm">Class</th>
                    <th className="py-3 px-5 font-bold text-brand-dark text-sm">Reference</th>
                    <th className="py-3 px-5 font-bold text-brand-dark text-sm">Amount</th>
                    <th className="py-3 px-5 font-bold text-brand-dark text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.key} className="border-b border-brand-sand/20 last:border-0">
                      <td className="py-3 px-5 text-sm text-brand-dark/70 whitespace-nowrap">{formatDate(String(p.at), { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-5 text-sm">
                        <p className="font-bold text-brand-dark">{p.title}</p>
                        <p className="text-xs text-brand-dark/60">{p.detail}</p>
                      </td>
                      <td className="py-3 px-5 font-mono text-xs text-brand-dark/80">{p.reference || '—'}</td>
                      <td className="py-3 px-5 text-sm font-bold text-brand-dark whitespace-nowrap">{p.amount || '—'}</td>
                      <td className="py-3 px-5"><span className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${p.status.className}`}>{p.status.label}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderNotifications = () => {
    if (!profile) return loading;
    const row = (id, title, description, key) => (
      <div className="flex items-start justify-between gap-6 py-5 first:pt-0 last:pb-0">
        <div>
          <label htmlFor={id} className="font-bold text-brand-dark cursor-pointer">{title}</label>
          <p className="text-sm text-brand-dark/60 mt-1">{description}</p>
        </div>
        <Toggle id={id} checked={profile[key]} onChange={(value) => handlePreference(key, value)} />
      </div>
    );
    return (
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">Notification settings</h2>
        <p className="text-sm text-brand-dark/60 mb-8">Emails go to {profile.email}. Changes save as soon as you switch them.</p>
        <div className={`${cardClass} p-6 sm:p-8 divide-y divide-brand-sand/30`}>
          {row('pref-reminders', 'Class reminders', 'An email about 12 hours before each confirmed class.', 'emailReminders')}
          {row('pref-promotions', 'Deals and promotions', 'Occasional emails about new classes, packages and offers.', 'emailPromotions')}
          <div className="py-5 last:pb-0">
            <p className="font-bold text-brand-dark">Booking updates</p>
            <p className="text-sm text-brand-dark/60 mt-1">Always on: we email you when a booking is confirmed or a class is cancelled.</p>
          </div>
        </div>
        {prefsError && <p role="alert" className="mt-4 text-sm font-medium text-[#E02424]">{prefsError}</p>}
      </div>
    );
  };

  const renderContent = () => {
    if (loadError) {
      return (
        <div className={`${cardClass} p-8 text-center`}>
          <p className="font-medium text-brand-dark mb-2">We couldn't load your account.</p>
          <p className="text-sm text-brand-dark/60">{loadError}</p>
        </div>
      );
    }
    switch (activeTab) {
      case 'schedule': return renderSchedule();
      case 'packages': return renderPackages();
      case 'billing': return renderBilling();
      case 'notifications': return renderNotifications();
      default: return renderProfile();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans pt-20">
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">

        {/* Left Sidebar */}
        <aside className="w-full lg:w-[320px] bg-white border-r border-brand-sand/30 flex flex-col shrink-0">

          {/* User Profile Card */}
          <div className="p-8 border-b border-brand-sand/10 flex flex-col items-center text-center">
            <div className="w-[100px] h-[100px] rounded-full bg-[#c977b3] flex items-center justify-center text-white text-[40px] font-bold mb-5 shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold font-serif text-brand-dark mb-2 tracking-tight break-words max-w-full">{displayName}</h2>
            {profile && (
              <>
                <p className="text-sm text-brand-dark/50 mb-3 font-medium">Client No: {profile.clientNo}</p>
                <p className="text-[13px] font-medium text-brand-dark/40">Joined {formatDate(profile.joined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-none lg:flex-1 py-2 lg:py-6 flex flex-row lg:flex-col overflow-x-auto border-b lg:border-b-0 border-brand-sand/30 scrollbar-hide">
            {MENU_ITEMS.map((item) => (
              <div key={item.id} className="shrink-0 lg:shrink w-auto lg:w-full">
                {item.id === 'billing' && <div className="hidden lg:block h-6"></div>} {/* Spacer only on desktop */}
                <button
                  onClick={(e) => {
                    setActiveTab(item.id);
                    e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-2 lg:gap-5 px-4 lg:px-10 py-3 lg:py-3 transition-colors text-left ${
                    activeTab === item.id
                      ? 'bg-transparent relative'
                      : 'hover:bg-brand-sand/10'
                  }`}
                >
                  {/* Active Indicator Line */}
                  {activeTab === item.id && (
                    <>
                      <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-black"></div>
                      <div className="block lg:hidden absolute bottom-0 left-0 right-0 h-1 bg-black"></div>
                    </>
                  )}

                  <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? 'text-black' : 'text-brand-dark/60'} />
                  <span className={`text-[15px] whitespace-nowrap ${activeTab === item.id ? 'font-bold text-black' : 'font-semibold text-brand-dark/70'}`}>
                    {item.label}
                  </span>
                </button>
              </div>
            ))}
          </nav>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-y-auto min-w-0">
          <div className="max-w-4xl">
            {renderContent()}
          </div>
        </main>

      </div>


      {/* FAQs and Footer */}
      <ContactFAQSection />
      <Footer />

    </div>
  );
}
