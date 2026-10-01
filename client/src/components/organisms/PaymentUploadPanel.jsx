import { useEffect, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { API_BASE } from '../../api/base';
import { imageFileToDataUrl } from '../../api/image';

// The accounts to pay into come from the admin's Studio Settings.
function useStudioPayment() {
  const [payment, setPayment] = useState(null);
  useEffect(() => {
    fetch(`${API_BASE}/api/settings/payment`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => setPayment(data?.payment ?? null))
      .catch(() => setPayment(null));
  }, []);
  return payment;
}

function AccountCard({ badge, badgeClass, bank, name, number, qr }) {
  return (
    <div className="bg-brand-sand/10 p-4 rounded-xl border border-brand-sand flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${badgeClass}`}>{badge}</div>
        <h4 className="font-bold text-brand-dark leading-tight">{bank}</h4>
      </div>
      {qr && (
        <div className="flex-1 flex items-center justify-center mb-4">
          <div className="w-36 h-36 bg-white rounded-xl shadow-sm border border-brand-sand overflow-hidden flex items-center justify-center p-2">
            <img src={qr} alt={`${bank} QR code`} className="w-full h-full object-contain" />
          </div>
        </div>
      )}
      <div className="text-center mt-auto">
        <p className="text-sm text-brand-dark/80">{name}</p>
        <p className="text-sm font-bold text-brand-dark tracking-wider select-all">{number}</p>
      </div>
    </div>
  );
}

export default function PaymentUploadPanel({ referenceId = '', onReferenceChange = () => {}, receipt = null, onReceiptChange = () => {}, onSubmit = () => {}, submitting = false, error = '', submitLabel = 'Submit Booking', embedded = false }) {
  const payment = useStudioPayment();
  const [receiptError, setReceiptError] = useState('');
  const [readingReceipt, setReadingReceipt] = useState(false);

  const handleReceiptFile = async (file) => {
    if (!file) return;
    setReceiptError('');
    setReadingReceipt(true);
    try {
      onReceiptChange(await imageFileToDataUrl(file));
    } catch (err) {
      setReceiptError(err.message);
    } finally {
      setReadingReceipt(false);
    }
  };

  return (
    // embedded: inside a page section that has its own card and heading.
    <div className={embedded ? 'space-y-6' : 'bg-white rounded-2xl p-6 border border-brand-sand/30 shadow-sm space-y-6'}>
      {!embedded && <h3 className="font-serif text-2xl font-bold text-brand-dark">Payment Details</h3>}
      
      {payment ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AccountCard badge="BPI" badgeClass="bg-brand-dark text-brand-beige" bank="Bank of the Philippine Islands" name={payment.bpiName} number={payment.bpiNumber} qr={payment.bpiQr} />
          <AccountCard badge="G" badgeClass="bg-blue-500 text-white" bank="GCash" name={payment.gcashName} number={payment.gcashNumber} qr={payment.gcashQr} />
        </div>
      ) : (
        <p className="text-sm text-brand-dark/50">Loading payment details…</p>
      )}

      <div className="space-y-4 pt-4 border-t border-brand-sand/30">
        <div>
          <label htmlFor="payment-reference" className="block text-sm font-semibold text-brand-dark mb-2">Payment Reference Number</label>
          <input
            id="payment-reference"
            type="text"
            maxLength={60}
            value={referenceId}
            onChange={(e) => onReferenceChange(e.target.value)}
            placeholder="From your GCash or BPI receipt"
            className="w-full px-3 py-2 rounded-lg border border-brand-sand focus:outline-none focus:border-brand-brown bg-white"
          />
        </div>

        <div>
          <p className="block text-sm font-semibold text-brand-dark mb-2">Proof of Payment <span className="font-normal text-brand-dark/50">(screenshot of your receipt)</span></p>
          {receipt ? (
            <div className="flex items-center gap-4 border border-brand-sand rounded-xl p-3">
              <img src={receipt} alt="Your receipt" className="w-16 h-16 object-cover rounded-lg border border-brand-sand/50" />
              <p className="flex-1 text-sm text-brand-dark/80">Receipt attached</p>
              <button type="button" onClick={() => onReceiptChange(null)} aria-label="Remove receipt" className="p-2 rounded-lg text-brand-dark/60 hover:bg-black/5 hover:text-brand-dark transition-colors">
                <X size={18} />
              </button>
            </div>
          ) : (
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleReceiptFile(e.dataTransfer.files?.[0]); }}
              className="border-2 border-dashed border-brand-sand rounded-xl p-8 flex flex-col items-center justify-center text-brand-dark/60 hover:bg-brand-beige/30 hover:border-brand-brown focus-within:border-brand-brown transition-colors cursor-pointer"
            >
              <UploadCloud size={32} className="mb-2" />
              <span className="font-medium">{readingReceipt ? 'Preparing image…' : 'Browse Files'}</span>
              <span className="text-xs">or drag and drop an image here</span>
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => { handleReceiptFile(e.target.files?.[0]); e.target.value = ''; }} />
            </label>
          )}
          {receiptError && <p role="alert" className="mt-2 text-sm font-medium text-[#E02424]">{receiptError}</p>}
        </div>
      </div>

      {error && <p role="alert" className="text-sm font-medium text-[#E02424]">{error}</p>}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting || readingReceipt}
        className="w-full bg-brand-brown text-white py-4 rounded-xl font-medium text-lg hover:bg-brand-dark transition-colors shadow-md disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : submitLabel}
      </button>
    </div>
  );
}
