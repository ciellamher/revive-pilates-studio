import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BookYourSpotSchedule() {
  const [selectedDay, setSelectedDay] = useState('20');

  // Extended days to mimic the scrollable calendar in the screenshot
  const days = [
    { day: 'Sun', date: '16' },
    { day: 'Mon', date: '17' },
    { day: 'Tue', date: '18' },
    { day: 'Wed', date: '19' },
    { day: 'Thu', date: '20' },
    { day: 'Fri', date: '21' },
    { day: 'Sat', date: '22' }
  ];

  const scheduleData = [
    {
      dateHeading: "Thu, 20 Aug",
      classesCount: 4,
      classes: [
        {
          id: 1,
          time: "09:00am",
          duration: "50 mins",
          title: "Reformer",
          level: "All Levels",
          instructor: "Coach Chelsea",
          location: "Angeles",
          spots: "0 / 5 left",
          status: "Waitlist"
        },
        {
          id: 2,
          time: "11:00am",
          duration: "50 mins",
          title: "Mat Pilates",
          level: "All Levels",
          instructor: "Coach Bea",
          location: "San Fernando",
          spots: "5 / 10 left",
          status: "Book Now"
        },
        {
          id: 3,
          time: "03:00pm",
          duration: "50 mins",
          title: "Barre",
          level: "All Levels",
          instructor: "Coach Chelsea",
          location: "Angeles",
          spots: "0 / 10 left",
          status: "Waitlist"
        },
        {
          id: 4,
          time: "05:00pm",
          duration: "50 mins",
          title: "Private Session",
          level: "All Levels",
          instructor: "Coach Van",
          location: "San Fernando",
          spots: "1 / 1 left",
          status: "Book Now"
        }
      ]
    },
    {
      dateHeading: "Fri, 21 Aug",
      classesCount: 4,
      classes: [
        {
          id: 5,
          time: "08:00am",
          duration: "50 mins",
          title: "Reformer",
          level: "All Levels",
          instructor: "Coach Van",
          location: "San Fernando",
          spots: "5 / 5 left",
          status: "Book Now"
        },
        {
          id: 6,
          time: "10:00am",
          duration: "50 mins",
          title: "Clinical Pilates",
          level: "All Levels",
          instructor: "Coach Bea",
          location: "Angeles",
          spots: "0 / 1 left",
          status: "Waitlist"
        },
        {
          id: 7,
          time: "02:00pm",
          duration: "50 mins",
          title: "Barre",
          level: "All Levels",
          instructor: "Coach Chelsea",
          location: "San Fernando",
          spots: "7 / 10 left",
          status: "Book Now"
        },
        {
          id: 8,
          time: "06:00pm",
          duration: "50 mins",
          title: "Mat Pilates",
          level: "All Levels",
          instructor: "Coach Van",
          location: "Angeles",
          spots: "10 / 10 left",
          status: "Book Now"
        }
      ]
    }
  ];

  return (
    <div className="w-full relative">
      

      {/* Main Schedule Container */}
      <div className="bg-[#EBE7DF] w-full min-h-screen px-4 sm:px-6 lg:px-12 py-12">
        <div className="max-w-[1000px] mx-auto">
          
          {/* Top Date Scroller */}
          <div className="flex items-center gap-4 mb-8 overflow-x-auto hide-scrollbar">
            {/* Back Arrow */}
            <button className="w-8 h-8 rounded-full border border-brand-dark/30 flex items-center justify-center text-brand-dark shrink-0 hover:bg-brand-dark/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            
            <div className="flex flex-1 gap-2 md:gap-4 justify-between items-center px-4">
              {days.map((d) => {
                const isSelected = d.date === selectedDay;
                return (
                  <button 
                    key={d.date}
                    onClick={() => setSelectedDay(d.date)}
                    className={`flex flex-col items-center justify-center py-2 px-4 md:px-6 rounded-[24px] transition-colors min-w-[70px] ${isSelected ? 'bg-brand-dark text-white' : 'text-brand-dark hover:bg-brand-dark/10'}`}
                  >
                    <span className="text-xs font-medium mb-1">{d.day}</span>
                    <span className="text-xl font-bold">{d.date}</span>
                  </button>
                )
              })}
            </div>

            {/* Next Arrow */}
            <button className="w-8 h-8 rounded-full border border-brand-dark/30 flex items-center justify-center text-brand-dark shrink-0 hover:bg-brand-dark/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {/* Filter Bar (Segmented) */}
          <div className="w-full border border-brand-dark/30 rounded-[24px] flex flex-col md:flex-row overflow-hidden mb-12">
            <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-brand-dark/30 flex justify-between items-center cursor-pointer hover:bg-brand-dark/5 text-brand-dark text-sm">
              <span>All categories</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-brand-dark/30 flex justify-between items-center cursor-pointer hover:bg-brand-dark/5 text-brand-dark text-sm">
              <span>Location</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-brand-dark/30 flex justify-between items-center cursor-pointer hover:bg-brand-dark/5 text-brand-dark text-sm">
              <span>Classes</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div className="flex-1 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-brand-dark/5 text-brand-dark text-sm">
              <span>Instructor</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>

          {/* List View */}
          <div className="w-full">
            {scheduleData
              .filter(dayGroup => dayGroup.dateHeading.includes(selectedDay))
              .map((dayGroup, idx) => (
              <div key={idx} className="mb-16">
                
                {/* Date Header */}
                <div className="flex items-baseline gap-4 mb-6">
                  <h3 className="text-brand-dark text-2xl font-sans font-bold">
                    {dayGroup.dateHeading}
                  </h3>
                  <span className="text-brand-dark/60 text-sm font-medium">{dayGroup.classesCount} classes</span>
                </div>
                
                <div className="flex flex-col gap-4">
                  {dayGroup.classes.map((cls) => (
                    <div key={cls.id} className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8">
                      
                      {/* Outside Left: Time & Duration */}
                      <div className="w-[80px] shrink-0 text-brand-dark">
                        <p className="font-bold text-[15px] leading-tight">{cls.time}</p>
                        <p className="text-xs opacity-70 mt-1 font-medium">{cls.duration}</p>
                      </div>
                      
                      {/* Inside the Box */}
                      <div className="flex-1 bg-[#3A2A20] rounded-[32px] p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border border-white/5">
                        
                        {/* Title */}
                        <div className="flex items-center gap-2 md:w-1/4">
                          <h4 className="text-brand-beige font-sans font-bold text-lg tracking-wide uppercase">{cls.title}</h4>
                        </div>
                        
                        {/* Location */}
                        <div className="flex flex-col justify-center md:w-1/4">
                          <p className="text-brand-beige font-sans font-bold text-[15px] tracking-wide">{cls.location}</p>
                        </div>
                        
                        {/* Availability */}
                        <div className="flex flex-col md:w-1/5">
                          <p className="text-brand-beige font-bold text-sm">{cls.spots}</p>
                          <p className="text-brand-beige/70 text-xs mt-1">{cls.instructor}</p>
                        </div>
                        
                        {/* Action Button */}
                        <div className="flex justify-end md:w-1/5 shrink-0">
                          <Link 
                            to="/checkout"
                            state={{
                              title: cls.title,
                              instructor: cls.instructor,
                              time: cls.time,
                              isWaitlist: cls.status === 'Waitlist',
                              slotsLeft: parseInt(cls.spots.split(' ')[0]) || 0
                            }}
                            className="bg-brand-sand text-brand-dark px-8 py-3 rounded-full text-sm font-bold hover:bg-white transition-colors w-full md:w-auto shadow-sm text-center block"
                          >
                            {cls.status}
                          </Link>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
