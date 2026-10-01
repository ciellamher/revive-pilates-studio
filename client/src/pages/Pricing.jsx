import { useState, useEffect } from 'react';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import { Link } from 'react-router-dom';
import { API_BASE } from '../api/base';
import { formatPeso, expiryLabel } from '../api/packages';

const CATEGORIES = ['Starter Packages', 'Group Classes', 'Private Classes', 'Clinical Pilates'];

// Services the studio offers that are not bought as a package online.
const EXTRAS = {
  'Clinical Pilates': [{ id: 'dry-needling', subtitle: 'Additional Services', title: 'Dry Needling', price: 500, askStudio: true }],
};

function PackageCard({ pkg }) {
  return (
    <div className="relative bg-[#CED4D3] flex flex-col items-center text-center pb-8 pt-0 shadow-sm transition-transform hover:-translate-y-1 h-full">
      <div className="w-full h-4 bg-[#3B657F] mb-8 shrink-0"></div>
      
      {pkg.isIntro && (
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#FCE38A] rounded-full flex items-center justify-center rotate-[-15deg] shadow-sm z-10" style={{ clipPath: 'polygon(50% 0%, 61% 11%, 76% 7%, 83% 21%, 98% 25%, 95% 40%, 100% 55%, 89% 66%, 86% 81%, 71% 84%, 60% 98%, 45% 92%, 31% 100%, 22% 86%, 7% 81%, 12% 66%, 0% 52%, 9% 38%, 3% 23%, 18% 18%, 24% 3%)' }}>
          <span className="text-[12px] font-bold text-[#3A2A20] leading-tight px-2">Intro<br/>Offer!</span>
        </div>
      )}
      
      <div className="flex flex-col flex-grow w-full px-8">
        {pkg.subtitle && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#3B657F] mb-3">{pkg.subtitle}</p>
        )}
        <h3 className="text-[16px] font-medium text-[#3A2A20] mb-2">{pkg.title}</h3>
        {pkg.sessions && (
          <p className="text-[13px] text-[#3A2A20]/80 mb-2">{pkg.sessions}</p>
        )}
        
        <div className="flex justify-center items-end gap-1 my-6 flex-grow">
          <span className="text-4xl md:text-[54px] font-sans text-[#3A2A20] leading-none">{formatPeso(pkg.price)}</span>
        </div>
        
        {pkg.originalPrice && (
          <p className="text-[13px] text-[#3A2A20]/60 line-through mb-2">Value: {formatPeso(pkg.originalPrice)}</p>
        )}
        
        <div className="mt-auto pt-4 flex flex-col items-center gap-5 shrink-0">
          {pkg.expiryDays && (
            <p className="text-[13px] italic text-[#3A2A20]/70">Expires {expiryLabel(pkg.expiryDays)} after purchase.</p>
          )}
          {pkg.note && (
            <p className="text-[12px] text-[#3A2A20]/60 uppercase tracking-wider font-semibold">*{pkg.note}*</p>
          )}
          
          {pkg.askStudio ? (
            <p className="mt-2 text-[13px] font-medium text-[#3A2A20]/70">Ask the studio when you book</p>
          ) : (
            <Link to={`/buy/${pkg.id}`} className="mt-2 border border-[#3A2A20] text-[#3A2A20] hover:bg-[#3A2A20] hover:text-white px-10 py-2.5 text-[15px] font-medium transition-colors w-fit bg-transparent">
              Buy now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('Starter Packages');
  const tabs = CATEGORIES;
  const [packages, setPackages] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/packages`)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('Could not load packages'))))
      .then(data => setPackages(data.packages))
      .catch(err => setLoadError(err.message));
  }, []);

  const shown = [...(packages ?? []).filter(p => p.category === activeTab), ...(EXTRAS[activeTab] ?? [])];

  return (
    <div className="min-h-screen bg-[#F5F2ED] font-sans pt-20 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-brand-dark mb-16 lowercase">packages</h1>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-colors ${
                  activeTab === tab 
                    ? 'bg-brand-dark text-white' 
                    : 'bg-transparent text-brand-dark hover:bg-brand-dark/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 max-w-6xl mx-auto">
            {loadError ? (
              <p className="col-span-full text-brand-dark/60 font-medium">{loadError}. Please refresh the page.</p>
            ) : packages === null ? (
              <p className="col-span-full text-brand-dark/50 font-medium">Loading packages…</p>
            ) : shown.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
