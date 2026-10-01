import { useState } from 'react';
import studioEmpty1Img from '../../assets/revive-photos/studio_empty_1.jpg';
import { API_BASE } from '../../api/base';

export default function NewsletterSection() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  // Signs the visitor up for studio news (the "Deals and promotions" emails).
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });
    try {
      const res = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Something went wrong. Please try again.');
      setStatus({ state: 'done', message: data.message });
      setForm({ firstName: '', lastName: '', email: '' });
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <section className="relative w-full min-h-[700px] flex items-center justify-center pt-32 pb-24 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={studioEmpty1Img} alt="Studio background" className="w-full h-full object-cover" />
      </div>

      {/* Wavy Top Divider to match the section above (bg-[#F5F2ED]) */}
      <svg 
        viewBox="0 0 1440 150" 
        className="absolute top-0 left-0 w-full z-10" 
        preserveAspectRatio="none" 
        style={{ height: '8vw', minHeight: '60px' }}
      >
        <path 
          d="M0,60 C320,-40 720,180 1440,20 L1440,0 L0,0 Z" 
          fill="#F5F2ED" 
        />
      </svg>

      {/* Form Card */}
      <div className="relative z-20 bg-[#E8E4D9] p-8 md:p-12 w-[90%] max-w-[600px] shadow-2xl rounded-[32px]">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3A2A20] mb-2 font-sans">
          Let's Make It Official.
        </h2>
        <p className="text-[#3A2A20]/80 text-sm mb-8 font-sans">
          Sign up for early access, studio news, and all things Revive.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="news-first" className="block text-xs font-bold text-[#3A2A20] mb-2 px-1">First Name *</label>
              <input 
                id="news-first"
                type="text" 
                required
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full bg-[#F5F2ED] border border-gray-300 rounded-full px-5 py-3 text-sm outline-none focus:border-[#516B84] transition-colors"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="news-last" className="block text-xs font-bold text-[#3A2A20] mb-2 px-1">Last Name *</label>
              <input 
                id="news-last"
                type="text" 
                required
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full bg-[#F5F2ED] border border-gray-300 rounded-full px-5 py-3 text-sm outline-none focus:border-[#516B84] transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="news-email" className="block text-xs font-bold text-[#3A2A20] mb-2 px-1">Email *</label>
            <input 
              id="news-email"
              type="email" 
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#F5F2ED] border border-gray-300 rounded-full px-5 py-3 text-sm outline-none focus:border-[#516B84] transition-colors"
            />
          </div>

          {status.message && (
            <p role={status.state === 'error' ? 'alert' : 'status'} className={`text-sm font-medium px-1 ${status.state === 'error' ? 'text-[#E02424]' : 'text-green-700'}`}>
              {status.message}
            </p>
          )}

          <button 
            type="submit" 
            disabled={status.state === 'sending'}
            className="w-full mt-4 disabled:opacity-60 bg-[#516B84] text-white py-3 md:py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#3A4E63] transition-colors shadow-sm"
          >
            {status.state === 'sending' ? 'Sending…' : 'Submit'}
          </button>
        </form>
      </div>

    </section>
  );
}
