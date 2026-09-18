import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import { User, Calendar, BookOpen, Package, Receipt, Bell } from 'lucide-react';
import ContactFAQSection from '../components/organisms/ContactFAQSection';
import Footer from '../components/organisms/Footer';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const MENU_ITEMS = [
    { id: 'profile', label: 'My profile', icon: User },
    { id: 'schedule', label: 'My schedule', icon: Calendar },
    { id: 'courses', label: 'My courses', icon: BookOpen },
    { id: 'packages', label: 'My packages', icon: Package },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'notifications', label: 'Notification settings', icon: Bell },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-brand-dark mb-8">My profile</h2>
            
            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 p-8 mb-6">
              <h3 className="text-xl font-bold text-brand-dark mb-6">Account information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-xs text-brand-dark/50 mb-1">Email address</p>
                  <p className="font-medium text-brand-dark flex items-center gap-2">
                    graciellamher@gmail.com
                    <span className="w-4 h-4 bg-brand-dark/20 text-white rounded-full flex items-center justify-center text-[10px] font-bold">!</span>
                  </p>
                  <p className="text-xs text-brand-dark/50 mt-2 mb-2">Communications and transactions history will be sent to this email address</p>
                  <div className="flex gap-4 text-xs font-bold text-blue-800">
                    <button className="hover:underline">Edit</button>
                    <button className="hover:underline">Resend Verification code</button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-brand-dark/50 mb-1">Mobile number</p>
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-brand-dark">+63 939 381 4296</p>
                    <button className="text-xs font-bold text-blue-800 hover:underline">Edit</button>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-brand-dark/50 mb-1">Password</p>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-brand-dark text-lg tracking-widest">**********</p>
                  <button className="text-xs font-bold text-blue-800 hover:underline">Edit</button>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-brand-dark">Personal information</h3>
                <button className="border border-brand-dark/20 rounded-full px-6 py-2 text-sm font-medium hover:bg-brand-sand/10 transition-colors">Edit</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                <div>
                  <p className="text-xs text-brand-dark/50 mb-1">Name</p>
                  <p className="font-medium text-brand-dark">Graciella Jimenez</p>
                </div>
                <div></div>
                <div>
                  <p className="text-xs text-brand-dark/50 mb-1">Date Of Birth</p>
                  <p className="font-medium text-brand-dark">17 Jul 2004</p>
                </div>
                <div></div>
                <div>
                  <p className="text-xs text-brand-dark/50 mb-1">Gender</p>
                  <p className="font-medium text-brand-dark">Female</p>
                </div>
                <div>
                  <p className="text-xs text-brand-dark/50 mb-1">Country</p>
                  <p className="font-medium text-brand-dark">--</p>
                </div>
                <div>
                  <p className="text-xs text-brand-dark/50 mb-1">Address</p>
                  <p className="font-medium text-brand-dark">--</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'schedule':
        return (
          <div className="animate-fade-in h-full flex flex-col">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">My Schedule</h2>
            <div className="flex gap-6 border-b border-brand-sand/40 mb-8">
              <button className="font-bold text-brand-dark border-b-2 border-brand-dark pb-3 -mb-[2px]">Upcoming</button>
              <button className="font-bold text-brand-dark/40 pb-3 hover:text-brand-dark transition-colors">History</button>
            </div>
            
            <div className="flex justify-end mb-8">
              <select className="border border-brand-sand/50 rounded-lg px-4 py-2 text-sm outline-none bg-white min-w-[120px] font-medium appearance-none cursor-pointer">
                <option>All types</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <Calendar size={48} className="text-brand-dark/20 mb-6 mx-auto stroke-1" />
              <h3 className="text-xl font-bold text-brand-dark mb-6">Looks like you have no schedules</h3>
              <Link to="/book" className="bg-brand-brown text-brand-beige px-8 py-3 rounded-full font-medium hover:bg-brand-dark transition-colors">
                Book Now
              </Link>
            </div>
          </div>
        );
      
      case 'courses':
        return (
          <div className="animate-fade-in h-full flex flex-col">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">My courses</h2>
            <div className="flex gap-6 border-b border-brand-sand/40 mb-8">
              <button className="font-bold text-brand-dark border-b-2 border-brand-dark pb-3 -mb-[2px]">Upcoming</button>
              <button className="font-bold text-brand-dark/40 pb-3 hover:text-brand-dark transition-colors">In Progress</button>
              <button className="font-bold text-brand-dark/40 pb-3 hover:text-brand-dark transition-colors">Completed</button>
              <button className="font-bold text-brand-dark/40 pb-3 hover:text-brand-dark transition-colors">Cancelled</button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-24 border border-dashed border-brand-sand/50 rounded-xl bg-white/30">
              <div className="w-16 h-16 rounded-full border-2 border-brand-dark/30 flex items-center justify-center mb-6 mx-auto relative">
                <div className="w-1.5 h-1.5 bg-brand-dark/40 rounded-full absolute top-5 left-4"></div>
                <div className="w-1.5 h-1.5 bg-brand-dark/40 rounded-full absolute top-5 right-4"></div>
                <div className="w-4 h-1 border-b-2 border-brand-dark/40 absolute bottom-4 rounded-full"></div>
              </div>
              <p className="font-medium text-brand-dark mb-6">Looks like you have not signed up for any courses</p>
              <Link to="/book" className="bg-brand-brown text-brand-beige px-8 py-3 rounded-full font-medium hover:bg-brand-dark transition-colors">
                Browse Classes
              </Link>
            </div>
          </div>
        );
      
      case 'packages':
        return (
          <div className="animate-fade-in h-full flex flex-col">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">My packages</h2>
            <div className="flex gap-6 border-b border-brand-sand/40 mb-8">
              <button className="font-bold text-brand-dark border-b-2 border-brand-dark pb-3 -mb-[2px]">Active</button>
              <button className="font-bold text-brand-dark/40 pb-3 hover:text-brand-dark transition-colors">Expired</button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <Package size={64} className="text-brand-dark/20 mb-6 mx-auto stroke-1" />
              <p className="font-medium text-brand-dark mb-6">You don't have any active packages.</p>
              <Link to="/pricing" className="bg-brand-brown text-brand-beige px-8 py-3 rounded-full font-medium hover:bg-brand-dark transition-colors">
                Buy Packages
              </Link>
            </div>
          </div>
        );
      

      case 'notifications':
        return (
          <div className="animate-fade-in h-full flex flex-col">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Notification settings</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-bold text-brand-dark mb-2">Deal & promotions</h3>
              <p className="text-sm text-brand-dark/70 mb-6">Stay up-to-date with our deals and promotions.</p>
              
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-sm text-brand-dark">Email</span>
                <div className="w-10 h-6 bg-green-400 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-brand-dark">SMS</span>
                <div className="w-10 h-6 bg-green-400 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans pt-20">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[320px] bg-white border-r border-brand-sand/30 flex flex-col shrink-0">
          
          {/* User Profile Card */}
          <div className="p-8 border-b border-brand-sand/10 flex flex-col items-center text-center">
            <div className="w-[100px] h-[100px] rounded-full bg-[#c977b3] flex items-center justify-center text-white text-[40px] font-bold mb-5 shadow-sm">
              G
            </div>
            <h2 className="text-2xl font-bold font-serif text-brand-dark mb-2 tracking-tight">Graciella Jimenez</h2>
            <p className="text-sm text-brand-dark/50 mb-3 font-medium">Client No: 01563897</p>
            <p className="text-[13px] font-medium text-brand-dark/40">Joined since 20 Aug 2026</p>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-none lg:flex-1 py-2 lg:py-6 flex flex-row lg:flex-col overflow-x-auto border-b lg:border-b-0 border-brand-sand/30 scrollbar-hide">
            {MENU_ITEMS.map((item, idx) => (
              <div key={item.id} className="shrink-0 lg:shrink w-full">
                {item.id === 'billing' && <div className="hidden lg:block h-6"></div>} {/* Spacer only on desktop */}
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2 lg:gap-5 px-4 lg:px-10 py-3 lg:py-3 transition-colors text-left ${
                    activeTab === item.id 
                      ? 'bg-transparent relative' 
                      : 'hover:bg-brand-sand/10'
                  }`}
                >
                  {/* Active Indicator Line */}
                  {activeTab === item.id && (
                    <>
                      <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-black"></div>
                      <div className="block lg:hidden absolute bottom-0 left-0 right-0 h-1 bg-black"></div>
                    </>
                  )}
                  
                  <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? 'text-black' : 'text-brand-dark/60'} />
                  <span className={`text-[15px] whitespace-nowrap ${activeTab === item.id ? 'font-bold text-black' : 'font-semibold text-brand-dark/70'}`}>
                    {item.label}
                  </span>
                </button>
              </div>
            ))}
          </nav>
          
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-4xl">
            {renderContent()}
          </div>
        </main>
        
      </div>
      

      {/* FAQs and Footer */}
      <ContactFAQSection />
      <Footer />
      
    </div>
  );
}
