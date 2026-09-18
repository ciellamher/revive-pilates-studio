import { Menu, User, Calendar, BookOpen, Package, Award, Receipt, Bell, FileText, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoImg from '../../assets/logo.png';
import logoTextImg from '../../assets/logo_text.png';

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-[#ECE7DC] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[90px] items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center overflow-hidden">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group" onClick={() => setMobileMenuOpen(false)}>
              <img src={logoImg} alt="Revive Studio Logo Icon" className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0" />
              <img src={logoTextImg} alt="Revive Studio Pilates" className="h-6 sm:h-10 object-contain shrink-0" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-10 items-center mr-8">
            {!isAdmin && (
              <>
                <Link to="/" className="text-[#3a2f2a] hover:opacity-70 font-semibold text-[15px] transition-opacity">
                  About
                </Link>
                <Link to="/pilates" className="text-[#3a2f2a] hover:opacity-70 font-semibold text-[15px] transition-opacity">
                  Pilates
                </Link>
                <Link to="/book" className="text-[#3a2f2a] hover:opacity-70 font-semibold text-[15px] transition-opacity">
                  Schedule
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-2"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-brown flex items-center justify-center text-brand-beige font-bold text-lg border border-brand-sand/50 shadow-sm">
                    G
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-brand-dark leading-tight">Graciella</p>
                  </div>
                  <ChevronDown size={14} className="text-brand-dark/50" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-[#2A180E] rounded-xl shadow-xl py-3 border border-[#433B38] text-white z-50 animate-fade-in">
                    <Link to="/dashboard" className="flex items-center gap-4 px-5 py-2.5 hover:bg-white/10 transition-colors text-[15px] font-medium">
                      <User size={18} className="text-white" /> My profile
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-4 px-5 py-2.5 hover:bg-white/10 transition-colors text-[15px] font-medium">
                      <Calendar size={18} className="text-white" /> My schedule
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-4 px-5 py-2.5 hover:bg-white/10 transition-colors text-[15px] font-medium">
                      <BookOpen size={18} className="text-white" /> My courses
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-4 px-5 py-2.5 hover:bg-white/10 transition-colors text-[15px] font-medium">
                      <Package size={18} className="text-white" /> My packages
                    </Link>
                    
                    <hr className="border-white/10 my-3 mx-5" />
                    
                    <Link to="/dashboard" className="flex items-center gap-4 px-5 py-2.5 hover:bg-white/10 transition-colors text-[15px] font-medium">
                      <Bell size={18} className="text-white" /> Notification settings
                    </Link>
                    
                    <hr className="border-white/10 my-3 mx-5" />
                    
                    <button onClick={() => { setIsLoggedIn(false); setDropdownOpen(false); }} className="w-full flex items-center gap-4 px-5 py-2.5 hover:bg-white/10 transition-colors text-[15px] font-medium text-left">
                      <LogOut size={18} className="text-white" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/register" className="flex items-center gap-2 bg-brand-brown text-brand-beige px-5 py-2.5 rounded-full font-medium hover:bg-brand-dark transition-all shadow-sm hover:shadow">
                  <User size={18} />
                  <span>Log In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="text-brand-dark hover:text-brand-brown p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <ChevronDown size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#ECE7DC] border-t border-brand-sand/50 px-4 py-4 space-y-3 shadow-lg absolute w-full top-[90px] left-0">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-brand-dark font-medium hover:bg-brand-sand/30 rounded-lg">About</Link>
          <Link to="/pilates" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-brand-dark font-medium hover:bg-brand-sand/30 rounded-lg">Pilates</Link>
          <Link to="/book" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-brand-dark font-medium hover:bg-brand-sand/30 rounded-lg">Schedule</Link>
          
          <div className="pt-4 border-t border-brand-sand/50">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-brown flex items-center justify-center text-brand-beige font-bold text-sm">G</div>
                  <span className="font-medium text-brand-dark">Graciella</span>
                </div>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-brand-dark hover:bg-brand-sand/30 rounded-lg"><User size={18} /> Dashboard</Link>
                <button onClick={() => { setIsLoggedIn(false); setMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-brand-dark hover:bg-brand-sand/30 rounded-lg"><LogOut size={18} /> Logout</button>
              </div>
            ) : (
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-brand-brown text-brand-beige px-4 py-3 rounded-full font-medium w-full">
                <User size={18} /> Log In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
