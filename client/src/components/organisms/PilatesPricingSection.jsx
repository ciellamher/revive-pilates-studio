import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../api/base';
import { formatPeso, validityText, creditsSummary, PACKAGE_CATEGORIES } from '../../api/packages';

// The same catalog as the Pricing page, from the server.

function PackageCard({ pkg }) {
  return (
    <div className="relative bg-[#D8CFC4] flex flex-col items-center text-center pb-8 pt-0 shadow-sm transition-transform hover:-translate-y-1 h-full">
      <div className="w-full h-4 bg-[#3A2A20] mb-8 shrink-0"></div>
      
      {pkg.isIntro && (
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#FCE38A] rounded-full flex items-center justify-center rotate-[-15deg] shadow-sm z-10" style={{ clipPath: 'polygon(50% 0%, 61% 11%, 76% 7%, 83% 21%, 98% 25%, 95% 40%, 100% 55%, 89% 66%, 86% 81%, 71% 84%, 60% 98%, 45% 92%, 31% 100%, 22% 86%, 7% 81%, 12% 66%, 0% 52%, 9% 38%, 3% 23%, 18% 18%, 24% 3%)' }}>
          <span className="text-[12px] font-bold text-[#3A2A20] leading-tight px-2">Intro<br/>Offer!</span>
        </div>
      )}
      
      <div className="flex flex-col flex-grow w-full px-8">
        <div className="min-h-[20px] mb-3">
          {pkg.subtitle && (
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#3A2A20]/80">{pkg.subtitle}</p>
          )}
        </div>
        <h3 className="text-[16px] font-medium text-[#3A2A20] mb-2">{pkg.title}</h3>
        <p className="text-[13px] text-[#3A2A20]/80 mb-2">{creditsSummary(pkg)}</p>
        {pkg.description && (
          <p className="text-[12px] text-[#3A2A20]/70 mb-2">{pkg.description}</p>
        )}
        
        <div className="flex justify-center items-end gap-1 my-6 flex-grow">
          <span className="text-4xl md:text-[54px] font-sans text-[#3A2A20] leading-none">{formatPeso(pkg.price)}</span>
        </div>
        
        {pkg.originalPrice && (
          <p className="text-[13px] text-[#3A2A20]/60 line-through mb-2">Value: {formatPeso(pkg.originalPrice)}</p>
        )}
        
        <div className="mt-auto pt-2 flex flex-col items-center shrink-0 w-full">
          <p className="text-[12px] italic text-[#3A2A20]/70 mb-4 h-[36px] flex items-center">
            {pkg.expiryDays ? `${validityText(pkg)}.` : ' '}
          </p>
          
          <div className="min-h-[18px] mb-6 flex items-center justify-center">
            {pkg.shareable && (
              <p className="text-[12px] text-[#3A2A20]/60 uppercase tracking-wider font-semibold">Shareable</p>
            )}
          </div>
          
          <Link to={`/buy/${pkg.id}`} className="flex justify-center items-center border border-[#3A2A20] text-[#3A2A20] hover:bg-[#3A2A20] hover:text-[#F5F2ED] px-8 py-2 text-[14px] font-medium transition-colors bg-transparent w-full">
            Buy now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PilatesPricingSection() {
  const [activeTab, setActiveTab] = useState('Starter Packages');
  const tabs = PACKAGE_CATEGORIES;
  const [packages, setPackages] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/packages`)
      .then(res => res.json())
      .then(data => setPackages(data.packages ?? []))
      .catch(() => setPackages([]));
  }, []);

  return (
    <section className="w-full bg-brand-beige pt-8 pb-24" id="packages">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-4xl md:text-5xl font-sans font-medium text-brand-dark mb-16">Packages</h2>
        
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 relative">
          {packages === null ? (
            <p className="col-span-full text-brand-dark/50 font-medium">Loading packages…</p>
          ) : packages.filter(p => p.category === activeTab).map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

      </div>
    </section>
  );
}
