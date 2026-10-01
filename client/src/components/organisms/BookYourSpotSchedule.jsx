import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomDropdown from '../atoms/CustomDropdown';
import { API_BASE } from '../../api/base';
import { checkoutClassState, checkoutPrivateState, canBookPrivately, showsAsPrivate, privateFilterState } from '../../api/checkoutState';
import { CLASS_TYPES, isPrivateType } from '../../api/classTypes';
import { labelToMinutes } from '../../api/time';

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

// Filter choices. 'Private Sessions' shows Reformer classes nobody has booked
// yet, which can be taken as a private session.
const CLASS_TYPE_OPTIONS = ['Classes', ...CLASS_TYPES];

export default function BookYourSpotSchedule({ globalLocation = 'Location', setGlobalLocation = () => {}, initialCategory = 'All categories' }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const currentWeekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const [selectedDayId, setSelectedDayId] = useState(() => new Date().toDateString());

  // Filter states
  const [classType, setClassType] = useState('Classes');
  const [instructor, setInstructor] = useState('Instructor');
  const [category, setCategory] = useState(initialCategory);
  
  // Use globalLocation as the local state equivalent
  const location = globalLocation;
  const setLocation = setGlobalLocation;

  // Whenever we change weeks, if the selected day is not in the new week,
  // we could optionally select the center day of the new week.
  useEffect(() => {
    if (weekOffset !== 0) {
      setSelectedDayId(currentWeekDays[3].id);
    } else {
      setSelectedDayId(new Date().toDateString());
    }
  }, [weekOffset]);

  const getHeading = (dayIndex) => {
    const d = currentWeekDays[dayIndex].fullDate;
    return `${currentWeekDays[dayIndex].day}, ${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
  };

  const [classes, setClasses] = useState([]);
  
  useEffect(() => {
    fetch(`${API_BASE}/api/classes`)
      .then(res => res.json())
      .then(data => {
        if (data.classes) {
          setClasses(data.classes);
        }
      })
      .catch(err => console.error("Error fetching classes:", err));
  }, []);

  const scheduleData = useMemo(() => {
    const data = [];
    currentWeekDays.forEach((d, idx) => {
      const dayClasses = classes.filter(cls => {
        if (cls.dateId !== d.id) return false;
        if (location !== 'Location' && cls.branch && !location.includes(cls.branch)) return false;
        // Cancelled classes are not shown to clients.
        if (cls.isCancelled) return false;
        if (classType !== 'Classes' && cls.title !== classType) return false;
        if (category === 'Private Sessions' && !showsAsPrivate(cls)) return false;
        if (category === 'Group Classes' && isPrivateType(cls.title)) return false;
        if (instructor !== 'Instructor' && cls.instructor && !instructor.includes(cls.instructor)) return false;
        return true;
      }).sort((a, b) => (labelToMinutes(a.time) ?? 0) - (labelToMinutes(b.time) ?? 0)).map(cls => ({
        ...cls,
        location: cls.branch,
        spots: `${Math.max(0, cls.capacity - (cls.takenSpots?.length ?? 0))} / ${cls.capacity} left`,
        status: cls.isCancelled ? 'Cancelled' : cls.isDone ? 'Started' : cls.isFull ? 'Full' : category === 'Private Sessions' && !isPrivateType(cls.title) ? 'Book Private' : 'Book Now'
      }));
      data.push({
        dayId: d.id,
        dateHeading: getHeading(idx),
        classesCount: dayClasses.length,
        classes: dayClasses
      });
    });
    return data;
  }, [currentWeekDays, classes, location, classType, instructor, category]);

  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/coaches`)
      .then(res => res.json())
      .then(data => {
        if (data.coaches) setCoaches(data.coaches);
      })
      .catch(err => console.error("Error fetching coaches:", err));
  }, []);

  // Only the coaches who teach at the picked branch; all of them until a
  // branch is picked.
  const availableInstructors = useMemo(() => {
    const names = coaches
      .filter(coach => location === 'Location' || coach.branches.some(branch => location.includes(branch)))
      .map(coach => coach.name);
    return ['Instructor', ...new Set(names)];
  }, [coaches, location]);

  useEffect(() => {
    if (instructor !== 'Instructor' && !availableInstructors.includes(instructor)) {
      setInstructor('Instructor');
    }
  }, [availableInstructors, instructor]);

  const monthYearHeading = currentWeekDays[0].fullDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="w-full relative">
      
      {/* Main Schedule Container */}
      <div className="w-full min-h-screen px-4 sm:px-6 lg:px-12 py-12 transition-colors duration-500">
        <div className="max-w-[1000px] mx-auto">
          


          {/* Top Date Scroller */}
          <div className="flex items-center gap-1 sm:gap-4 mb-8">
            {/* Back Arrow */}
            <button 
              onClick={() => setWeekOffset(prev => prev - 1)}
              className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${location === 'Angeles City' ? 'border-white/30 text-white hover:bg-white/10' : 'border-brand-dark/30 text-brand-dark hover:bg-brand-dark/10'}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            
            <div className="flex flex-1 min-w-0 gap-0.5 sm:gap-2 md:gap-4 justify-between items-center sm:px-4">
              {currentWeekDays.map((d) => {
                const isSelected = d.id === selectedDayId;
                const pastStyle = d.isPast && !isSelected ? 'opacity-40' : '';
                return (
                  <button 
                    key={d.id}
                    onClick={() => setSelectedDayId(d.id)}
                    className={`flex flex-1 sm:flex-none min-w-0 flex-col items-center justify-center py-2 px-0 sm:px-4 md:px-6 rounded-2xl sm:rounded-[24px] transition-colors sm:min-w-[70px] ${isSelected ? (location === 'Angeles City' ? 'bg-white text-[#3A2A20]' : 'bg-[#2A180E] text-white') : (location === 'Angeles City' ? 'text-white hover:bg-white/10' : 'text-[#3A2A20] hover:bg-black/5')} ${pastStyle}`}
                  >
                    <span className="text-[11px] sm:text-xs font-medium mb-1">{d.day}</span>
                    <span className="text-lg sm:text-xl font-bold">{d.date}</span>
                  </button>
                )
              })}
            </div>

            {/* Next Arrow */}
            <button 
              onClick={() => setWeekOffset(prev => prev + 1)}
              className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${location === 'Angeles City' ? 'border-white/30 text-white hover:bg-white/10' : 'border-brand-dark/30 text-brand-dark hover:bg-brand-dark/10'}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {/* Filter Bar (Segmented) */}
          {/* No overflow-hidden here: it would clip the dropdown menus. */}
          <div className="relative z-30 w-full border border-brand-dark/30 rounded-[24px] flex flex-col md:flex-row mb-12 bg-[#F5F2ED]">
            <div className="flex-1 relative border-b md:border-b-0 md:border-r border-brand-dark/30">
              <CustomDropdown
                value={category}
                onChange={setCategory}
                options={['All categories', 'Group Classes', 'Private Sessions']}
                placeholder="All categories"
              />
            </div>
            <div className="flex-1 relative border-b md:border-b-0 md:border-r border-brand-dark/30">
              <CustomDropdown
                value={location}
                onChange={setLocation}
                options={['Location', 'Angeles City', 'San Fernando']}
                placeholder="Location"
              />
            </div>
            <div className="flex-1 relative border-b md:border-b-0 md:border-r border-brand-dark/30">
              <CustomDropdown
                value={classType}
                onChange={setClassType}
                options={CLASS_TYPE_OPTIONS}
                placeholder="Classes"
              />
            </div>
            <div className="flex-1 relative">
              <CustomDropdown
                value={instructor}
                onChange={setInstructor}
                options={availableInstructors}
                placeholder="Instructor"
              />
            </div>
          </div>

          {/* List View */}
          <div className="w-full">
            {scheduleData
              .filter(dayGroup => dayGroup.dayId === selectedDayId)
              .map((dayGroup, idx) => (
              <div key={idx} className="mb-16">
                
                {/* Date Header */}
                <div className="flex items-baseline gap-4 mb-6">
                  <h3 className={`text-2xl font-sans font-bold ${location === 'Angeles City' ? 'text-white' : 'text-brand-dark'}`}>
                    {dayGroup.dateHeading}
                  </h3>
                  <span className={`text-sm font-medium ${location === 'Angeles City' ? 'text-white/60' : 'text-brand-dark/60'}`}>{dayGroup.classesCount} {dayGroup.classesCount === 1 ? 'class' : 'classes'}</span>
                </div>
                
                <div className="flex flex-col gap-4">
                  {dayGroup.classes.map((cls) => (
                    <div key={cls.id} className={`flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8 transition-opacity ${cls.isDone ? 'opacity-50' : ''}`}>
                      
                      {/* Outside Left: Time & Duration */}
                      <div className="w-[80px] shrink-0 text-brand-dark">
                        <p className="font-bold text-[15px] leading-tight">{cls.time}</p>
                        <p className="text-xs opacity-70 mt-1 font-medium">{cls.duration}</p>
                      </div>
                      
                      {/* Inside the Box */}
                      <div className="flex-1 bg-[#3A2A20] rounded-[32px] p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border border-white/5">
                        
                        {/* Title */}
                        <div className="flex items-center gap-2 md:w-1/4">
                          <h4 className={`text-brand-beige font-sans font-bold text-lg tracking-wide uppercase ${cls.isCancelled ? 'line-through opacity-60' : ''}`}>{cls.title}</h4>
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
                        <div className="flex flex-col gap-2 justify-center md:w-1/5 shrink-0">
                          {cls.isCancelled || cls.isDone || cls.isFull ? (
                            <span className="border border-brand-beige/30 text-brand-beige/60 px-8 py-3 rounded-full text-sm font-bold w-full text-center block">
                              {cls.status}
                            </span>
                          ) : (
                            <Link 
                              to="/checkout"
                              state={category === 'Private Sessions' ? privateFilterState(cls) : checkoutClassState(cls)}
                              className="bg-brand-sand text-brand-dark px-8 py-3 rounded-full text-sm font-bold hover:bg-white transition-colors w-full shadow-sm text-center block"
                            >
                              {cls.status}
                            </Link>
                          )}
                          
                          {(() => {
                            if (category !== 'Private Sessions' && canBookPrivately(cls)) {
                              return (
                                <Link 
                                  to="/checkout"
                                  state={checkoutPrivateState(cls)}
                                  className="text-[11px] text-center text-brand-beige/80 hover:text-white font-medium underline underline-offset-2 transition-colors w-full block mt-1"
                                >
                                  Book as Private Class
                                </Link>
                              );
                            }
                            return null;
                          })()}
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
