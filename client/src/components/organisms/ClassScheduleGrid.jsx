import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomDropdown from '../atoms/CustomDropdown';
import { API_BASE, apiFetch } from '../../api/base';
import { checkoutClassState, matchesPrivateFilter, privateFilterState } from '../../api/checkoutState';
import { CLASS_FILTER_OPTIONS, PRIVATE_FILTER, isPrivateType, priceFor, privateKind } from '../../api/classTypes';
import { useAuth } from '../../contexts/AuthContext';
import { useNotify } from '../Notifications';
import { DAY_START, DAY_END, labelToMinutes, minutesToLabel, durationOf, shortLabel } from '../../api/time';

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

// '2026-10-02' for a Date, in the visitor's own calendar.
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// One row per hour, 8 AM to 8 PM.
const HOUR_PX = 56;
const HEADER_PX = 64;
const HOURS = Array.from({ length: (DAY_END - DAY_START) / 60 }, (_, i) => DAY_START + i * 60);
const GRID_PX = HOURS.length * HOUR_PX;
const SNAP = 15; // dragging moves classes in 15-minute steps
const snap = (minutes) => Math.round(minutes / SNAP) * SNAP;
const toPx = (minutes) => ((minutes - DAY_START) / 60) * HOUR_PX;

// Places a day's classes side by side where they overlap, like Google
// Calendar. Each group of overlapping classes is split into columns; a class
// goes in the first column that is free by its start time.
function layoutDay(events) {
  const placed = [];
  let group = [];
  let groupEnd = -1;
  const flush = () => {
    const columnEnds = [];
    for (const ev of group) {
      let col = columnEnds.findIndex(end => end <= ev.start);
      if (col === -1) {
        col = columnEnds.length;
        columnEnds.push(ev.end);
      } else {
        columnEnds[col] = ev.end;
      }
      ev.col = col;
    }
    for (const ev of group) placed.push({ ...ev, cols: columnEnds.length });
    group = [];
    groupEnd = -1;
  };
  for (const ev of events) {
    if (group.length && ev.start >= groupEnd) flush();
    group.push(ev);
    groupEnd = Math.max(groupEnd, ev.end);
  }
  flush();
  return placed;
}

export default function ClassScheduleGrid({ initialClassType = 'Classes', initialPrivateKind = 'solo', hideTitle = false, adminHeader = null, onClassClick = null, onEmptySlotClick = null, branch = null, globalLocation = null, setGlobalLocation = null, refreshKey = 0, view = 'calendar' }) {
  const isAdmin = Boolean(onClassClick);
  const [classType, setClassType] = useState(initialClassType);
  const [instructor, setInstructor] = useState('Instructor');

  const [localLocation, setLocalLocation] = useState('Location');
  const location = globalLocation !== null ? globalLocation : localLocation;
  const setLocation = setGlobalLocation !== null ? setGlobalLocation : setLocalLocation;

  const isDarkTheme = globalLocation === 'Angeles City';

  const [weekOffset, setWeekOffset] = useState(0);
  const currentWeekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  // In admin the branch comes from the sidebar, so the schedule follows it.
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

  const fetchClasses = useCallback(() => {
    return fetch(`${API_BASE}/api/classes`)
      .then(res => res.json())
      .then(data => {
        if (data.classes) {
          setClasses(data.classes);
        }
      })
      .catch(err => console.error("Error fetching classes:", err));
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [refreshKey, fetchClasses]);

  const [activeDateId, setActiveDateId] = useState(() => new Date().toDateString());

  useEffect(() => {
    if (weekOffset !== 0) {
      setActiveDateId(currentWeekDays[3].id);
    } else {
      setActiveDateId(new Date().toDateString());
    }
  }, [weekOffset, currentWeekDays]);

  // Cancelled classes are hidden from clients. The admin can show them, to
  // restore one.
  const [showCancelled, setShowCancelled] = useState(false);

  // A day's classes after the filters, earliest first.
  const getClassesForDateId = (dateId) => {
    return classes
      .filter(cls => {
        if (cls.dateId !== dateId) return false;
        if (cls.isCancelled && !(isAdmin && showCancelled)) return false;
        if (location !== 'Location' && cls.branch && !location.includes(cls.branch)) return false;
        if (classType !== 'Classes') {
          if (classType === PRIVATE_FILTER ? !matchesPrivateFilter(cls) : cls.title !== classType) return false;
        }
        if (instructor !== 'Instructor' && cls.instructor && !instructor.includes(cls.instructor)) return false;
        return true;
      })
      .sort((a, b) => (labelToMinutes(a.time) ?? 0) - (labelToMinutes(b.time) ?? 0));
  };

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

  // Under the private filter a class is booked whole; the client picks solo,
  // duo, trio or clinical at checkout.
  const linkState = (cls) => (classType === PRIVATE_FILTER ? privateFilterState(cls, initialPrivateKind) : checkoutClassState(cls));

  // ---- Admin drag and drop -------------------------------------------------
  // Dragging a class moves it to another time or day; dragging its bottom
  // edge changes its length. A press that hardly moves is a click and opens
  // the class instead. The latest drag position lives in a ref so the
  // pointer handlers always read it, and in state so the calendar redraws.
  const columnRefs = useRef([]);
  const dragRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [dragError, setDragError] = useState('');
  const { toast } = useNotify();
  // A dropped class waiting for the admin to confirm the change.
  const [pendingMove, setPendingMove] = useState(null);
  const [savingMove, setSavingMove] = useState(false);

  const undoMove = () => {
    setClasses(pendingMove.before);
    setPendingMove(null);
  };

  const confirmMove = async () => {
    const { cls, changes, before } = pendingMove;
    setSavingMove(true);
    try {
      const res = await apiFetch(`/api/classes/${cls.id}`, { method: 'PATCH', body: JSON.stringify(changes) });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      if (data?.notifyFailed) toast(`${cls.title} moved, but ${data.notifyFailed} email${data.notifyFailed === 1 ? '' : 's'} could not be sent. Please tell those clients yourself.`, { type: 'error' });
      else toast(data?.notified
        ? `${cls.title} moved. ${data.notified} booked ${data.notified === 1 ? 'client was' : 'clients were'} emailed the new time.`
        : `${cls.title} moved.`);
    } catch (err) {
      setClasses(before);
      setDragError(`Could not move the class: ${err.message}`);
    } finally {
      setSavingMove(false);
      setPendingMove(null);
    }
  };
  // Saving runs after the drag ends; these keep it reading current values.
  const latest = useRef({});
  useEffect(() => {
    latest.current = { classes, currentWeekDays, onClassClick };
  });

  const updateDrag = (next) => {
    dragRef.current = next;
    setDrag(next);
  };

  const startDrag = (e, cls, mode, dayIdx) => {
    if (!isAdmin || e.button > 0 || pendingMove) return;
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    const start = labelToMinutes(cls.time) ?? DAY_START;
    updateDrag({
      cls, mode, startX: e.clientX, startY: e.clientY, moved: false,
      origStart: start, origDuration: durationOf(cls), origDay: dayIdx,
      start, duration: durationOf(cls), dayIdx,
    });
  };

  const dragging = Boolean(drag);
  useEffect(() => {
    if (!dragging) return;

    const onMove = (e) => {
      const prev = dragRef.current;
      if (!prev) return;
      const dx = e.clientX - prev.startX;
      const dy = e.clientY - prev.startY;
      const moved = prev.moved || Math.abs(dx) > 4 || Math.abs(dy) > 4;
      const deltaMinutes = (dy / HOUR_PX) * 60;
      if (prev.mode === 'resize') {
        const duration = Math.min(Math.max(SNAP, snap(prev.origDuration + deltaMinutes)), 24 * 60 - prev.origStart);
        updateDrag({ ...prev, moved, duration });
        return;
      }
      const start = Math.min(Math.max(DAY_START, snap(prev.origStart + deltaMinutes)), DAY_END - SNAP);
      const overDay = columnRefs.current.findIndex(col => {
        if (!col) return false;
        const r = col.getBoundingClientRect();
        return e.clientX >= r.left && e.clientX < r.right;
      });
      updateDrag({ ...prev, moved, start, dayIdx: overDay === -1 ? prev.dayIdx : overDay });
    };

    const onUp = async () => {
      const done = dragRef.current;
      updateDrag(null);
      if (!done) return;
      const { classes: before, currentWeekDays: days, onClassClick: openClass } = latest.current;
      if (!done.moved) {
        openClass(done.cls);
        return;
      }
      if (done.mode === 'resize' && done.duration === done.origDuration) return;
      if (done.mode === 'move' && done.start === done.origStart && done.dayIdx === done.origDay) return;

      const cls = done.cls;
      const changes = done.mode === 'resize'
        ? { duration: done.duration }
        : { time: minutesToLabel(done.start), date: isoDate(days[done.dayIdx].fullDate) };

      // Show the class in its new place, then ask in a bar at the bottom of
      // the screen before saving: a schedule change emails everyone booked.
      // (A browser confirm() here, inside the pointer event, leaves Chrome
      // ignoring the next drag.)
      const dayText = days[done.dayIdx].fullDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      setClasses(prev => prev.map(c => (c.id !== cls.id ? c : {
        ...c,
        ...(changes.time ? { time: changes.time, date: changes.date, dateId: days[done.dayIdx].id } : {}),
        ...(changes.duration ? { duration: `${changes.duration} min` } : {}),
      })));
      setDragError('');
      setPendingMove({
        cls,
        changes,
        before,
        booked: (cls.takenSpots?.length ?? 0) > 0,
        question: done.mode === 'resize'
          ? `Change ${cls.title} to ${done.duration} minutes (${shortLabel(done.origStart)} – ${shortLabel(done.origStart + done.duration)})?`
          : `Move ${cls.title} to ${dayText} at ${shortLabel(done.start)}?`,
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging]);

  // Clicking empty space on a day (admin) starts a class at that hour.
  const handleColumnClick = (e, day) => {
    if (!onEmptySlotClick || dragRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const minutes = DAY_START + Math.floor((e.clientY - rect.top) / HOUR_PX) * 60;
    onEmptySlotClick(day.id, minutesToLabel(Math.min(Math.max(minutes, DAY_START), DAY_END - 60)));
  };

  // ---- Hover preview --------------------------------------------------------
  // Hovering a class shows a card with its details next to it.
  const { user } = useAuth();
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!preview) return;
    // Close when the visitor scrolls (the card would no longer sit next to
    // its class). Wheel and touch, not 'scroll': programmatic scrolling
    // should not close it.
    const close = () => setPreview(null);
    window.addEventListener('wheel', close, { passive: true, once: true });
    window.addEventListener('touchmove', close, { passive: true, once: true });
    return () => {
      window.removeEventListener('wheel', close);
      window.removeEventListener('touchmove', close);
    };
  }, [preview]);
  const showPreview = (e, cls) => {
    if (dragRef.current) return;
    setPreview({ cls, rect: e.currentTarget.getBoundingClientRect() });
  };
  const hidePreview = () => setPreview(null);

  // A line across today at the current time.
  const [nowMinutes, setNowMinutes] = useState(() => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); });
  useEffect(() => {
    const timer = setInterval(() => { const n = new Date(); setNowMinutes(n.getHours() * 60 + n.getMinutes()); }, 60000);
    return () => clearInterval(timer);
  }, []);
  const todayId = new Date().toDateString();

  const muted = isDarkTheme ? 'text-white/40' : 'text-[#3A2A20]/40';

  // One class on the calendar.
  const renderEvent = (ev, dayIdx, { ghost = false } = {}) => {
    const { cls } = ev;
    const isDragged = drag?.cls.id === cls.id;
    // While a class is dragged to another day, its own column hides it and
    // the target column draws it (the "ghost").
    if (isDragged && !ghost && drag.mode === 'move' && drag.dayIdx !== dayIdx) return null;
    const start = isDragged ? drag.start : ev.start;
    const duration = isDragged ? drag.duration : ev.end - ev.start;
    const isPast = cls.isDone;
    const isFull = cls.isFull;
    const isCancelled = cls.isCancelled;
    const isMuted = isPast || isFull || isCancelled;
    const style = {
      top: toPx(start) + 1,
      height: Math.max((duration / 60) * HOUR_PX - 2, 22),
      left: isDragged ? '2px' : `calc(${(ev.col / ev.cols) * 100}% + 2px)`,
      width: isDragged ? 'calc(100% - 4px)' : `calc(${100 / ev.cols}% - 4px)`,
    };
    const textClass = isMuted ? muted : (isDarkTheme ? 'text-white' : 'text-[#3A2A20]');
    // Show only as many lines as the block has room for: title always, then
    // time and coach, then the branch.
    const heightPx = style.height;
    const lines = heightPx >= 62 ? 3 : heightPx >= 38 ? 2 : 1;
    const badge = isCancelled
      ? <span className="shrink-0 text-[9px] font-bold uppercase px-1 rounded-full text-[#E02424] bg-[#E02424]/10">Cancelled</span>
      : isFull ? <span className={`shrink-0 text-[9px] font-bold uppercase px-1 rounded-full ${isDarkTheme ? 'bg-white/5' : 'bg-black/5'} ${muted}`}>Full</span> : null;
    const content = (
      <>
        <div className="flex items-center gap-1 w-full min-w-0">
          <span className={`block truncate font-bold text-[12px] leading-4 ${textClass} ${isCancelled ? 'line-through' : ''}`}>{cls.title}</span>
          {lines === 1 && <span className={`block truncate text-[10px] leading-4 ${textClass}`}>{shortLabel(start)}</span>}
          {badge && <span className="ml-auto">{badge}</span>}
        </div>
        {lines >= 2 && <span className={`block truncate w-full text-[10px] leading-4 ${textClass}`}>{shortLabel(start)} · {duration}m · {cls.instructor}</span>}
        {lines >= 3 && location === 'Location' && <span className={`block truncate w-full text-[10px] leading-4 ${textClass}`}>{cls.branch}</span>}
      </>
    );
    const surface = isDarkTheme ? 'bg-white/10' : 'bg-[#F5F2ED] border border-[#D8CFC4]';
    const hover = isDarkTheme ? 'hover:bg-white/20' : 'hover:bg-white hover:border-[#3A2A20]';
    const box = `w-full h-full px-1.5 py-1 flex flex-col items-start justify-start gap-0.5 overflow-hidden rounded-lg text-left transition-colors ${surface}`;

    // Full details on hover: see the preview card below.
    const previewHandlers = { onMouseEnter: (e) => showPreview(e, cls), onMouseLeave: hidePreview };

    if (isAdmin) {
      return (
        <div key={`${cls.id}${ghost ? '-ghost' : ''}`} {...(isDragged ? {} : previewHandlers)} className={`absolute ${isDragged ? 'z-30 shadow-lg' : 'z-10'}`} style={style}>
          <div
            role="button"
            tabIndex={0}
            aria-label={`${cls.title} at ${cls.time}. Drag to move, or press Enter to edit.`}
            onPointerDown={(e) => startDrag(e, cls, 'move', dayIdx)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => { if (e.key === 'Enter') onClassClick(cls); }}
            className={`${box} ${hover} cursor-grab active:cursor-grabbing touch-none select-none ${isMuted && !isDragged ? 'opacity-70' : ''}`}
          >
            {content}
          </div>
          <div
            aria-hidden="true"
            onPointerDown={(e) => startDrag(e, cls, 'resize', dayIdx)}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-1 right-1 h-2 cursor-ns-resize touch-none flex items-center justify-center group"
          >
            <div className="w-6 h-0.5 rounded-full group-hover:bg-black/30" />
          </div>
        </div>
      );
    }

    if (isPast || isCancelled) {
      return (
        <div key={cls.id} {...previewHandlers} className="absolute z-10" style={style}>
          <div className={`${box} opacity-60`}>{content}</div>
        </div>
      );
    }

    return (
      <div key={cls.id} {...previewHandlers} className="absolute z-10" style={style}>
        <Link to="/checkout" state={linkState(cls)} className={`${box} ${hover} shadow-sm hover:shadow-md`}>
          {content}
        </Link>
      </div>
    );
  };

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
            aria-label="Previous week"
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
            aria-label="Next week"
            className={`shrink-0 w-10 h-10 rounded-full border items-center justify-center transition-colors hidden md:flex ml-4 ${isDarkTheme ? 'border-white/30 text-white hover:bg-white/10' : 'border-[#D8CFC4] text-[#3A2A20] hover:bg-black/5'}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Pill-shaped filter bar. In admin the branch is picked in the sidebar, so there is no Location filter here. */}
        <div className="relative z-30 max-w-[900px] mx-auto mb-12">
          <div className={`flex flex-col md:flex-row border rounded-2xl md:rounded-full bg-transparent ${isDarkTheme ? 'border-white/30 text-white' : 'border-[#D8CFC4] text-[#3A2A20]'}`}>
            {!branch && (
              <div className={`flex-1 relative border-b md:border-b-0 md:border-r ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>
                <CustomDropdown
                  value={location}
                  onChange={setLocation}
                  options={['Location', 'Angeles City', 'San Fernando']}
                  placeholder="Location"
                />
              </div>
            )}

            <div className={`flex-1 relative border-b md:border-b-0 md:border-r ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>
              <CustomDropdown
                value={classType}
                onChange={setClassType}
                options={CLASS_FILTER_OPTIONS}
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
        </div>

        {adminHeader && (
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
            {adminHeader}
          </div>
        )}

        {isAdmin && (
          <label className="flex items-center gap-2 mb-4 text-sm font-medium text-[#3A2A20]/70 cursor-pointer w-fit">
            <input type="checkbox" checked={showCancelled} onChange={(e) => setShowCancelled(e.target.checked)} className="w-4 h-4 accent-[#3A2A20]" />
            Show cancelled classes
          </label>
        )}

        {dragError && <p role="alert" className="mb-4 text-sm font-medium text-[#E02424]">{dragError}</p>}

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

            return activeClasses.map((cls) => {
              const isPast = cls.isDone;
              const isFull = cls.isFull;
              const isCancelled = cls.isCancelled;
              const isMuted = isPast || isFull || isCancelled;
              const dim = isDarkTheme ? 'text-white/40' : 'text-[#3A2A20]/40';
              const plain = isDarkTheme ? 'text-white' : 'text-[#3A2A20]';
              const textBaseClass = isMuted ? dim : (isDarkTheme ? 'text-white group-hover:text-brand-sand transition-colors' : 'text-[#3A2A20] group-hover:text-brand-brown transition-colors');
              const badge = `text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isDarkTheme ? 'text-white/40 bg-white/5' : 'text-[#3A2A20]/40 bg-black/5'}`;

              const content = (
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-start w-full mb-1">
                    <span className={`text-sm font-medium ${textBaseClass}`}>{cls.time} ({cls.duration})</span>
                    {isCancelled && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-[#E02424] bg-[#E02424]/10">Cancelled</span>}
                    {!isCancelled && isPast && <span className={badge}>Started</span>}
                    {!isCancelled && !isPast && isFull && <span className={badge}>Full</span>}
                  </div>
                  <span className={`font-bold text-xl ${textBaseClass} ${isCancelled ? 'line-through' : ''}`}>{cls.title}</span>
                  <span className={`text-[15px] ${isMuted ? dim : plain}`}>{cls.instructor}</span>
                  <span className={`text-[13px] ${isMuted ? dim : plain}`}>{cls.branch}</span>
                  {cls.isEmpty && !isPast && !isCancelled && cls.title.toLowerCase().includes('reformer') && (
                    <div className={`mt-2 text-xs font-bold underline underline-offset-2 ${isDarkTheme ? 'text-brand-sand' : 'text-brand-brown'}`}>
                      Also available as Private Class
                    </div>
                  )}
                </div>
              );

              if (onClassClick) {
                return (
                  <button
                    key={cls.id}
                    onClick={() => onClassClick(cls)}
                    className={`border rounded-2xl p-5 flex items-start group cursor-pointer shadow-sm hover:shadow-md transition-all text-left ${isMuted ? 'opacity-70' : ''} ${isDarkTheme ? 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white' : 'border-[#D8CFC4] bg-[#F5F2ED] hover:bg-white hover:border-[#3A2A20]'}`}
                  >
                    {content}
                  </button>
                );
              }

              if (isPast || isCancelled) {
                return (
                  <div key={cls.id} className={`border rounded-2xl p-5 flex items-start bg-transparent opacity-70 ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>
                    {content}
                  </div>
                );
              }

              return (
                <Link
                  key={cls.id}
                  to="/checkout"
                  state={linkState(cls)}
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
          {isAdmin && <p className={`text-xs mb-3 ${muted}`}>Drag a class to move it, drag its bottom edge to change its length, or click an empty hour to add a class.</p>}
          <div className={`w-full border rounded-[24px] overflow-hidden bg-transparent flex ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`}>

            {/* Time Axis (Left Column) */}
            <div className={`w-[56px] shrink-0 border-r flex flex-col ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'}`} style={{ paddingTop: HEADER_PX }}>
              {HOURS.map((minutes) => (
                <div key={minutes} className="relative" style={{ height: HOUR_PX }}>
                  <span className={`absolute -top-2 right-2 text-[11px] font-bold ${isDarkTheme ? 'text-white/50' : 'text-[#3A2A20]/50'}`}>{shortLabel(minutes)}</span>
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="flex-1 grid grid-cols-7">
              {currentWeekDays.map((d, i) => {
                const dayClasses = getClassesForDateId(d.id);
                const events = layoutDay(dayClasses.map(cls => {
                  const start = labelToMinutes(cls.time) ?? DAY_START;
                  return { cls, start, end: start + durationOf(cls) };
                }));
                const hasClasses = dayClasses.length > 0;

                return (
                  <div key={`col-${i}`} className={`flex flex-col min-w-0 ${i < 6 ? 'border-r' : ''} ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'} ${d.isPast ? (isDarkTheme ? 'bg-white/5' : 'bg-[#D8CFC4]/20') : ''}`}>

                    {/* Header */}
                    <div className={`border-b flex flex-col items-center justify-center ${isDarkTheme ? 'border-white/30' : 'border-[#D8CFC4]'} ${d.isPast ? 'opacity-50' : ''}`} style={{ height: HEADER_PX }}>
                      <span className={`text-xs mb-1 ${hasClasses ? 'font-bold' : ''} ${isDarkTheme ? 'text-white/60' : 'text-[#3A2A20]/60'}`}>{d.day}</span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${d.id === todayId ? 'bg-brand-brown text-brand-beige ring-2 ring-offset-2 ring-brand-sand' : hasClasses ? (isDarkTheme ? 'bg-white text-[#3A2A20]' : 'bg-[#3A2A20] text-[#F5F2ED]') : (isDarkTheme ? 'text-white/60' : 'text-[#3A2A20]/60')}`}>
                        {d.date}
                      </div>
                    </div>

                    {/* Hours */}
                    <div
                      ref={(el) => { columnRefs.current[i] = el; }}
                      onClick={(e) => handleColumnClick(e, d)}
                      className={`relative w-full ${onEmptySlotClick ? 'cursor-pointer' : ''}`}
                      style={{ height: GRID_PX }}
                    >
                      {HOURS.map((minutes, idx) => (
                        <div
                          key={minutes}
                          className={`absolute left-0 right-0 border-b pointer-events-none ${isDarkTheme ? 'border-white/10' : 'border-[#3A2A20]/10'}`}
                          style={{ top: idx * HOUR_PX, height: HOUR_PX }}
                        />
                      ))}

                      {d.id === todayId && nowMinutes >= DAY_START && nowMinutes <= DAY_END && (
                        <div className="absolute left-0 right-0 z-20 pointer-events-none flex items-center" style={{ top: toPx(nowMinutes) }}>
                          <div className="w-2 h-2 rounded-full bg-brand-brown -ml-1" />
                          <div className="flex-1 h-px bg-brand-brown" />
                        </div>
                      )}

                      {events.map((ev) => renderEvent(ev, i))}

                      {/* A class being dragged in from another day */}
                      {drag && drag.mode === 'move' && drag.dayIdx === i && drag.origDay !== i &&
                        renderEvent({ cls: drag.cls, start: drag.start, end: drag.start + drag.duration, col: 0, cols: 1 }, i, { ghost: true })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {pendingMove && (
        <div role="alertdialog" aria-label="Confirm schedule change" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-xl bg-[#2A180E] text-white rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">{pendingMove.question}</p>
            <p className="text-xs text-white/70 mt-1">
              {pendingMove.booked ? 'Clients already booked in this class will be emailed the new time.' : 'Nobody has booked this class yet.'}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button type="button" onClick={undoMove} disabled={savingMove} className="px-4 py-2 rounded-lg text-sm font-bold text-white/80 hover:bg-white/10 transition-colors disabled:opacity-50">Undo</button>
            <button type="button" onClick={confirmMove} disabled={savingMove} autoFocus className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-[#2A180E] hover:bg-brand-sand transition-colors disabled:opacity-50">
              {savingMove ? 'Saving…' : pendingMove.booked ? 'Move and email clients' : 'Move'}
            </button>
          </div>
        </div>
      )}

      {preview && (() => {
        const { cls, rect } = preview;
        const start = labelToMinutes(cls.time) ?? DAY_START;
        const end = start + durationOf(cls);
        const coach = coaches.find(c => c.id === cls.coachId || c.name === cls.instructor);
        const spotsLeft = Math.max(0, cls.capacity - (cls.takenSpots?.length ?? 0));
        const [y, m, dd] = (cls.date ?? '').split('-').map(Number);
        const dateText = cls.date ? new Date(y, m - 1, dd).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : cls.dateId;
        const status = cls.isCancelled ? 'Cancelled' : cls.isDone ? 'Started' : cls.isFull ? 'Full' : null;
        // Under the private filter a group class is offered as a private session.
        const bookedAs = !isAdmin && classType === PRIVATE_FILTER && !isPrivateType(cls.title) ? (privateKind(initialPrivateKind)?.title ?? PRIVATE_FILTER) : cls.title;
        const width = 272;
        const left = rect.right + 8 + width < window.innerWidth ? rect.right + 8 : Math.max(8, rect.left - width - 8);
        const top = Math.min(Math.max(8, rect.top), window.innerHeight - 240);
        const hint = isAdmin ? 'Drag to move · click to edit'
          : status ? null
          : user ? 'Click to book this class' : 'Click to sign in and book';
        return (
          <div role="tooltip" className="fixed z-[60] pointer-events-none animate-fade-in" style={{ left, top, width }}>
            <div className="bg-white text-[#3A2A20] rounded-2xl shadow-xl border border-[#E8E2D9] p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className={`font-bold text-base leading-tight ${cls.isCancelled ? 'line-through' : ''}`}>{cls.title}</p>
                {status && <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cls.isCancelled ? 'text-[#E02424] bg-[#E02424]/10' : 'text-[#3A2A20]/60 bg-black/5'}`}>{status}</span>}
              </div>
              <p className="text-xs text-[#3A2A20]/60 mb-3">{dateText}</p>
              <dl className="space-y-1.5 text-sm">
                <div className="flex gap-2"><dt className="w-16 shrink-0 text-[#3A2A20]/50">Time</dt><dd>{shortLabel(start)} – {shortLabel(end)} <span className="text-[#3A2A20]/50">({end - start} min)</span></dd></div>
                <div className="flex gap-2"><dt className="w-16 shrink-0 text-[#3A2A20]/50">Coach</dt><dd>{cls.instructor}{coach?.specialty ? <span className="block text-xs text-[#3A2A20]/50">{coach.specialty}</span> : null}</dd></div>
                <div className="flex gap-2"><dt className="w-16 shrink-0 text-[#3A2A20]/50">Branch</dt><dd>{cls.branch}</dd></div>
                <div className="flex gap-2"><dt className="w-16 shrink-0 text-[#3A2A20]/50">Spots</dt><dd>{spotsLeft} of {cls.capacity} left</dd></div>
                <div className="flex gap-2"><dt className="w-16 shrink-0 text-[#3A2A20]/50">Price</dt><dd>₱{priceFor(bookedAs).toLocaleString('en-US')} {isPrivateType(bookedAs) ? 'per session' : 'per person'}{bookedAs !== cls.title ? ` (as ${bookedAs})` : ''}</dd></div>
              </dl>
              {hint && <p className="mt-3 pt-3 border-t border-[#E8E2D9] text-xs font-bold text-brand-brown">{hint}</p>}
            </div>
          </div>
        );
      })()}
    </section>
  );
}
