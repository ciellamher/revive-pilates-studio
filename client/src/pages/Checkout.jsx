import Navbar from '../components/organisms/Navbar';
import SpotSelectorMap from '../components/organisms/SpotSelectorMap';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Ticket } from 'lucide-react';
import PaymentUploadPanel from '../components/organisms/PaymentUploadPanel';
import { apiFetch } from '../api/base';
import { creditTypesForClass, creditLabel, packageCovers } from '../api/packages';
import { priceFor, PRIVATE_KINDS, PRIVATE_KIND_DETAILS, DRY_NEEDLING_PRICE, privateKind as kindInfo, hasFixedKind } from '../api/classTypes';
import { useAuth } from '../contexts/AuthContext';
import { useNotify } from '../components/Notifications';
import classPreviewImg from '../assets/revive-photos/reformer_11.jpg';

// Kept in localStorage, not sessionStorage: a visitor who must sign in first
// comes back through the emailed link, which opens a new tab.
const CHECKOUT_KEY = 'revive:checkout';

function readStoredCheckout() {
  try {
    return JSON.parse(localStorage.getItem(CHECKOUT_KEY));
  } catch {
    return null;
  }
}

export default function Checkout() {
  const [selectedPricing, setSelectedPricing] = useState(null);
  
  const location = useLocation();
  // The class comes from the schedule link. It is also kept for this browser
  // tab, so a refresh or a trip through sign-in does not lose it.
  const checkoutState = location.state?.classId ? location.state : readStoredCheckout();
  useEffect(() => {
    if (!location.state?.classId) return;
    try {
      localStorage.setItem(CHECKOUT_KEY, JSON.stringify(location.state));
    } catch {
      // No storage: a refresh will ask for the class again.
    }
  }, [location.state]);
  const { 
    isWaitlist = false, 
    slotsLeft = 2, 
    title = 'Group Reformer Class', 
    instructor = 'Coach Dani',
    time = '8:00am',
    classId = null,
    date = null,
    duration = '55 mins',
    branch = 'Angeles',
    capacity,
    takenSpots = [],
    isPrivate = false,
    privateKind: startingKind = null,
    classTitle = title,
    allowPrivate = true,
  } = checkoutState || {};

  // A private session that is not fixed to one kind (a Reformer class taken
  // whole, or a "Private Session" class) can be booked as any kind the class
  // has room for: solo, duo, trio or clinical.
  const kindChoices = isPrivate && !hasFixedKind(classTitle)
    ? PRIVATE_KINDS.filter(k => k.capacity <= (capacity ?? 1))
    : [];
  const [chosenKind, setChosenKind] = useState(startingKind);
  // A new class (say, from "book this as a private class") starts over.
  useEffect(() => setChosenKind(startingKind), [classId, startingKind]);
  const privateKind = isPrivate ? (chosenKind ?? 'solo') : null;
  const bookingTitle = kindChoices.length > 0 ? kindInfo(privateKind).title : title;
  // Clinical sessions can add dry needling.
  const [dryNeedling, setDryNeedling] = useState(false);
  const withDryNeedling = privateKind === 'clinical' && dryNeedling;

  // Signed-in clients start with their own details; they can still change them.
  const { user } = useAuth();
  const [attendeeName, setAttendeeName] = useState(user?.name ?? '');
  // A duo session has one more attendee, a trio two more, each with a name and
  // an email so the booking shows in their account too.
  const [guestList, setGuestList] = useState([{ name: '', email: '' }, { name: '', email: '' }]);
  const setGuest = (i, field, value) => setGuestList(prev => prev.map((g, j) => (j === i ? { ...g, [field]: value } : g)));
  const attendeeEmail = user?.email ?? '';
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [referenceId, setReferenceId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [booking, setBooking] = useState(null);
  const { confirm } = useNotify();

  // The client's own active booking in this class, if they already have one.
  const [existingBooking, setExistingBooking] = useState(null);
  useEffect(() => {
    if (!user || !classId) return;
    apiFetch('/api/me/bookings')
      .then(res => (res.ok ? res.json() : null))
      .then(data => setExistingBooking(data?.bookings?.find(b => b.classId === String(classId) && ['pending', 'confirmed'].includes(b.status)) ?? null))
      .catch(() => {});
  }, [user, classId]);

  // Booking the same class twice is allowed (say, for a friend) but asked about.
  const okToBookAgain = async () => {
    if (!existingBooking) return true;
    return confirm({
      title: 'You already booked this class',
      message: `You have ${existingBooking.isPrivate ? 'a private session' : `spot ${existingBooking.spot}`} here (${existingBooking.status === 'confirmed' ? 'confirmed' : 'payment being checked'}). Book another spot anyway?`,
      confirmLabel: 'Book another spot',
      cancelLabel: 'No, go back',
    });
  };

  // Packages with a credit this class can use.
  const [activePackages, setActivePackages] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [packageError, setPackageError] = useState('');
  const [usingCredit, setUsingCredit] = useState(false);
  // A private session is paid with a private credit, a group class with one of its kind.
  const classCreditTypes = creditTypesForClass(classTitle, privateKind);
  const guestCount = isPrivate ? ({ duo: 1, trio: 2 }[privateKind] ?? 0) : 0;
  const guests = guestList.slice(0, guestCount).map(g => ({ name: g.name.trim(), email: g.email.trim().toLowerCase() }));
  const missingGuest = () => {
    for (const [i, g] of guests.entries()) {
      const who = guestCount === 1 ? 'the second attendee' : `attendee ${i + 2}`;
      if (!g.name) return `Please enter ${who}'s name.`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email)) return `Please enter ${who}'s email.`;
      if (g.email === attendeeEmail.toLowerCase() || guests.findIndex(o => o.email === g.email) !== i) return 'Each attendee needs their own email address.';
    }
    return '';
  };

  // When the class starts, to check packages are still valid by then.
  const classStart = (() => {
    const [y, mo, d] = (date ?? '').split('-').map(Number);
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time ?? '');
    if (!y || !match) return null;
    const hours = (Number(match[1]) % 12) + (match[3].toUpperCase() === 'PM' ? 12 : 0);
    return new Date(y, mo - 1, d, hours, Number(match[2]));
  })();
  // The last moment a package can be used: its expiry, or for a package not
  // started yet, the length of its validity counted from today.
  const validUntil = (p) => (p.expiresAt ? new Date(p.expiresAt) : new Date(Date.now() + p.expiryDays * 86400000));
  const coversClassDate = (p) => !classStart || classStart <= validUntil(p);
  const shortDate = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  useEffect(() => {
    if (!user) return;
    apiFetch('/api/me/packages')
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('Could not load your packages'))))
      .then(data => {
        setActivePackages(data.packages.filter(p => p.status === 'active'));
      })
      .catch(err => setPackageError(err.message));
  }, [user]);

  // The packages that can pay for this class, as the kind of session chosen.
  const myPackages = activePackages?.filter(p => packageCovers(p, classCreditTypes)) ?? null;
  const usableIds = (myPackages ?? []).filter(coversClassDate).map(p => p.id).join(',');
  useEffect(() => {
    setSelectedPackageId(prev => (usableIds.split(',').includes(prev) ? prev : usableIds.split(',')[0] || null));
  }, [usableIds]);

  const handleUseCredit = async () => {
    if (!classId) return setPackageError('Please choose a class from the timetable first.');
    if (!isPrivate && !selectedSpot) return setPackageError('Please select your spot.');
    if (!selectedPackageId) return setPackageError('Please choose a package.');
    if (missingGuest()) return setPackageError(missingGuest());
    if (!(await okToBookAgain())) return;
    setUsingCredit(true);
    setPackageError('');
    try {
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ packageId: Number(selectedPackageId), classId: Number(classId), spot: selectedSpot, private: isPrivate, privateKind, guests, dryNeedling: withDryNeedling, clientName: attendeeName })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Something went wrong. Please try again.');
      setBooking(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setPackageError(err.message);
    } finally {
      setUsingCredit(false);
    }
  };

  // '2026-10-01' -> 'Thu, 1 Oct 2026', built from its parts so the day cannot
  // shift with the visitor's timezone.
  const dateLabel = date
    ? new Date(...date.split('-').map((part, i) => Number(part) - (i === 1 ? 1 : 0)))
        .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : 'Thu, 20 Aug 2026';

  // Infer classType from title for dynamic pricing and shapes
  const classType = classTitle.toLowerCase().includes('mat') ? 'mat' : classTitle.toLowerCase().includes('barre') ? 'barre' : 'reformer';

  // Price per person (per session when private), e.g. '1,100', plus dry needling.
  const price = (priceFor(bookingTitle) + (withDryNeedling ? DRY_NEEDLING_PRICE : 0)).toLocaleString('en-US');

  // The summary card's button opens the payment step and brings it into view.
  const startDirectPayment = () => {
    setSelectedPricing('direct');
    requestAnimationFrame(() => {
      document.getElementById('payment-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleSubmitBooking = async () => {
    if (!classId) return setSubmitError('Please choose a class from the timetable first.');
    if (!attendeeName.trim()) return setSubmitError('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail.trim())) return setSubmitError('Please enter a valid email address.');
    if (!isPrivate && !selectedSpot) return setSubmitError('Please select your spot.');
    if (missingGuest()) return setSubmitError(missingGuest());
    if (!(await okToBookAgain())) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      // apiFetch sends the sign-in: booking needs an account.
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          classId: Number(classId),
          clientName: attendeeName,
          clientEmail: attendeeEmail,
          spot: selectedSpot,
          private: isPrivate,
          privateKind,
          guests,
          dryNeedling: withDryNeedling,
          referenceId,
          receipt,
          amount: `₱ ${price}`
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Something went wrong. Please try again.');
      setBooking(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!classId) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 max-w-xl w-full mx-auto px-4 sm:px-6 text-center">
          <Calendar size={48} className="text-brand-dark/20 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-brand-dark mb-3">Pick a class first</h1>
          <p className="text-brand-dark/70 mb-8">Choose a time on the schedule, then press Book Now or Book Private to book your spot.</p>
          <Link to="/book" className="inline-block bg-brand-brown text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors">See the schedule</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar />
      
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="text-xs font-bold text-brand-dark/60 mb-6">
          <Link to="/book" className="hover:text-brand-brown">Timetable</Link> <span className="mx-2">&gt;</span> {bookingTitle} with {instructor}
        </div>

        <h1 className="text-3xl font-sans font-bold text-brand-dark mb-8">Book this class</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column */}
          {booking ? (
          <div className="flex-1">
            <section role="status" className="border border-brand-sand/50 rounded-xl p-8 bg-white shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-brand-dark mb-3">Booking received</h2>
              {booking.status === 'confirmed' ? (
                <p className="text-brand-dark/80 mb-6">
                  You're booked, {booking.clientName}: {booking.isPrivate ? `a private session (${booking.className})` : `spot ${booking.spot} in ${booking.className}`}, paid with 1 package credit. We've emailed your confirmation and will send a reminder about 12 hours before class.
                </p>
              ) : (
                <>
                  <p className="text-brand-dark/80 mb-2">
                    Thanks, {booking.clientName}. {booking.isPrivate ? `Your private session (${booking.className})` : `Spot ${booking.spot} in ${booking.className}`} is held for you while the studio verifies your payment.
                  </p>
                  <p className="text-brand-dark/80 mb-6">
                    Once it is confirmed, we will email a reminder to <strong className="text-brand-dark">{attendeeEmail.trim()}</strong> about 12 hours before your class.
                  </p>
                </>
              )}
              <p className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-6">Booking ID {booking.id}</p>
              <Link to="/book" className="inline-block bg-brand-brown text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors">Back to timetable</Link>
            </section>
          </div>
          ) : (
          <div className="flex-1 flex flex-col gap-10">
            
            {existingBooking && (
              <div role="status" className="border border-amber-200 bg-amber-50 text-amber-800 rounded-xl px-4 py-3 text-sm">
                You're already booked in this class ({existingBooking.isPrivate ? 'private session' : `spot ${existingBooking.spot}`}, {existingBooking.status === 'confirmed' ? 'confirmed' : 'payment being checked'}). You can still book another spot.
              </div>
            )}

            {/* Attendee Info */}
            <section>
              <h2 className="text-lg font-serif font-bold text-brand-dark mb-4">{guestCount > 0 ? 'Attendees' : 'Attendee'}</h2>
              
              <div className="border border-brand-sand/50 rounded-xl p-4 bg-white shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="attendee-name" className="block text-xs font-bold text-brand-dark/60 mb-1">Full name</label>
                  <input
                    id="attendee-name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-sand focus:outline-none focus:border-brand-brown bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="attendee-email" className="block text-xs font-bold text-brand-dark/60 mb-1">Email</label>
                  <input
                    id="attendee-email"
                    type="email"
                    readOnly
                    value={attendeeEmail}
                    title="Bookings go to the email you signed in with"
                    className="w-full px-3 py-2 rounded-lg border border-brand-sand bg-brand-sand/10 text-brand-dark/70 cursor-not-allowed"
                  />
                </div>
                <p className="sm:col-span-2 text-xs text-brand-dark/60">This is the email you signed in with. Your confirmation and class reminder go here.</p>
                {guests.map((g, i) => {
                  const who = guestCount === 1 ? 'Second attendee' : `Attendee ${i + 2}`;
                  return (
                    <fieldset key={i} className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-sand/40">
                      <legend className="sr-only">{who}</legend>
                      <div>
                        <label htmlFor={`guest-${i}`} className="block text-xs font-bold text-brand-dark/60 mb-1">{who}: full name</label>
                        <input
                          id={`guest-${i}`}
                          type="text"
                          required
                          maxLength={100}
                          value={guestList[i].name}
                          onChange={(e) => setGuest(i, 'name', e.target.value)}
                          placeholder="Who is joining you?"
                          className="w-full px-3 py-2 rounded-lg border border-brand-sand focus:outline-none focus:border-brand-brown bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor={`guest-email-${i}`} className="block text-xs font-bold text-brand-dark/60 mb-1">{who}: email</label>
                        <input
                          id={`guest-email-${i}`}
                          type="email"
                          required
                          maxLength={254}
                          value={guestList[i].email}
                          onChange={(e) => setGuest(i, 'email', e.target.value)}
                          placeholder="their@email.com"
                          className="w-full px-3 py-2 rounded-lg border border-brand-sand focus:outline-none focus:border-brand-brown bg-white"
                        />
                      </div>
                    </fieldset>
                  );
                })}
                {guestCount > 0 && (
                  <p className="sm:col-span-2 text-xs text-brand-dark/60">
                    This is a {privateKind === 'duo' ? 'duo' : 'trio'} session, so {guestCount === 1 ? 'one more person' : 'two more people'} will join you. They get the booking emails too, and the booking shows in their account when they sign in with that email.
                  </p>
                )}
              </div>
            </section>

            {/* Spot Selector */}
            <section>
              <h2 className="text-lg font-bold text-brand-dark mb-4">{isPrivate ? 'Your session' : 'Select your Spot'}</h2>
              {isPrivate && kindChoices.length > 1 && (
                <div role="radiogroup" aria-label="Type of private session" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {kindChoices.map(k => {
                    const selected = privateKind === k.key;
                    return (
                      <button
                        key={k.key}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setChosenKind(k.key)}
                        className={`text-left rounded-xl border-2 p-3 sm:p-4 transition-colors ${selected ? 'border-brand-brown bg-brand-brown/5' : 'border-brand-sand/50 bg-white hover:border-brand-sand'}`}
                      >
                        <span className="block font-bold text-brand-dark text-sm sm:text-base">{k.key === 'solo' ? 'Private' : k.key === 'clinical' ? 'Clinical' : k.key === 'duo' ? 'Duo' : 'Trio'}</span>
                        <span className="block text-xs text-brand-dark/60 mt-0.5">{PRIVATE_KIND_DETAILS[k.key]}</span>
                        <span className="block text-sm font-bold text-brand-dark mt-2">₱{priceFor(k.title).toLocaleString('en-US')}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {privateKind === 'clinical' && (
                <label className="flex items-start gap-3 border border-brand-sand/50 rounded-xl p-4 bg-white shadow-sm mb-4 cursor-pointer">
                  <input type="checkbox" checked={dryNeedling} onChange={(e) => setDryNeedling(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#3A2A20] shrink-0" />
                  <span className="text-sm">
                    <span className="font-bold text-brand-dark">Add dry needling</span> <span className="text-brand-dark/60">(optional, +₱{DRY_NEEDLING_PRICE.toLocaleString('en-US')})</span>
                    <span className="block text-xs text-brand-dark/60 mt-0.5">An additional service done by our physical therapist during your clinical session.</span>
                  </span>
                </label>
              )}
              {isPrivate ? (
                <div className="border border-brand-sand/50 rounded-xl p-5 bg-white shadow-sm text-sm text-brand-dark/80">
                  {privateKind === 'clinical'
                    ? 'This is a clinical Pilates session: one-on-one and therapy-focused, so there is no spot to pick. If you have a doctor\'s referral, please bring it.'
                    : guestCount > 0
                    ? `This is a ${privateKind === 'duo' ? 'duo' : 'trio'} private session: the room and your coach are booked for your group, so there is no spot to pick.`
                    : 'This is a private session: the whole room and your coach are booked just for you, so there is no spot to pick.'}
                </div>
              ) : (
              <SpotSelectorMap
                classType={classType}
                spotCount={capacity}
                takenSpots={takenSpots}
                selectedSpot={selectedSpot}
                onSelectSpot={setSelectedSpot}
              />
              )}
            </section>

            {/* Pricing Option */}
            <section>
              <h2 className="text-lg font-serif font-bold text-brand-dark mb-4">Select pricing option</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setSelectedPricing('direct')}
                  className={`flex-1 py-8 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${selectedPricing === 'direct' ? 'border-brand-brown bg-brand-brown/5 shadow-md' : 'border-brand-sand/50 bg-white shadow-sm'}`}>
                  <span className="text-xl font-medium">₱ {price}</span>
                  <span className="text-sm font-bold text-brand-dark/70">Direct payment</span>
                </button>
                <button 
                  onClick={() => setSelectedPricing('plan')}
                  className={`flex-1 py-8 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${selectedPricing === 'plan' ? 'border-brand-brown bg-brand-brown text-white shadow-md' : 'border-brand-sand/50 bg-white shadow-sm'}`}>
                  <Ticket size={24} className="mb-1" />
                  <span className="text-sm font-bold">Current Packages</span>
                </button>
              </div>
            </section>

            {selectedPricing === 'direct' && (
              <section id="payment-details" className="animate-fade-in -mt-4 scroll-mt-28">
                <PaymentUploadPanel
                  referenceId={referenceId}
                  onReferenceChange={setReferenceId}
                  receipt={receipt}
                  onReceiptChange={setReceipt}
                  onSubmit={handleSubmitBooking}
                  submitting={submitting}
                  error={submitError}
                />
              </section>
            )}

            {selectedPricing === 'plan' && (
              <section className="animate-fade-in bg-white border border-brand-sand/50 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-brand-dark mb-4">Your Active Packages</h3>
                
                {!user ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-brand-sand/50 rounded-xl bg-brand-sand/10">
                    <Ticket size={48} className="text-brand-dark/20 mb-4" />
                    <p className="font-bold text-brand-dark mb-2">Sign in to use your packages</p>
                    <p className="text-sm text-brand-dark/70 mb-6">After signing in, pick this class from the schedule again.</p>
                    <Link to="/login" className="bg-brand-brown text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-sm">Sign in</Link>
                  </div>
                ) : myPackages === null && !packageError ? (
                  <p className="text-sm text-brand-dark/50 font-medium py-6">Loading your packages…</p>
                ) : myPackages?.length > 0 ? (
                  <>
                    <div role="radiogroup" aria-label="Package to use" className="space-y-3">
                      {myPackages.map((p) => {
                        const selected = selectedPackageId === p.id;
                        const fits = coversClassDate(p);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            disabled={!fits}
                            onClick={() => setSelectedPackageId(p.id)}
                            className={`w-full text-left border-2 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${selected && fits ? 'border-brand-brown bg-brand-sand/10' : 'border-brand-sand/50 hover:bg-brand-sand/10'}`}
                          >
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Active</span>
                                <span className="font-bold text-brand-dark">{p.name}</span>
                              </div>
                              {p.isShared && <p className="text-xs font-medium text-[#3B657F] mb-1">Shared with you by {p.clientName || p.clientEmail}</p>}
                              <p className="text-sm text-brand-dark/70">
                                {[
                                  ...(p.unlimited && classCreditTypes.includes('unlimited') ? ['Unlimited group classes'] : []),
                                  ...classCreditTypes.filter(type => p.credits[type]).map(type => `${p.credits[type].left} ${creditLabel(type).toLowerCase()} left`),
                                ].join(' • ')}
                              </p>
                              <p className={`text-xs mt-1 font-medium ${fits ? 'text-brand-dark/60' : 'text-[#E02424]'}`}>
                                {p.expiresAt
                                  ? `Valid until ${shortDate(validUntil(p))}`
                                  : `Starts with this booking: valid until ${shortDate(validUntil(p))}`}
                                {!fits && ' — expires before this class'}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-sm font-bold text-brand-dark/60">-1 credit</span>
                              <span className={`w-6 h-6 rounded-full border-2 border-brand-brown flex items-center justify-center ${selected ? 'bg-brand-brown' : ''}`}>
                                {selected && <span className="w-2.5 h-2.5 rounded-full bg-white"></span>}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {withDryNeedling && <p className="mt-4 text-sm text-brand-dark/70">The package covers the session. Dry needling (₱{DRY_NEEDLING_PRICE.toLocaleString('en-US')}) is paid at the studio.</p>}
                    {packageError && <p role="alert" className="mt-4 text-sm font-medium text-[#E02424]">{packageError}</p>}

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleUseCredit}
                        disabled={usingCredit || !myPackages.some(p => p.id === selectedPackageId && coversClassDate(p) && packageCovers(p, classCreditTypes))}
                        className="w-full sm:w-auto bg-brand-brown text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-sm disabled:opacity-60"
                      >
                        {usingCredit ? 'Booking…' : 'Confirm Booking (Use 1 Credit)'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-brand-sand/50 rounded-xl bg-brand-sand/10">
                    <Ticket size={48} className="text-brand-dark/20 mb-4" />
                    <p className="font-bold text-brand-dark mb-2">No packages with credits for this class</p>
                    <p className="text-sm text-brand-dark/70 mb-6">{packageError || 'Packages you buy appear here once the studio activates them.'}</p>
                    <Link to="/pricing" className="bg-brand-brown text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-sm">
                      View & Buy Packages
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* What you'll need */}
            <section>
              <h2 className="text-lg font-bold text-brand-dark mb-4">What you'll need</h2>
              <ul className="grid grid-cols-3 gap-4 text-sm font-bold text-brand-dark/70">
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-brand-dark"></div> Grip socks</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-brand-dark"></div> Water bottle</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-brand-dark"></div> Towel</li>
              </ul>
            </section>

            <hr className="border-brand-sand/30" />

            {/* Getting There */}
            <section>
              <h2 className="text-lg font-bold text-brand-dark mb-4">Getting there</h2>
              <p className="text-sm text-brand-dark/70">{branch === 'San Fernando' ? 'St. Charbel Square Building, MacArthur Hwy, San Fernando' : 'Omnistellar Building, Fil-Am Friendship Hwy, Angeles City'}</p>
            </section>

            <hr className="border-brand-sand/30" />

            {/* Studio Policies */}
            <section>
              <h2 className="text-lg font-bold text-brand-dark mb-4">Studio Policies</h2>
              <div className="text-sm text-brand-dark/70 space-y-4">
                <div>
                  <p className="font-bold text-brand-dark mb-1">SCHEDULE</p>
                  <p>We update our schedule weekly. Check our Facebook and Instagram pages to see the schedule of the week.</p>
                </div>
                <div>
                  <p className="font-bold text-brand-dark mb-1">LATE ARRIVAL</p>
                  <p>Timely starts matter for your safety. Please arrive on time to allow for proper warm-up and reduce injury risks.</p>
                  <p className="mt-1"><span className="font-bold text-brand-dark">*Late Arrival Policy:</span> If you're <strong className="text-brand-dark">15+ mins late</strong>, we'll aim to reschedule you to the next available class within the day. Otherwise, your session will be forfeited to maintain a safe environment.</p>
                </div>
                <div>
                  <p className="font-bold text-brand-dark mb-1">CANCELLATION</p>
                  <p>Should you need to reschedule or cancel, no worries, just let us know <strong className="text-brand-dark">12 hours BEFORE</strong> your session to avoid forfeiting the advance payment.</p>
                </div>
              </div>
            </section>
            
          </div>
          )}

          {/* Right Column: Summary Card */}
          {/* First on phones, so the class being booked is the first thing you see. */}
          <div className="w-full lg:w-[400px] order-first lg:order-none">
            <div className="bg-white rounded-3xl border border-brand-sand/50 shadow-md overflow-hidden lg:sticky lg:top-32">
              
              {/* Image */}
              <div className="h-36 sm:h-48 lg:h-56 border-b border-brand-sand/30 overflow-hidden">
                <img src={classPreviewImg} alt="Class preview" className="w-full h-full object-cover" />
              </div>
              
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-brand-dark mb-1">{bookingTitle}</h3>
                {bookingTitle !== classTitle && <p className="text-xs text-brand-dark/50 mb-5">In the {classTitle} slot, booked whole for you</p>}
                {bookingTitle === classTitle && <div className="mb-5" />}
                
                <div className="space-y-4 mb-8">
                  <div className="flex gap-4">
                    <Calendar size={20} className="text-brand-dark/40 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{dateLabel}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock size={20} className="text-brand-dark/40 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{time}, {duration}</p>
                      <p className="text-xs text-brand-dark/50">Check-in anytime before class begins</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin size={20} className="text-brand-dark/40 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-brand-dark">Revive Pilates Studio</p>
                      <p className="text-xs text-brand-dark/50">{branch === 'San Fernando' ? 'San Fernando Branch' : 'Angeles City Branch'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <User size={20} className="text-brand-dark/40 shrink-0" />
                    <p className="font-bold text-brand-dark text-lg">{instructor}</p>
                  </div>
                </div>
                
                {!booking && (
                <button
                  type="button"
                  onClick={startDirectPayment}
                  disabled={isWaitlist}
                  className={`w-full py-4 rounded-xl font-bold mb-2 transition-colors ${
                  isWaitlist
                    ? 'bg-brand-sand/30 text-brand-dark/60 cursor-not-allowed'
                    : 'bg-brand-brown text-white hover:bg-brand-dark shadow-sm'
                }`}>
                  {isWaitlist ? 'Class is full' : 'Book Now'}
                </button>
                )}
                {!isWaitlist && !booking && (
                  <div className="text-center">
                    <p className="text-sm font-bold text-brand-dark">{slotsLeft} {slotsLeft === 1 ? 'slot' : 'slots'} left</p>
                    
                    {classId && !isPrivate && allowPrivate && classType === 'reformer' && takenSpots.length === 0 && (
                      <Link 
                        to="/checkout"
                        state={{ ...checkoutState, classTitle, title: kindInfo('solo').title, isPrivate: true, privateKind: 'solo', isWaitlist: false, slotsLeft: 1 }}
                        className="inline-block text-xs font-bold text-brand-brown hover:text-brand-dark underline underline-offset-2 mt-3 transition-colors"
                      >
                        Want to book this as a Private Class?
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
