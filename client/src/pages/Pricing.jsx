import { useState } from 'react';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import { Link } from 'react-router-dom';

const PRICING_DATA = {
  'Starter Packages': [
    { title: 'Revive Starter', sessions: '1 Private + 3 Group', price: '₱5,220', originalPrice: '₱5,800', expiry: '1 month', note: 'Not shareable' },
    { title: 'Intro Boost', sessions: '3 Private + 2 Group', price: '₱7,380', originalPrice: '₱8,200', expiry: '1 month', note: 'Not shareable', isIntro: true },
    { title: 'Trial One', sessions: '1 Private + 1 Group', price: '₱3,240', originalPrice: '₱3,600', expiry: '14 days', note: 'Not shareable' },
    { title: 'Trial Two', sessions: '2 Reformer + 2 Mat Group', price: '₱2,880', originalPrice: '₱3,198', expiry: '1 month', note: 'Not shareable' },
  ],
  'Group Classes': [
    { subtitle: 'Reformer Group Classes', title: 'Single Session', price: '₱1,100', expiry: '30 days' },
    { subtitle: 'Reformer Group Classes', title: '5-Session Package', price: '₱5,250', expiry: '1 month' },
    { subtitle: 'Reformer Group Classes', title: '10-Session Package', price: '₱10,000', expiry: '2 months' },
    { subtitle: 'Reformer Group Classes', title: '22-Session Package', price: '₱20,000', expiry: '4 months' },
    { subtitle: 'Reformer Group Classes', title: '36-Session Package', price: '₱32,000', expiry: '6 months' },
    { subtitle: 'Mat/Barre Group Classes', title: 'Single Session', price: '₱500', expiry: '30 days' },
    { subtitle: 'Mat/Barre Group Classes', title: '5-Session Package', price: '₱2,375', expiry: '2 months' },
    { subtitle: 'Mat/Barre Group Classes', title: '10-Session Package', price: '₱4,500', expiry: '4 months' },
    { subtitle: 'Mat/Barre Group Classes', title: '20-Session Package', price: '₱8,500', expiry: '8 months' },
    { subtitle: 'Mat/Barre Group Classes', title: '30-Session Package', price: '₱12,000', expiry: '12 months' },
  ],
  'Private Classes': [
    { subtitle: 'Private Classes', title: 'Single Session', price: '₱2,500', expiry: '30 days' },
    { subtitle: 'Private Classes', title: 'Intro Class', sessions: '3-Session Package For First Timers', price: '₱6,000', expiry: '1 month', isIntro: true },
    { subtitle: 'Private Classes', title: '8-Session Package', price: '₱19,000', expiry: '2 months' },
    { subtitle: 'Private Classes', title: '12-Session Package', price: '₱27,600', expiry: '3 months' },
    { subtitle: 'Duo Private Classes', title: 'Duo Private Session', price: '₱2,200', note: 'per pax', expiry: '30 days' },
    { subtitle: 'Duo Private Classes', title: '8-Session Package', price: '₱17,000', note: 'per pax', expiry: '2 months' },
    { subtitle: 'Duo Private Classes', title: '12-Session Package', price: '₱24,000', note: 'per pax', expiry: '3 months' },
    { subtitle: 'Trio Private Classes', title: 'Trio Private Session', price: '₱2,000', note: 'per pax', expiry: '30 days' },
    { subtitle: 'Trio Private Classes', title: '8-Session Package', price: '₱15,500', note: 'per pax', expiry: '2 months' },
    { subtitle: 'Trio Private Classes', title: '12-Session Package', price: '₱22,500', note: 'per pax', expiry: '3 months' },
  ],
  'Clinical Pilates': [
    { title: 'Single Session', price: '₱2,800', expiry: '30 days' },
    { title: '8-Session Package', price: '₱22,000', expiry: '2 months' },
    { title: '12-Session Package', price: '₱32,000', expiry: '3 months' },
    { subtitle: 'Additional Services', title: 'Dry Needling', price: '₱500' }
  ]
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
          <span className="text-4xl md:text-[54px] font-sans text-[#3A2A20] leading-none">{pkg.price}</span>
        </div>
        
        {pkg.originalPrice && (
          <p className="text-[13px] text-[#3A2A20]/60 line-through mb-2">Value: {pkg.originalPrice}</p>
        )}
        
        <div className="mt-auto pt-4 flex flex-col items-center gap-5 shrink-0">
          {pkg.expiry && (
            <p className="text-[13px] italic text-[#3A2A20]/70">Expires {pkg.expiry} after purchase.</p>
          )}
          {pkg.note && (
            <p className="text-[12px] text-[#3A2A20]/60 uppercase tracking-wider font-semibold">*{pkg.note}*</p>
          )}
          
          <Link to="/checkout" className="mt-2 border border-[#3A2A20] text-[#3A2A20] hover:bg-[#3A2A20] hover:text-white px-10 py-2.5 text-[15px] font-medium transition-colors w-fit bg-transparent">
            Buy now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('Starter Packages');
  const tabs = Object.keys(PRICING_DATA);

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
            {PRICING_DATA[activeTab].map((pkg, idx) => (
              <PackageCard key={idx} pkg={pkg} />
            ))}
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
