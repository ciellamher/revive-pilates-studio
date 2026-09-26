import { useState } from 'react';
import Navbar from '../components/organisms/Navbar';
import BookYourSpotSchedule from '../components/organisms/BookYourSpotSchedule';
import ClassScheduleGrid from '../components/organisms/ClassScheduleGrid';
import Footer from '../components/organisms/Footer';

export default function Booking() {
  const [view, setView] = useState('list'); // 'list' | 'calendar'
  const [location, setLocation] = useState('Location');

  // Dynamic theme colors
  let headerBg = "bg-[#D4DAD5]";
  let textTheme = "text-[#3A2A20]";
  let mainBg = "bg-brand-beige";
  
  if (location === 'Angeles City') {
    headerBg = "bg-[#2A180E]";
    textTheme = "text-[#F5F2ED]";
    mainBg = "bg-[#3A2A20]";
  } else if (location === 'San Fernando') {
    headerBg = "bg-[#D8CFC4]";
    textTheme = "text-[#3A2A20]";
    mainBg = "bg-[#EBE7DF]";
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${mainBg}`}>
      <Navbar />
      
      <main>
        {/* Header Area */}
        <div className={`w-full pt-40 pb-12 px-4 sm:px-6 lg:px-12 relative transition-colors duration-500 ${headerBg}`}>
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className={`text-7xl md:text-8xl lg:text-[110px] font-sans font-medium mb-6 tracking-tight leading-none ${textTheme}`}>
                Book Your Spot
              </h1>
              <p className={`text-base max-w-lg leading-relaxed font-medium ${textTheme}`}>
                Reformer classes offered daily. Find your time, book your spot, and begin. Revive days ahead!
              </p>
            </div>
            
            {/* View Toggle */}
            <div className={`flex rounded-full p-1 border shrink-0 mb-2 ${location === 'Angeles City' ? 'bg-[#3A2A20] border-white/20' : 'bg-[#EBE7DF] border-[#3A2A20]/10'}`}>
              <button 
                onClick={() => setView('list')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${view === 'list' ? (location === 'Angeles City' ? 'bg-white text-[#3A2A20] shadow-sm' : 'bg-[#3A2A20] text-[#F5F2ED] shadow-sm') : (location === 'Angeles City' ? 'text-white hover:bg-white/10' : 'text-[#3A2A20] hover:bg-[#3A2A20]/5')}`}
              >
                List View
              </button>
              <button 
                onClick={() => setView('calendar')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${view === 'calendar' ? (location === 'Angeles City' ? 'bg-white text-[#3A2A20] shadow-sm' : 'bg-[#3A2A20] text-[#F5F2ED] shadow-sm') : (location === 'Angeles City' ? 'text-white hover:bg-white/10' : 'text-[#3A2A20] hover:bg-[#3A2A20]/5')}`}
              >
                Calendar View
              </button>
            </div>
          </div>
        </div>

        {view === 'list' ? (
          <BookYourSpotSchedule globalLocation={location} setGlobalLocation={setLocation} />
        ) : (
          <ClassScheduleGrid hideTitle={true} globalLocation={location} setGlobalLocation={setLocation} />
        )}
      </main>

      <Footer />
    </div>
  );
}
