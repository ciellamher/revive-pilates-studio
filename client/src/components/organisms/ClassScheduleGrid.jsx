import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const CURRENT_WEEK = [
  { day: 'Sun', date: '16' },
  { day: 'Mon', date: '17' },
  { day: 'Tue', date: '18' },
  { day: 'Wed', date: '19' },
  { day: 'Thu', date: '20' },
  { day: 'Fri', date: '21' },
  { day: 'Sat', date: '22' },
];

const generateDummyClasses = () => {
  return [
    { id: 101, date: '16', time: '08:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Bea', branch: 'San Fernando', isDone: true },
    { id: 102, date: '16', time: '10:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Bea', branch: 'San Fernando', isDone: true },
    { id: 103, date: '16', time: '01:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Giana', branch: 'Angeles', isDone: true },
    { id: 104, date: '16', time: '03:00 PM', duration: '50 min', title: 'Private Session', instructor: 'Coach Giana', branch: 'Angeles', isDone: true },
    
    { id: 201, date: '17', time: '08:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Dani', branch: 'Angeles', isDone: true },
    { id: 202, date: '17', time: '09:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Dani', branch: 'Angeles', isDone: true },
    { id: 203, date: '17', time: '01:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Bea', branch: 'San Fernando', isDone: true },
    { id: 204, date: '17', time: '02:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Bea', branch: 'San Fernando', isDone: true },
    { id: 205, date: '17', time: '04:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Bea', branch: 'Angeles', isDone: true },
    
    { id: 301, date: '18', time: '08:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'San Fernando', isDone: true },
    { id: 302, date: '18', time: '09:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'San Fernando', isDone: true },
    { id: 303, date: '18', time: '10:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'Angeles', isDone: true },
    { id: 304, date: '18', time: '04:00 PM', duration: '50 min', title: 'Mat Pilates', instructor: 'Coach Chelsea', branch: 'Angeles', isDone: true },
    { id: 305, date: '18', time: '06:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Bea', branch: 'San Fernando', isDone: true },

    { id: 401, date: '19', time: '08:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'Angeles', isDone: true },
    { id: 402, date: '19', time: '10:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'San Fernando', isDone: true },
    { id: 403, date: '19', time: '02:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Bea', branch: 'Angeles', isDone: true },
    { id: 404, date: '19', time: '05:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Bea', branch: 'San Fernando', isDone: true },

    { id: 501, date: '20', time: '09:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'Angeles', isDone: true },
    { id: 502, date: '20', time: '11:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Bea', branch: 'San Fernando', isDone: true },
    { id: 503, date: '20', time: '03:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'Angeles' },
    { id: 504, date: '20', time: '05:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Bea', branch: 'San Fernando', isFull: true },

    { id: 601, date: '21', time: '08:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Van', branch: 'Angeles' },
    { id: 602, date: '21', time: '10:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Van', branch: 'San Fernando', isFull: true },
    { id: 603, date: '21', time: '02:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'Angeles' },
    { id: 604, date: '21', time: '06:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'San Fernando' },

    { id: 701, date: '22', time: '09:00 AM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'Angeles', isFull: true },
    { id: 702, date: '22', time: '10:30 AM', duration: '50 min', title: 'Barre', instructor: 'Coach Alex', branch: 'San Fernando' },
    { id: 703, date: '22', time: '02:00 PM', duration: '50 min', title: 'Reformer Flow', instructor: 'Coach Chelsea', branch: 'Angeles' },
  ];
};

const DUMMY_CLASSES = generateDummyClasses();

const TIME_SLOTS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
];

const CustomDropdown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full relative h-full flex flex-col justify-center" ref={dropdownRef}>
      <div 
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-bold text-[#3A2A20]">
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`text-[#3A2A20] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-[100%] left-0 w-[120%] min-w-[200px] mt-2 bg-[#F5F2ED] border border-[#D8CFC4] rounded-2xl shadow-xl z-50 overflow-hidden py-2">
          {options.map((option, idx) => (
            <div
              key={idx}
              className={`px-6 py-2.5 text-sm cursor-pointer transition-colors ${value === option ? 'font-bold bg-[#3A2A20] text-[#F5F2ED]' : 'text-[#3A2A20] hover:bg-black/5'}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ClassScheduleGrid({ hideTitle = false }) {
  const [classType, setClassType] = useState('Classes');
  const [instructor, setInstructor] = useState('Instructor');
  const [category, setCategory] = useState('All categories');
  const [location, setLocation] = useState('Location');
  const [activeDate, setActiveDate] = useState('20');

  const getClassesForDate = (date) => {
    return DUMMY_CLASSES.filter(cls => cls.date === date);
  };

  return (
    <section className={`bg-[#F5F2ED] pb-16 ${hideTitle ? 'pt-4' : 'pt-16'}`} id="schedule">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        {!hideTitle && (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-6xl md:text-7xl lg:text-[90px] font-serif text-[#3A2A20] leading-[0.9] tracking-tight">
                Class<br/>Schedule
              </h2>
            </div>
          </div>
        )}

        {/* Date Navigator */}
        <div className="flex justify-center items-center mb-10 w-full">
          <button className="shrink-0 w-10 h-10 rounded-full border border-[#D8CFC4] items-center justify-center text-[#3A2A20] hover:bg-black/5 transition-colors hidden md:flex mr-4">
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center justify-between w-full md:w-auto md:justify-center gap-1 sm:gap-4 md:gap-8">
            {CURRENT_WEEK.map((d) => (
              <div 
                key={d.date} 
                onClick={() => setActiveDate(d.date)}
                className={`flex flex-col items-center justify-center w-[12%] max-w-[64px] aspect-[4/5] sm:w-16 sm:h-20 rounded-2xl sm:rounded-[32px] cursor-pointer transition-colors ${activeDate === d.date ? 'bg-[#2A180E] text-[#F5F2ED]' : 'text-[#3A2A20] hover:bg-black/5'}`}
              >
                <span className="text-[10px] sm:text-[12px] font-bold mb-0.5 sm:mb-1 opacity-80">{d.day}</span>
                <span className="text-base sm:text-xl font-bold">{d.date}</span>
              </div>
            ))}
          </div>

          <button className="shrink-0 w-10 h-10 rounded-full border border-[#D8CFC4] items-center justify-center text-[#3A2A20] hover:bg-black/5 transition-colors hidden md:flex ml-4">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Pill-shaped filter bar */}
        <div className="max-w-[900px] mx-auto mb-16">
          <div className="flex flex-col md:flex-row border border-[#D8CFC4] rounded-2xl md:rounded-full overflow-hidden bg-transparent">
            {/* All Categories */}
            <div className="flex-1 relative border-b md:border-b-0 md:border-r border-[#D8CFC4]">
              <CustomDropdown
                value={category}
                onChange={setCategory}
                options={['All categories', 'Group Classes', 'Private Sessions']}
                placeholder="All categories"
              />
            </div>
            
            {/* Location */}
            <div className="flex-1 relative border-b md:border-b-0 md:border-r border-[#D8CFC4]">
              <CustomDropdown
                value={location}
                onChange={setLocation}
                options={['Location', 'Revive Studio - Angeles City', 'Revive Studio - San Fernando']}
                placeholder="Location"
              />
            </div>

            {/* Classes */}
            <div className="flex-1 relative border-b md:border-b-0 md:border-r border-[#D8CFC4]">
              <CustomDropdown
                value={classType}
                onChange={setClassType}
                options={['Classes', 'Reformer Flow', 'Reformer Power', 'Mat Pilates', 'Barre', 'Clinical Pilates', 'Prenatal Pilates', 'Postnatal Pilates']}
                placeholder="Classes"
              />
            </div>

            {/* Instructor */}
            <div className="flex-1 relative">
              <CustomDropdown
                value={instructor}
                onChange={setInstructor}
                options={['Instructor', 'Coach Dani', 'Coach Bea', 'Coach Chelsea', 'Coach Van', 'Coach Alex', 'Coach Giana']}
                placeholder="Instructor"
              />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Schedule List (Visible on < lg screens) */}
        <div className="lg:hidden flex flex-col gap-4 pb-8">
          {(() => {
            const activeClasses = getClassesForDate(activeDate);
            if (activeClasses.length === 0) {
              return (
                <div className="text-center py-12 border border-[#D8CFC4] rounded-2xl">
                  <span className="text-lg font-bold text-[#3A2A20]/40">No Classes Scheduled</span>
                </div>
              );
            }
            
            return TIME_SLOTS.map((time) => {
              const cls = activeClasses.find(c => c.time === time);
              if (!cls) return null;
              
              const isPast = cls.isDone;
              const isFull = cls.isFull;
              
              const textBaseClass = (isPast || isFull) ? 'text-[#3A2A20]/40' : 'text-[#3A2A20] group-hover:text-brand-brown transition-colors';
              
              const content = (
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-start w-full mb-1">
                    <span className={`text-sm font-medium ${textBaseClass}`}>{cls.time} ({cls.duration})</span>
                    {isFull && <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A2A20]/40 group-hover:hidden bg-black/5 px-2 py-0.5 rounded-full">Full</span>}
                    {isFull && <span className="text-[10px] font-bold uppercase tracking-wider text-brand-brown hidden group-hover:block whitespace-nowrap bg-brand-brown/10 px-2 py-0.5 rounded-full">Waitlist</span>}
                  </div>
                  <span className={`font-bold text-xl ${textBaseClass}`}>{cls.title}</span>
                  <span className={`text-[15px] ${(isPast || isFull) ? 'text-[#3A2A20]/40' : 'text-[#3A2A20]'}`}>{cls.instructor}</span>
                  <span className={`text-[13px] ${(isPast || isFull) ? 'text-[#3A2A20]/40' : 'text-[#3A2A20]'}`}>{cls.branch}</span>
                </div>
              );

              if (isPast) {
                return (
                  <div key={cls.id} className="border border-[#D8CFC4] rounded-2xl p-5 flex items-start bg-transparent opacity-70">
                    {content}
                  </div>
                );
              }

              return (
                <Link 
                  key={cls.id} 
                  to="/checkout" 
                  state={{
                    title: cls.title,
                    instructor: cls.instructor,
                    time: cls.time,
                    isWaitlist: isFull,
                    slotsLeft: isFull ? 0 : (cls.title.toLowerCase().includes('reformer') ? 2 : 5)
                  }}
                  className="border border-[#D8CFC4] rounded-2xl p-5 flex items-start bg-[#F5F2ED] hover:bg-white group cursor-pointer hover:border-[#3A2A20] shadow-sm hover:shadow-md transition-all"
                >
                  {content}
                </Link>
              );
            });
          })()}
        </div>

        {/* Desktop Calendar Grid (Visible on >= lg screens) */}
        <div className="hidden lg:block w-full overflow-x-auto pb-8">
          <div className="min-w-[1000px] grid grid-cols-7 border border-[#D8CFC4] rounded-[24px] overflow-hidden bg-transparent">
            
            {/* Headers */}
            {CURRENT_WEEK.map((d, i) => {
              const hasClasses = getClassesForDate(d.date).length > 0;
              return (
                <div key={`header-${i}`} className={`border-b border-[#D8CFC4] pb-6 pt-4 flex flex-col items-center ${i < 6 ? 'border-r' : ''}`}>
                  <span className={`text-[#3A2A20]/60 text-sm mb-1 ${hasClasses ? 'font-bold' : ''}`}>{d.day}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${hasClasses ? 'bg-[#3A2A20] text-[#F5F2ED]' : 'text-[#3A2A20]/60'}`}>
                    {d.date}
                  </div>
                </div>
              );
            })}

            {/* Columns */}
            {CURRENT_WEEK.map((d, i) => {
              const dayClasses = getClassesForDate(d.date);
              
              return (
                <div key={`col-${i}`} className={`min-h-[400px] p-4 flex flex-col gap-6 ${i < 6 ? 'border-r border-[#D8CFC4]' : ''}`}>
                  {dayClasses.length === 0 ? (
                    <div className="flex justify-center mt-4 h-full">
                      <span className="text-sm font-bold text-[#3A2A20]/40">No Classes</span>
                    </div>
                  ) : (
                    TIME_SLOTS.map((time, idx) => {
                      const cls = dayClasses.find(c => c.time === time);
                      if (!cls) {
                        return <div key={`${d.date}-empty-${idx}`} className="h-[130px] shrink-0" />;
                      }

                      const isPast = cls.isDone;
                      const isFull = cls.isFull;
                      
                      const textBaseClass = (isPast || isFull) ? 'text-[#3A2A20]/40' : 'text-[#3A2A20] group-hover:text-brand-brown transition-colors';
                      
                      const content = (
                        <>
                          <div className="flex justify-between items-start w-full mb-2">
                            <span className={`text-[13px] ${textBaseClass}`}>{cls.time} ({cls.duration})</span>
                            {isFull && <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A2A20]/40 group-hover:hidden">Full</span>}
                            {isFull && <span className="text-[10px] font-bold uppercase tracking-wider text-brand-brown hidden group-hover:block whitespace-nowrap ml-2 bg-brand-brown/10 px-2 py-0.5 rounded-full">Waitlist</span>}
                          </div>
                          <span className={`font-bold text-lg mb-1 ${textBaseClass}`}>{cls.title}</span>
                          <span className={`text-[15px] mb-1 ${(isPast || isFull) ? 'text-[#3A2A20]/40' : 'text-[#3A2A20]'}`}>{cls.instructor}</span>
                          <span className={`text-[13px] mb-2 ${(isPast || isFull) ? 'text-[#3A2A20]/40' : 'text-[#3A2A20]'}`}>{cls.branch}</span>
                        </>
                      );

                      if (isPast) {
                        return (
                          <div key={cls.id} className="h-[130px] relative flex flex-col items-start bg-transparent px-3 py-2 shrink-0">
                            {content}
                          </div>
                        );
                      }

                      return (
                        <Link 
                          key={cls.id} 
                          to="/checkout" 
                          state={{
                            title: cls.title,
                            instructor: cls.instructor,
                            time: cls.time,
                            isWaitlist: isFull,
                            slotsLeft: isFull ? 0 : (cls.title.toLowerCase().includes('reformer') ? 2 : 5)
                          }}
                          className="h-[130px] relative flex flex-col items-start bg-transparent group cursor-pointer hover:bg-black/5 px-3 py-2 -mx-3 rounded-xl transition-all shrink-0"
                        >
                          {content}
                        </Link>
                      );
                    })
                  )}
                </div>
              );
            })}

          </div>
        </div>

      </div>
    </section>
  );
}
