import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Package, CalendarClock } from 'lucide-react';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import PaymentUploadPanel from '../components/organisms/PaymentUploadPanel';
import { API_BASE, apiFetch } from '../api/base';
import { formatPeso, expiryLabel, creditLabel } from '../api/packages';

// Buying a package: pay by GCash or BPI, send the reference number, and the
// studio activates the package once it has checked the payment.
export default function BuyPackage() {
  const { packageId } = useParams();
  const [pkg, setPkg] = useState(undefined); // undefined = loading, null = not found
  const [referenceId, setReferenceId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [purchase, setPurchase] = useState(null);

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
        body: JSON.stringify({ packageId, referenceId }),
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
            <h1 className="text-3xl font-sans font-bold text-brand-dark mb-8">{purchase ? 'Purchase received' : 'Buy this package'}</h1>
            <div className="flex flex-col lg:flex-row gap-10">
              <section className="w-full lg:w-[360px] order-first lg:order-last shrink-0">
                <div className="bg-white rounded-3xl border border-brand-sand/50 shadow-md p-6 sm:p-8 lg:sticky lg:top-32">
                  {pkg.subtitle && <p className="text-[11px] font-bold uppercase tracking-widest text-[#3B657F] mb-2">{pkg.subtitle}</p>}
                  <h2 className="text-xl font-bold text-brand-dark mb-1">{pkg.title}</h2>
                  {pkg.sessions && <p className="text-sm text-brand-dark/70">{pkg.sessions}</p>}
                  <p className="text-4xl font-sans text-brand-dark my-6">{formatPeso(pkg.price)}</p>
                  <ul className="space-y-3 text-sm text-brand-dark/80">
                    {Object.entries(pkg.credits).map(([type, count]) => (
                      <li key={type} className="flex items-center gap-3">
                        <Package size={18} className="text-brand-dark/40 shrink-0" />
                        {count} × {creditLabel(type)} {count === 1 ? 'session' : 'sessions'}
                      </li>
                    ))}
                    <li className="flex items-center gap-3">
                      <CalendarClock size={18} className="text-brand-dark/40 shrink-0" />
                      Valid for {expiryLabel(pkg.expiryDays)} from activation
                    </li>
                  </ul>
                  {pkg.note && <p className="mt-4 text-xs uppercase tracking-wider font-semibold text-brand-dark/50">{pkg.note}</p>}
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
                    <div className="flex flex-wrap gap-3">
                      <Link to="/dashboard?tab=packages" className="bg-brand-brown text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors">My packages</Link>
                      <Link to="/book" className="px-6 py-3 rounded-xl font-bold text-brand-dark border border-brand-sand hover:bg-black/5 transition-colors">See the schedule</Link>
                    </div>
                  </section>
                ) : (
                  <>
                    <p className="text-brand-dark/70 mb-6">
                      Send {formatPeso(pkg.price)} by BPI or GCash, then enter the reference number from your receipt. The validity period starts when the studio activates your package.
                    </p>
                    <PaymentUploadPanel
                      referenceId={referenceId}
                      onReferenceChange={setReferenceId}
                      onSubmit={handleSubmit}
                      submitting={submitting}
                      error={error}
                      submitLabel="Submit Purchase"
                    />
                  </>
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
