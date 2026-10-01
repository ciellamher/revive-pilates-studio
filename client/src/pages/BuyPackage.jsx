import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Package, CalendarClock, Users, X, UserPlus, Check } from 'lucide-react';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import PaymentUploadPanel from '../components/organisms/PaymentUploadPanel';
import { API_BASE, apiFetch } from '../api/base';
import { formatPeso, creditLabel, validityText, creditsSummary, MAX_SHARES } from '../api/packages';
import { useAuth } from '../contexts/AuthContext';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A numbered step of the purchase.
function Step({ number, title, children }) {
  return (
    <section className="bg-white rounded-2xl border border-brand-sand/40 shadow-sm p-5 sm:p-7">
      <h2 className="flex items-center gap-3 text-lg font-bold text-brand-dark mb-4">
        <span className="w-7 h-7 rounded-full bg-brand-dark text-white text-sm flex items-center justify-center shrink-0">{number}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

// Buying a package: pay by GCash or BPI, send the reference number, and the
// studio activates the package once it has checked the payment.
export default function BuyPackage() {
  const { packageId } = useParams();
  const [pkg, setPkg] = useState(undefined); // undefined = loading, null = not found
  const [referenceId, setReferenceId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [purchase, setPurchase] = useState(null);
  const { user } = useAuth();
  // Shareable packages can be shared with a few people, by email.
  const [sharedWith, setSharedWith] = useState([]);
  const [shareInput, setShareInput] = useState('');
  const [shareError, setShareError] = useState('');

  const addShare = () => {
    const email = shareInput.trim().toLowerCase();
    if (!EMAIL.test(email)) return setShareError('Please enter a valid email address.');
    if (email === user?.email?.toLowerCase()) return setShareError('That is your own email: the package is already yours.');
    if (sharedWith.includes(email)) return setShareError('You already added that email.');
    if (sharedWith.length >= MAX_SHARES) return setShareError(`You can share with up to ${MAX_SHARES} people.`);
    setSharedWith([...sharedWith, email]);
    setShareInput('');
    setShareError('');
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/packages`)
      .then(res => res.json())
      .then(data => setPkg(data.packages?.find(p => p.id === packageId) ?? null))
      .catch(() => setPkg(null));
  }, [packageId]);

  const handleSubmit = async () => {
    if (!referenceId.trim()) return setError('Please enter the reference number from your payment.');
    setSubmitting(true);
    setError('');
    try {
      const res = await apiFetch('/api/me/packages', {
        method: 'POST',
        body: JSON.stringify({ packageId, referenceId, receipt, sharedWith: pkg.shareable ? sharedWith : [] }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Something went wrong. Please try again.');
      setPurchase(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs font-bold text-brand-dark/60 mb-6">
          <Link to="/pricing" className="hover:text-brand-brown">Packages</Link> <span className="mx-2">&gt;</span> {pkg?.title ?? '…'}
        </div>

        {pkg === undefined ? (
          <p className="text-brand-dark/50 font-medium">Loading…</p>
        ) : pkg === null ? (
          <div className="bg-white rounded-xl border border-brand-sand/30 p-8 text-center">
            <p className="font-medium text-brand-dark mb-4">We couldn't find that package.</p>
            <Link to="/pricing" className="text-brand-brown font-bold underline">See all packages</Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-sans font-bold text-brand-dark mb-2">{purchase ? 'Purchase received' : 'Buy this package'}</h1>
            {!purchase && <p className="text-brand-dark/60 mb-8">Pay by BPI or GCash, send us the reference number, and we'll activate it once we've checked the payment.</p>}
            {purchase && <div className="mb-8" />}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
              <section className="w-full lg:w-[360px] order-first lg:order-last shrink-0">
                <div className="bg-white rounded-3xl border border-brand-sand/50 shadow-md p-6 sm:p-8 lg:sticky lg:top-32">
                  {pkg.subtitle && <p className="text-[11px] font-bold uppercase tracking-widest text-[#3B657F] mb-2">{pkg.subtitle}</p>}
                  <h2 className="text-xl font-bold text-brand-dark mb-1">{pkg.title}</h2>
                  <p className="text-sm text-brand-dark/70">{creditsSummary(pkg)}</p>
                  {pkg.description && <p className="text-sm text-brand-dark/60 mt-1">{pkg.description}</p>}
                  <p className="text-4xl font-sans text-brand-dark my-6">{formatPeso(pkg.price)}</p>
                  <ul className="space-y-3 text-sm text-brand-dark/80">
                    {pkg.unlimited && (
                      <li className="flex items-center gap-3">
                        <Package size={18} className="text-brand-dark/40 shrink-0" />
                        {creditLabel('unlimited')}, both branches
                      </li>
                    )}
                    {Object.entries(pkg.credits).map(([type, count]) => (
                      <li key={type} className="flex items-center gap-3">
                        <Package size={18} className="text-brand-dark/40 shrink-0" />
                        {count} × {creditLabel(type).toLowerCase()}
                      </li>
                    ))}
                    <li className="flex items-center gap-3">
                      <CalendarClock size={18} className="text-brand-dark/40 shrink-0" />
                      {validityText(pkg)}
                    </li>
                  </ul>
                  {pkg.shareable && (
                    <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3B657F] bg-[#3B657F]/10 px-3 py-1.5 rounded-full">
                      <Users size={14} /> Shareable
                    </p>
                  )}
                </div>
              </section>

              <div className="flex-1 min-w-0">
                {purchase ? (
                  <section role="status" className="bg-white rounded-xl border border-brand-sand/50 shadow-sm p-6 sm:p-8">
                    <p className="text-brand-dark/80 mb-3">
                      Thanks! The studio will check your payment (reference <strong className="text-brand-dark">{purchase.referenceId}</strong>) and activate your package. We'll email you when it's ready.
                    </p>
                    <p className="text-brand-dark/80 mb-6">
                      Once active, choose <strong className="text-brand-dark">Current Packages</strong> when you book a class to use a credit.
                    </p>
                    {purchase.sharedWith?.length > 0 && (
                      <p className="text-brand-dark/80 mb-6">
                        Shared with <strong className="text-brand-dark">{purchase.sharedWith.join(', ')}</strong>. It will show in their account when they sign in with that email, and we'll email them once it's active.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <Link to="/dashboard?tab=packages" className="bg-brand-brown text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors">My packages</Link>
                      <Link to="/book" className="px-6 py-3 rounded-xl font-bold text-brand-dark border border-brand-sand hover:bg-black/5 transition-colors">See the schedule</Link>
                    </div>
                  </section>
                ) : (
                  <div className="flex flex-col gap-6">
                    <Step number={1} title="Your account">
                      <p className="text-sm text-brand-dark/70">
                        Buying as <strong className="text-brand-dark break-all">{user?.email}</strong>. The package goes into this account.
                      </p>
                    </Step>

                    {pkg.shareable && (
                      <Step number={2} title="Share it (optional)">
                        <p className="text-sm text-brand-dark/70 mb-4">
                          Add the email of anyone who will use this package with you, up to {MAX_SHARES} people. It shows in their account as soon as they sign in or sign up with that email, and they can book with its credits.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <label htmlFor="share-email" className="sr-only">Email to share with</label>
                          <input
                            id="share-email"
                            type="email"
                            value={shareInput}
                            onChange={(e) => { setShareInput(e.target.value); setShareError(''); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addShare(); } }}
                            disabled={sharedWith.length >= MAX_SHARES}
                            placeholder="friend@example.com"
                            className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-brand-sand focus:outline-none focus:border-brand-brown bg-white disabled:bg-brand-sand/10"
                          />
                          <button
                            type="button"
                            onClick={addShare}
                            disabled={!shareInput.trim() || sharedWith.length >= MAX_SHARES}
                            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-brand-dark text-white hover:bg-black transition-colors disabled:opacity-40"
                          >
                            <UserPlus size={16} /> Add
                          </button>
                        </div>
                        {shareError && <p role="alert" className="mt-2 text-sm font-medium text-[#E02424]">{shareError}</p>}
                        {sharedWith.length > 0 && (
                          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Sharing with">
                            {sharedWith.map(email => (
                              <li key={email} className="flex items-center gap-2 max-w-full bg-brand-sand/20 border border-brand-sand/50 rounded-full pl-4 pr-1.5 py-1.5 text-sm text-brand-dark">
                                <span className="truncate">{email}</span>
                                <button type="button" onClick={() => setSharedWith(sharedWith.filter(e => e !== email))} aria-label={`Remove ${email}`} className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-brand-dark/50 hover:bg-black/10 hover:text-brand-dark">
                                  <X size={14} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </Step>
                    )}

                    <Step number={pkg.shareable ? 3 : 2} title={`Pay ${formatPeso(pkg.price)}`}>
                      <p className="text-sm text-brand-dark/70 mb-5 flex gap-2">
                        <Check size={18} className="text-brand-dark/40 shrink-0" />
                        {pkg.startsOn === 'first-booking' ? 'The validity period starts with the first booking.' : 'The validity period starts when the studio activates your package.'}
                      </p>
                      <PaymentUploadPanel
                        referenceId={referenceId}
                        onReferenceChange={setReferenceId}
                        receipt={receipt}
                        onReceiptChange={setReceipt}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        error={error}
                        submitLabel="Submit Purchase"
                        embedded
                      />
                    </Step>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
