import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ''
  });
  const [status, setStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setPreviewUrl('');
    
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setStatus(data.error || 'Failed to send link');
      } else {
        setStatus(data.message);
        if (data.previewUrl) setPreviewUrl(data.previewUrl);
      }
    } catch (err) {
      console.error(err);
      setStatus('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-32 pt-32 pb-20">
        
        {/* Left Side */}
        <div className="flex-1 w-full max-w-lg">
           <h1 className="text-5xl md:text-[54px] text-brand-dark mb-4 font-serif">
             My <span className="italic font-normal">account.</span>
           </h1>
           <p className="text-brand-dark/70 text-sm md:text-base font-medium mb-8 max-w-md leading-relaxed">
             Password-free sign-in. Use the same email you booked with.
           </p>
           
           <ul className="space-y-5 text-[13px] md:text-sm text-brand-dark/70 font-medium leading-relaxed max-w-md">
             <li className="flex gap-2">
               <span className="text-brand-dark font-bold">•</span>
               <span><strong className="text-brand-dark">Buy a class pack:</strong> on the book page or below after you sign in. The studio can also assign credits.</span>
             </li>
             <li className="flex gap-2">
               <span className="text-brand-dark font-bold">•</span>
               <span><strong className="text-brand-dark">Book a class:</strong> each group class uses one credit.</span>
             </li>
             <li className="flex gap-2">
               <span className="text-brand-dark font-bold">•</span>
               <span><strong className="text-brand-dark">Enter your email:</strong> we'll send a one-time link to manage bookings.</span>
             </li>
           </ul>
        </div>
        
        {/* Right Side Card */}
        <div className="w-full max-w-md bg-white rounded-[20px] p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-brand-dark/5">
          <h2 className="text-[28px] font-serif text-brand-dark mb-8">Sign in</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div>
              <label className="block text-[#4A1D1D] font-bold text-[10px] tracking-widest uppercase mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-[#F5F2ED] border border-[#E8E2D9] rounded-[10px] px-5 py-3.5 text-brand-dark text-sm outline-none focus:border-[#4A1D1D]/30 transition-colors placeholder:text-brand-dark/40"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A1D1D] text-white font-bold text-[11px] uppercase tracking-widest py-4 rounded-full mt-2 hover:bg-[#3A1414] transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send sign-in link'}
            </button>
            
            {status && (
              <div className="mt-4 text-center text-sm font-medium text-brand-dark/80">
                {status}
                {previewUrl && (
                  <div className="mt-2">
                    <a href={previewUrl} target="_blank" rel="noreferrer" className="text-brand-brown underline hover:text-brand-dark">
                      Click here to view the test email (Ethereal)
                    </a>
                  </div>
                )}
              </div>
            )}
          </form>
          
          <div className="mt-8 pt-8 border-t border-brand-dark/10 text-center text-[12px] text-brand-dark/60 font-medium">
            Need credits first? <Link to="/packages" className="text-brand-dark hover:text-brand-brown underline underline-offset-4 decoration-brand-dark/30 hover:decoration-brand-brown">Buy a class pack</Link> · <Link to="/book" className="text-brand-dark hover:text-brand-brown underline underline-offset-4 decoration-brand-dark/30 hover:decoration-brand-brown">Book a class</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
