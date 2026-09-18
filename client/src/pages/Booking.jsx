import { useState } from 'react';
import Navbar from '../components/organisms/Navbar';
import BookYourSpotSchedule from '../components/organisms/BookYourSpotSchedule';
import ClassScheduleGrid from '../components/organisms/ClassScheduleGrid';
import Footer from '../components/organisms/Footer';

export default function Booking() {
  const [view, setView] = useState('list'); // 'list' | 'calendar'

  return (
    <div className="min-h-screen bg-brand-beige">
      <Navbar />
      
      <main>
        {/* Header Area */}
        <div className="bg-[#D4DAD5] w-full pt-40 pb-12 px-4 sm:px-6 lg:px-12 relative">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-7xl md:text-8xl lg:text-[110px] font-sans font-medium text-[#3A2A20] mb-6 tracking-tight leading-none">
                Book Your Spot
              </h1>
              <p className="text-[#3A2A20] text-base max-w-lg leading-relaxed font-medium">
                Reformer classes offered daily. Find your time, book your spot, and begin. Revive days ahead!
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-[#EBE7DF] rounded-full p-1 border border-[#3A2A20]/10 shrink-0 mb-2">
              <button 
                onClick={() => setView('list')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${view === 'list' ? 'bg-[#3A2A20] text-[#F5F2ED] shadow-sm' : 'text-[#3A2A20] hover:bg-[#3A2A20]/5'}`}
              >
                List View
              </button>
              <button 
                onClick={() => setView('calendar')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${view === 'calendar' ? 'bg-[#3A2A20] text-[#F5F2ED] shadow-sm' : 'text-[#3A2A20] hover:bg-[#3A2A20]/5'}`}
              >
                Calendar View
              </button>
            </div>
          </div>
        </div>

        {view === 'list' ? (
          <BookYourSpotSchedule />
        ) : (
          <ClassScheduleGrid hideTitle={true} />
        )}
      </main>

      <Footer />
    </div>
  );
}
