import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login and redirect
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center pt-32 pb-24 px-4 sm:px-6">
        
        {/* Top Header */}
        <div className="text-center mb-16 max-w-2xl w-full">
          <h1 className="text-4xl md:text-5xl text-brand-dark mb-4 font-serif font-medium tracking-tight">Log In to Revive Studio</h1>
          <p className="text-brand-dark/70 text-sm md:text-base font-medium">Access your dashboard by completing the form below.</p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl text-brand-dark mb-2 font-serif font-medium tracking-tight">
            1. Account Details
          </h2>
          <p className="text-brand-dark/70 text-sm mb-12 font-medium">Please enter your credentials to access your account.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Email Field */}
              <div className="flex-1">
                <label className="block text-brand-dark/80 text-[15px] font-bold mb-3">
                  Email <span className="text-brand-brown">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-brand-brown/20 rounded-[32px] px-6 py-4 text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark transition-all shadow-sm"
                />
                <p className="text-brand-dark/50 text-xs mt-3 ml-2 font-medium">example@example.com</p>
              </div>

              {/* Password Field */}
              <div className="flex-1">
                <label className="block text-brand-dark/80 text-[15px] font-bold mb-3">
                  Password <span className="text-brand-brown">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border border-brand-brown/20 rounded-[32px] px-6 py-4 text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark transition-all shadow-sm"
                />
                <p className="text-brand-dark/50 text-xs mt-3 ml-2 font-medium">Must be at least 8 characters.</p>
              </div>
            </div>

            <div className="pt-8 flex flex-col items-center gap-6">
              <button
                type="submit"
                className="px-12 py-4 bg-brand-dark text-white rounded-[32px] font-medium tracking-wide hover:bg-brand-brown transition-colors shadow-md text-sm uppercase w-full md:w-auto"
              >
                Log In
              </button>
              <Link to="/register" className="text-brand-dark/70 text-sm font-medium hover:text-brand-dark transition-colors">
                Don't have an account? Sign up
              </Link>
            </div>
            
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
