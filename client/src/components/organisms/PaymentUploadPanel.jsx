import { UploadCloud } from 'lucide-react';

export default function PaymentUploadPanel() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-brand-sand/30 shadow-sm space-y-6">
      <h3 className="font-serif text-2xl font-bold text-brand-dark">Payment Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-brand-sand/10 p-4 rounded-xl border border-brand-sand flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-brand-dark text-brand-beige rounded-full flex items-center justify-center font-bold text-xs shrink-0">BPI</div>
            <h4 className="font-bold text-brand-dark leading-tight">Bank of the Philippine Islands</h4>
          </div>
          <div className="flex-1 flex items-center justify-center mb-4">
            <div className="w-32 h-32 bg-white rounded-xl shadow-sm border border-brand-sand overflow-hidden flex items-center justify-center p-2">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RevivePilatesBPI" alt="BPI QR Code" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-brand-dark/80">Klaudine Ann Mendoza Magbuhos</p>
            <p className="text-sm font-bold text-brand-dark tracking-wider">0280001011</p>
          </div>
        </div>

        <div className="bg-brand-sand/10 p-4 rounded-xl border border-brand-sand flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">G</div>
            <h4 className="font-bold text-brand-dark">GCash</h4>
          </div>
          <div className="flex-1 flex items-center justify-center mb-4">
            <div className="w-32 h-32 bg-white rounded-xl shadow-sm border border-brand-sand overflow-hidden flex items-center justify-center p-2">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RevivePilatesGCash" alt="GCash QR Code" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-brand-dark/80">Shameel Jelaine Kehyeng</p>
            <p className="text-sm font-bold text-brand-dark tracking-wider">09283967447</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-brand-sand/30">


        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-2">Proof of Payment</label>
          <div className="border-2 border-dashed border-brand-sand rounded-xl p-8 flex flex-col items-center justify-center text-brand-dark/60 hover:bg-brand-beige/30 hover:border-brand-brown transition-colors cursor-pointer">
            <UploadCloud size={32} className="mb-2" />
            <span className="font-medium">Browse Files</span>
            <span className="text-xs">Drag and drop files here</span>
          </div>
        </div>
      </div>

      {/* Coupon Code Section */}
      <div className="bg-brand-beige/50 p-4 rounded-xl border border-brand-sand mb-6">
        <label className="block text-sm font-semibold text-brand-dark mb-2">Have a Coupon Code?</label>
        <div className="flex gap-2">
          <input type="text" placeholder="Enter code" className="flex-1 px-3 py-2 rounded-lg border border-brand-sand focus:outline-none focus:border-brand-brown, bg-white" />
          <button className="bg-brand-dark text-brand-beige px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-brown transition-colors">Apply</button>
        </div>
      </div>

      <button className="w-full bg-brand-brown text-white py-4 rounded-xl font-medium text-lg hover:bg-brand-dark transition-colors shadow-md">
        Submit Booking
      </button>
    </div>
  );
}
