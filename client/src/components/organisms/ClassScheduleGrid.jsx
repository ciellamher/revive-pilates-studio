import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomDropdown from '../atoms/CustomDropdown';

const getWeekDays = (weeksOffset = 0) => {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const absoluteToday = new Date();
  absoluteToday.setHours(0, 0, 0, 0); // normalize

  const targetDate = new Date(absoluteToday);
  targetDate.setDate(absoluteToday.getDate() + (weeksOffset * 7));
  
  // 7 days centered around targetDate
  for (let i = -3; i <= 3; i++) {
    const d = new Date(targetDate);
    d.setDate(targetDate.getDate() + i);
    const isPast = d < absoluteToday;
    
    days.push({
      day: dayNames[d.getDay()],
      date: d.getDate().toString(),
      fullDate: d,
      id: d.toDateString(), // unique identifier for the day
      isPast
    });
  }
  return days;
};



const TIME_SLOTS = [
  '08:00 AM', '08:30 AM',
  '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM',
  '07:00 PM'
];


export default function ClassScheduleGrid({ hideTitle = false, adminHeader = null, onClassClick = null, onEmptySlotClick = null, branch = null, globalLocation = null, setGlobalLocation = null, refreshKey = 0, view = 'calendar' }) {
  const [classType, setClassType] = useState('Classes');
  const [instructor, setInstructor] = useState('Instructor');
  const [category, setCategory] = useState('All categories');
  
  const [localLocation, setLocalLocation] = useState('Location');
  const location = globalLocation !== null ? globalLocation : localLocation;
  const setLocation = setGlobalLocation !== null ? setGlobalLocation : setLocalLocation;
  
  const isDarkTheme = globalLocation === 'Angeles City';
  
  const [weekOffset, setWeekOffset] = useState(0);
  const currentWeekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  
  useEffect(() => {
    if (branch) {
      if (branch.includes('Angeles')) {
        setLocation('Angeles City');
      } else if (branch.includes('San Fernando')) {
        setLocation('San Fernando');
      }
    }
  }, [branch]);
  
  const [classes, setClasses] = useState([]);
  
  const fetchClasses = () => {
    fetch('http://localhost:3000/api/classes')
      .then(res => res.json())
      .then(data => {
        if (data.classes) {
          setClasses(data.classes);
        }
      })
      .catch(err => console.error("Error fetching classes:", err));
  };
  
  useEffect(() => {
    fetchClasses();
  }, [refreshKey]);

  const [dragState, setDragState] = useState(null);
  const [localHeights, setLocalHeights] = useState({});

  useEffect(() => {
    if (!dragState) return;
    const handleMouseMove = (e) => {
      const deltaY = e.clientY - dragState.startY;
      let newHeight = Math.max(65, dragState.startHeight + deltaY); // minimum 15 mins (65px)
      setLocalHeights(prev => ({ ...prev, [dragState.id]: newHeight }));
    };
    
    const handleMouseUp = async (e) => {
      const deltaY = e.clientY - dragState.startY;
      const finalHeight = Math.max(65, dragState.startHeight + deltaY);
      const newDurationMins = Math.round(finalHeight / (130 / 30)); // 130px = 30mins
      
      const currentDragId = dragState.id;
      setDragState(null);
      
      try {
        await fetch(`http://localhost:3000/api/classes/${currentDragId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration: `${newDurationMins} min` })
        });
        fetchClasses();
      } catch (err) {
        console.error(err);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);

  const [activeDateId, setActiveDateId] = useState(() => new Date().toDateString());

  useEffect(() => {
    if (weekOffset !== 0) {
      setActiveDateId(currentWeekDays[3].id);
    } else {
      setActiveDateId(new Date().toDateString());
    }
  }, [weekOffset, currentWeekDays]);

  const getClassesForDateId = (dateId) => {
    return classes.filter(cls => {
      if (cls.dateId !== dateId) return false;
      if (location !== 'Location' && cls.branch && !location.includes(cls.branch)) return false;
      if (classType !== 'Classes' && cls.title && !cls.title.toLowerCase().includes(classType.toLowerCase())) return false;
      if (instructor !== 'Instructor' && cls.instructor && !instructor.includes(cls.instructor)) return false;
      return true;
    });
  };

  const availableInstructors = useMemo(() => {
    const instructors = new Set();
    classes.forEach(cls => {
      if (location !== 'Location' && cls.branch && !location.includes(cls.branch)) return;
      if (cls.instructor) {
        instructors.add(cls.instructor);
      }
    });
    return ['Instructor', ...Array.from(instructors)];
  }, [classes, location]);

  useEffect(() => {
    if (instructor !== 'Instructor' && !availableInstructors.includes(instructor)) {
      setInstructor('Instructor');
    }
  }, [availableInstructors, instructor]);

  return (
    <section className={`pb-16 ${hideTitle ? (adminHeader ? 'pt-0' : 'pt-4') : 'pt-16'} transition-colors duration-500`} id="schedule">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        {!hideTitle && (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className={`text-6xl md:text-7xl lg:text-[90px] font-serif leading-[0.9] tracking-tight ${isDarkTheme ? 'text-white' : 'text-[#3A2A20]'}`}>
                Class<br/>Schedule
              </h2>
            </div>
          </div>
        )}



        {/* Date Navigator */}
        <div className="flex justify-center items-center mb-10 w-full">
          <button 
            onClick={() => setWeekOffset(prev => prev - 1)}
            className={`shrink-0 w-10 h-10 rounded-full border items-center justify-center transition-colors hidden md:flex mr-4 ${isDarkTheme ? 'border-white/30 text-white hover:bg-white/10' : 'border-[#D8CFC4] text-[#3A2A20] hover:bg-black/5'}`}
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center justify-between w-full md:w-auto md:justify-center gap-1 sm:gap-4 md:gap-8">
            {currentWeekDays.map((d) => {
              const isSelected = activeDateId === d.id;
              const pastStyle = d.isPast && !isSelected ? 'opacity-40' : '';
              return (
              <div 
                key={d.id} 
                onClick={() => setActiveDateId(d.id)}
                className={`flex flex-col items-center justify-center w-[12%] max-w-[64px] aspect-[4/5] sm:w-16 sm:h-20 rounded-2xl sm:rounded-[32px] cursor-pointer transition-colors ${isSelected ? (isDarkTheme ? 'bg-white text-[#3A2A20]' : 'bg-[#2A180E] text-[#F5F2ED]') : (isDarkTheme ? 'text-white hover:bg-white/10' : 'text-[#3A2A20] hover:bg-black/5')} ${pastStyle}`}
              >
                <span className="text-[10px] sm:text-[12px] font-bold mb-0.5 sm:mb-1 opacity-80">{d.day}</span>
                <span className="text-base sm:text-xl font-bold">{d.date}</span>
              </div>
            )})}
          </div>

          <button 
            onClick={() => setWeekOffset(prev => prev + 1)}
            className={`shrink-0 w-10 h-10 rounded-full border items-center justify-center transition-colors hidden md:flex ml-4 ${isDarkTheme ? 'border-white/30 text-white hover:bg-white/10' : 'border-[#D8CFC4] text-[#3A2A20] hover:bg-black/5'}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Pill-shaped filter bar */}
        <div className="max-w-[900px] mx-auto mb-16">
          <div className={`flex flex-col md:flex-row border rounded-2xl md:rounded-full bg-transparent ${isDarkTheme ? 'border-white/30 text-white' : 'border-[#D8CFC4] text-[#3A2A20]'}`}>
            {/* All Categories */}
            <div className={`flex-1 relative border-b md:border-b-0 md:border-r ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>
              <CustomDropdown
                value={category}
                onChange={setCategory}
                options={['All categories', 'Group Classes', 'Private Sessions']}
                placeholder="All categories"
              />
            </div>
            
            {/* Location */}
            <div className={`flex-1 relative border-b md:border-b-0 md:border-r ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>
              <CustomDropdown
                value={location}
                onChange={setLocation}
                options={['Location', 'Angeles City', 'San Fernando']}
                placeholder="Location"
              />
            </div>

            {/* Classes */}
            <div className={`flex-1 relative border-b md:border-b-0 md:border-r ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>
              <CustomDropdown
                value={classType}
                onChange={setClassType}
                options={['Classes', 'Reformer Group', 'Mat', 'Barre', 'Private Class', 'Clinical Pilates']}
                placeholder="Classes"
              />
            </div>

            {/* Instructor */}
            <div className="flex-1 relative">
              <CustomDropdown
                value={instructor}
                onChange={setInstructor}
                options={availableInstructors}
                placeholder="Instructor"
              />
            </div>
          </div>
        </div>

        {adminHeader && (
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
            {adminHeader}
          </div>
        )}

        {/* Mobile/Tablet Schedule List (Visible on < lg screens, or always if view === 'list') */}
        <div className={`${view === 'list' ? 'flex' : 'lg:hidden flex'} flex-col gap-4 pb-8`}>
          {(() => {
            const activeClasses = getClassesForDateId(activeDateId);
            if (activeClasses.length === 0) {
              return (
                <div className={`text-center py-12 border rounded-2xl ${isDarkTheme ? 'border-white/30 text-white/40' : 'border-[#D8CFC4] text-[#3A2A20]/40'}`}>
                  <span className="text-lg font-bold">No Classes Scheduled</span>
                </div>
              );
            }
            
            return TIME_SLOTS.map((time) => {
              const cls = activeClasses.find(c => c.time === time);
              if (!cls) return null;
              
              const isPast = cls.isDone;
              const isFull = cls.isFull;
              
              const textBaseClass = (isPast || isFull) ? (isDarkTheme ? 'text-white/40' : 'text-[#3A2A20]/40') : (isDarkTheme ? 'text-white group-hover:text-brand-sand transition-colors' : 'text-[#3A2A20] group-hover:text-brand-brown transition-colors');
              
              const content = (
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-start w-full mb-1">
                    <span className={`text-sm font-medium ${textBaseClass}`}>{cls.time} ({cls.duration})</span>
                    {isFull && <span className={`text-[10px] font-bold uppercase tracking-wider group-hover:hidden px-2 py-0.5 rounded-full ${isDarkTheme ? 'text-white/40 bg-white/5' : 'text-[#3A2A20]/40 bg-black/5'}`}>Full</span>}
                    {isFull && <span className={`text-[10px] font-bold uppercase tracking-wider hidden group-hover:block whitespace-nowrap px-2 py-0.5 rounded-full ${isDarkTheme ? 'text-brand-sand bg-brand-sand/10' : 'text-brand-brown bg-brand-brown/10'}`}>Waitlist</span>}
                  </div>
                  <span className={`font-bold text-xl ${textBaseClass}`}>{cls.title}</span>
                  <span className={`text-[15px] ${(isPast || isFull) ? (isDarkTheme ? 'text-white/40' : 'text-[#3A2A20]/40') : (isDarkTheme ? 'text-white' : 'text-[#3A2A20]')}`}>{cls.instructor}</span>
                  <span className={`text-[13px] ${(isPast || isFull) ? (isDarkTheme ? 'text-white/40' : 'text-[#3A2A20]/40') : (isDarkTheme ? 'text-white' : 'text-[#3A2A20]')}`}>{cls.branch}</span>
                  {cls.isEmpty && !isPast && !cls.title.toLowerCase().includes('mat') && !cls.title.toLowerCase().includes('barre') && (
                    <div className={`mt-2 text-xs font-bold underline underline-offset-2 ${isDarkTheme ? 'text-brand-sand' : 'text-brand-brown'}`}>
                      Also available as Private Class
                    </div>
                  )}
                </div>
              );

              if (isPast) {
                return (
                  <div key={cls.id} className={`border rounded-2xl p-5 flex items-start bg-transparent opacity-70 ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>
                    {content}
                  </div>
                );
              }

              if (onClassClick) {
                return (
                  <button 
                    key={cls.id} 
                    onClick={() => onClassClick(cls)}
                    className={`border rounded-2xl p-5 flex items-start group cursor-pointer shadow-sm hover:shadow-md transition-all text-left ${isDarkTheme ? 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white' : 'border-[#D8CFC4] bg-[#F5F2ED] hover:bg-white hover:border-[#3A2A20]'}`}
                  >
                    {content}
                  </button>
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
                    slotsLeft: isFull ? 0 : (cls.title.toLowerCase().includes('reformer') || cls.title.toLowerCase().includes('clinical') ? 4 : 10)
                  }}
                  className={`border rounded-2xl p-5 flex items-start group cursor-pointer shadow-sm hover:shadow-md transition-all ${isDarkTheme ? 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white' : 'border-[#D8CFC4] bg-[#F5F2ED] hover:bg-white hover:border-[#3A2A20]'}`}
                >
                  {content}
                </Link>
              );
            });
          })()}
        </div>

        {/* Desktop Calendar Grid (Visible on >= lg screens, hidden if view === 'list') */}
        <div className={`${view === 'list' ? 'hidden' : 'hidden lg:block'} w-full pb-8`}>
          <div className={`w-full border rounded-[24px] overflow-hidden bg-transparent flex ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>
            
            {/* Time Axis (Left Column) */}
            <div className={`w-[70px] shrink-0 border-r flex flex-col pt-[90px] ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>
              {TIME_SLOTS.map((time, idx) => (
                <div key={`time-${idx}`} className={`h-[130px] border-b relative ${isDarkTheme ? 'border-white/10' : 'border-[#3A2A20]/10'}`}>
                  <span className={`absolute -top-2.5 right-3 text-[11px] font-bold ${isDarkTheme ? 'text-white/50' : 'text-[#3A2A20]/50'}`}>{time.replace(':00', '').replace(':30', '30').replace(' ', '')}</span>
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="flex-1 grid grid-cols-7">
              {currentWeekDays.map((d, i) => {
                const dayClasses = getClassesForDateId(d.id);
                const hasClasses = dayClasses.length > 0;
                
                return (
                  <div key={`col-${i}`} className={`flex flex-col ${i < 6 ? 'border-r' : ''} ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'} ${d.isPast ? (isDarkTheme ? 'bg-white/5 opacity-50' : 'bg-[#D8CFC4]/20 opacity-50') : ''}`}>
                    
                    {/* Header */}
                    <div className={`h-[90px] border-b pb-4 pt-4 flex flex-col items-center justify-center ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>
                      <span className={`text-sm mb-1 ${hasClasses ? 'font-bold' : ''} ${isDarkTheme ? 'text-white/60' : 'text-[#3A2A20]/60'}`}>{d.day}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${hasClasses ? (isDarkTheme ? 'bg-white text-[#3A2A20]' : 'bg-[#3A2A20] text-[#F5F2ED]') : (isDarkTheme ? 'text-white/60' : 'text-[#3A2A20]/60')}`}>
                        {d.date}
                      </div>
                    </div>

                    {/* Time Slots Area */}
                    <div className="flex flex-col relative w-full" style={{ height: TIME_SLOTS.length * 130 }}>
                      {/* Background horizontal lines */}
                      {TIME_SLOTS.map((time, idx) => (
                        <div 
                          key={`bg-${idx}`} 
                          onClick={() => onEmptySlotClick && onEmptySlotClick(d.id, time)}
                          className={`absolute left-0 right-0 h-[130px] border-b ${onEmptySlotClick ? 'cursor-pointer hover:bg-black/5' : 'pointer-events-none'} ${isDarkTheme ? 'border-white/10' : 'border-[#3A2A20]/10'}`} 
                          style={{ top: idx * 130 }} 
                        />
                      ))}

                      {/* Actual Classes */}
                      {dayClasses.map((cls) => {
                        const timeIdx = TIME_SLOTS.indexOf(cls.time);
                        if (timeIdx === -1) return null; // Fallback
                        
                        const topPosition = timeIdx * 130;
                        const isPast = cls.isDone;
                        const isFull = cls.isFull;
                        const textBaseClass = (isPast || isFull) ? (isDarkTheme ? 'text-white/40' : 'text-[#3A2A20]/40') : (isDarkTheme ? 'text-white group-hover:text-brand-sand transition-colors' : 'text-[#3A2A20] group-hover:text-brand-brown transition-colors');
                        
                        const durationMins = parseInt(cls.duration?.replace(' min', '') || '50', 10);
                        const computedHeight = localHeights[cls.id] !== undefined ? localHeights[cls.id] : (durationMins / 30) * 130;
                        
                        const content = (
                          <>
                            <div className="flex justify-between items-start w-full mb-0.5">
                              <span className={`text-[12px] font-medium ${textBaseClass}`}>{cls.duration}</span>
                              {isFull && <span className={`text-[10px] font-bold uppercase tracking-wider group-hover:hidden px-1.5 py-0.5 rounded-full ${isDarkTheme ? 'text-white/40 bg-white/5' : 'text-[#3A2A20]/40 bg-black/5'}`}>Full</span>}
                              {isFull && <span className={`text-[10px] font-bold uppercase tracking-wider hidden group-hover:block whitespace-nowrap ml-2 px-1.5 py-0.5 rounded-full ${isDarkTheme ? 'text-brand-sand bg-brand-sand/10' : 'text-brand-brown bg-brand-brown/10'}`}>Waitlist</span>}
                            </div>
                            <span className={`font-bold text-[14px] leading-tight mb-0.5 ${textBaseClass}`}>{cls.title}</span>
                            <span className={`text-[12px] mb-0.5 ${(isPast || isFull) ? (isDarkTheme ? 'text-white/40' : 'text-[#3A2A20]/40') : (isDarkTheme ? 'text-white' : 'text-[#3A2A20]')}`}>{cls.instructor}</span>
                            <span className={`text-[11px] mb-0.5 ${(isPast || isFull) ? (isDarkTheme ? 'text-white/40' : 'text-[#3A2A20]/40') : (isDarkTheme ? 'text-white' : 'text-[#3A2A20]')}`}>{cls.branch}</span>
                            {cls.isEmpty && !isPast && !cls.title.toLowerCase().includes('mat') && !cls.title.toLowerCase().includes('barre') && (
                              <div className={`mt-auto text-[9px] font-bold underline underline-offset-2 ${isDarkTheme ? 'text-brand-sand' : 'text-brand-brown'}`}>
                                Private Class Avail
                              </div>
                            )}
                          </>
                        );

                        if (isPast) {
                          return (
                            <div key={cls.id} className="absolute left-0 right-0 px-1 py-1 flex flex-col items-start bg-transparent z-10 overflow-hidden" style={{ top: topPosition, height: computedHeight }}>
                              <div className={`w-full h-full px-2 py-1.5 flex flex-col items-start rounded-xl ${isDarkTheme ? 'bg-white/5' : 'bg-black/5'}`}>
                                {content}
                              </div>
                            </div>
                          );
                        }

                        if (onClassClick) {
                          return (
                            <div key={cls.id} className="absolute left-0 right-0 px-1 py-1 z-10 overflow-hidden" style={{ top: topPosition, height: computedHeight }}>
                              <button 
                                onClick={() => onClassClick(cls)}
                                className={`w-full h-full px-2 py-1.5 relative flex flex-col items-start group cursor-pointer rounded-xl transition-all text-left ${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-[#F5F2ED] hover:bg-white border border-[#D8CFC4] hover:border-[#3A2A20]'}`}
                              >
                                {content}
                                <div 
                                  className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/10 rounded-b-xl z-20"
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setDragState({ id: cls.id, startY: e.clientY, startHeight: computedHeight });
                                  }}
                                >
                                  <div className="w-8 h-1 bg-black/30 rounded-full" />
                                </div>
                              </button>
                            </div>
                          );
                        }

                        return (
                          <div key={cls.id} className="absolute left-0 right-0 px-1 py-1 z-10 overflow-hidden" style={{ top: topPosition, height: computedHeight }}>
                            <Link 
                              to="/checkout" 
                              state={{
                                title: cls.title,
                                instructor: cls.instructor,
                                time: cls.time,
                                isWaitlist: isFull,
                                slotsLeft: isFull ? 0 : (cls.title.toLowerCase().includes('reformer') || cls.title.toLowerCase().includes('clinical') ? 4 : 10)
                              }}
                              className={`w-full h-full px-2 py-1.5 relative flex flex-col items-start group cursor-pointer rounded-xl transition-all text-left ${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-[#F5F2ED] hover:bg-white border border-[#D8CFC4] hover:border-[#3A2A20] shadow-sm hover:shadow-md'}`}
                            >
                              {content}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
