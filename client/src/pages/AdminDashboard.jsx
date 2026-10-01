import { useState, useEffect } from 'react';
import Navbar from '../components/organisms/Navbar';
import ClassScheduleGrid from '../components/organisms/ClassScheduleGrid';
import CustomDropdown from '../components/atoms/CustomDropdown';
import { Calendar, Users, UserCheck, ClipboardCheck, Settings, CheckCircle, XCircle, Plus, Minus, Edit3, LayoutList, ChevronLeft, ChevronRight, ChevronDown, Search, ArrowUp, ArrowDown, Filter, Upload } from 'lucide-react';
import AdminCoaches from '../components/organisms/AdminCoaches';
import AdminStudioSettings from '../components/organisms/AdminStudioSettings';
import AdminClientProfile from '../components/organisms/AdminClientProfile';
import { apiFetch } from '../api/base';
import { CLASS_TYPES, DEFAULT_CAPACITY } from '../api/classTypes';
import { DAY_START, DAY_END, hourLabels, labelToMinutes, minutesToLabel, parseTimeInput, durationOf } from '../api/time';

// A time box: type any time, or pick a whole hour from the suggestions.
function TimeField({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">{label}</label>
      <input
        id={id}
        list={`${id}-options`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // Clicking in selects the whole time, so typing replaces it.
        onFocus={(e) => e.target.select()}
        onBlur={(e) => {
          const minutes = parseTimeInput(e.target.value);
          if (minutes !== null) onChange(minutesToLabel(minutes));
        }}
        placeholder="e.g. 10:15 AM"
        autoComplete="off"
        className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium text-sm"
      />
      <datalist id={`${id}-options`}>
        {options.map(option => <option key={option} value={option} />)}
      </datalist>
    </div>
  );
}

// The time boxes suggest whole hours, but any time can be typed (like 10:15).
const START_TIME_OPTIONS = hourLabels(DAY_START, DAY_END - 60);
const END_TIME_OPTIONS = hourLabels(DAY_START + 60, DAY_END);

const MAX_CAPACITY = 50;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [profileEmail, setProfileEmail] = useState(null);
  // The receipt image of the booking being verified, fetched when it opens.
  const [bookingReceipt, setBookingReceipt] = useState({ state: 'idle', src: null });
  // A package purchase receipt shown full size.
  const [receiptPreview, setReceiptPreview] = useState(null);

  useEffect(() => {
    if (!selectedBooking) return;
    if (!selectedBooking.hasReceipt) {
      setBookingReceipt({ state: 'none', src: null });
      return;
    }
    setBookingReceipt({ state: 'loading', src: null });
    apiFetch(`/api/bookings/${selectedBooking.id}/receipt`)
      .then(res => res.json())
      .then(data => setBookingReceipt({ state: data.receipt ? 'ready' : 'none', src: data.receipt }))
      .catch(() => setBookingReceipt({ state: 'error', src: null }));
  }, [selectedBooking]);

  const openPurchaseReceipt = (purchase) => {
    setReceiptPreview({ state: 'loading', src: null, title: `${purchase.clientName || purchase.clientEmail} • ${purchase.name}` });
    apiFetch(`/api/package-purchases/${purchase.id}/receipt`)
      .then(res => res.json())
      .then(data => setReceiptPreview(prev => prev && { ...prev, state: 'ready', src: data.receipt }))
      .catch(() => setReceiptPreview(prev => prev && { ...prev, state: 'error' }));
  };
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [prefilledClassData, setPrefilledClassData] = useState(null);
  const [classTypeTitle, setClassTypeTitle] = useState('Reformer Flow');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [modalStartTime, setModalStartTime] = useState('08:00 AM');
  const [modalEndTime, setModalEndTime] = useState('09:00 AM');
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY['Reformer Flow']);
  const [coachId, setCoachId] = useState('');
  const [classFormError, setClassFormError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Clients state
  const [clientSearch, setClientSearch] = useState('');
  const [clientSort, setClientSort] = useState('name');
  const [clientSortDir, setClientSortDir] = useState('asc');

  const [clientsData, setClientsData] = useState([]);

  useEffect(() => {
    apiFetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) setClientsData(data.users);
      })
      .catch(err => console.error("Error fetching users:", err));
  }, []);
  const [scheduleView, setScheduleView] = useState('calendar'); // 'list' or 'calendar'
  const [selectedBranch, setSelectedBranch] = useState('Angeles Branch');
  
  const isAngeles = selectedBranch === 'Angeles Branch';
  const branchName = isAngeles ? 'Angeles' : 'San Fernando';

  const [coaches, setCoaches] = useState([]);

  const fetchCoaches = () => {
    apiFetch('/api/coaches')
      .then(res => res.json())
      .then(data => {
        if (data.coaches) setCoaches(data.coaches);
      })
      .catch(err => console.error("Error fetching coaches:", err));
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  // Only coaches who teach at the branch being managed can be its instructors.
  const branchCoaches = coaches.filter(coach => coach.branches.includes(branchName));
  
  const theme = {
    bg: isAngeles ? 'bg-[#2A180E]' : 'bg-[#D8CFC4]',
    bgHover: isAngeles ? 'hover:bg-[#1A0F08]' : 'hover:bg-[#C0B7AB]',
    text: isAngeles ? 'text-white' : 'text-[#3A2A20]',
    border: isAngeles ? 'border-[#2A180E]' : 'border-[#D8CFC4]',
    pillBg: isAngeles ? 'bg-[#2A180E]/10' : 'bg-[#D8CFC4]/50',
    pillText: isAngeles ? 'text-[#2A180E]' : 'text-[#3A2A20]',
  };
  
  // Simulated State for pending bookings
  const [pendingBookings, setPendingBookings] = useState([]);

  useEffect(() => {
    apiFetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (data.bookings) setPendingBookings(data.bookings);
      })
      .catch(console.error);
  }, []);

  const [bookingError, setBookingError] = useState('');

  const setBookingStatus = async (id, status) => {
    setBookingError('');
    try {
      const res = await apiFetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setPendingBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      ));
      setSelectedBooking(null);
      // The booking is confirmed either way; this only says the email did not go out.
      if (data?.emailed === false) {
        window.alert('The booking is confirmed, but the confirmation email could not be sent. Please let the client know yourself.');
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
      setBookingError(`Could not update the booking: ${error.message}`);
    }
  };

  const [packagePurchases, setPackagePurchases] = useState([]);
  const [purchaseError, setPurchaseError] = useState('');
  const [busyPurchaseId, setBusyPurchaseId] = useState(null);

  useEffect(() => {
    apiFetch('/api/package-purchases')
      .then(res => res.json())
      .then(data => {
        if (data.purchases) setPackagePurchases(data.purchases);
      })
      .catch(console.error);
  }, []);

  // Activating starts the package's validity and emails the client.
  const setPurchaseStatus = async (purchase, status) => {
    if (status === 'rejected' && !window.confirm(`Reject ${purchase.clientName || purchase.clientEmail}'s payment for ${purchase.name}?`)) return;
    setPurchaseError('');
    setBusyPurchaseId(purchase.id);
    try {
      const res = await apiFetch(`/api/package-purchases/${purchase.id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setPackagePurchases(prev => prev.map(p => (p.id === purchase.id ? data : p)));
      if (data.emailed === false) {
        window.alert('The package is active, but the email to the client could not be sent. Please let them know yourself.');
      }
    } catch (error) {
      setPurchaseError(`Could not update the purchase: ${error.message}`);
    } finally {
      setBusyPurchaseId(null);
    }
  };

  const handleConfirm = (id) => setBookingStatus(id, 'confirmed');
  const handleReject = (id) => setBookingStatus(id, 'rejected');

  const changeCapacity = (delta) => {
    setCapacity(prev => Math.min(MAX_CAPACITY, Math.max(1, (Number(prev) || 0) + delta)));
  };

  // Cancelling keeps the class on the schedule, marked as cancelled, so clients
  // who were planning to come can see what happened. It can be restored.
  const handleSetCancelled = async (isCancelled) => {
    if (isCancelled && !window.confirm(`Cancel ${editingClass.title} at ${editingClass.time}? Clients will see it as cancelled and will not be able to book it, and everyone already booked will be emailed.`)) {
      return;
    }
    setClassFormError('');
    try {
      const res = await apiFetch(`/api/classes/${editingClass.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCancelled })
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Request failed');
      setIsClassModalOpen(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Failed to update class:", error);
      setClassFormError(`Could not ${isCancelled ? 'cancel' : 'restore'} the class: ${error.message}`);
    }
  };

  const MENU_ITEMS = [
    { id: 'pending', label: 'Pending Verifications', icon: ClipboardCheck },
    { id: 'schedule', label: 'Manage Schedule', icon: Calendar },
    { id: 'coaches', label: 'Coaches', icon: UserCheck },
    { id: 'users', label: 'Client Directory', icon: Users },
    { id: 'settings', label: 'Studio Settings', icon: Settings },
  ];

  const renderContent = () => {
    if (activeTab === 'pending') {
      const pendingList = pendingBookings.filter(b => b.status === 'pending');
      const resolvedList = pendingBookings.filter(b => b.status !== 'pending');

      return (
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-brand-dark mb-8 flex items-baseline gap-3">
            Pending Verifications
            <span className={`text-lg font-medium px-3 py-1 rounded-full ${theme.pillBg} ${theme.pillText}`}>
              {selectedBranch === 'Angeles Branch' ? 'Angeles' : 'San Fernando'}
            </span>
          </h2>
          
          {/* Phones get one card per booking instead of a wide table. */}
          <div className="md:hidden space-y-3 mb-12">
            {pendingList.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 py-8 text-center text-brand-dark/50 font-medium">No pending verifications.</div>
            ) : pendingList.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-brand-sand/30 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-brand-dark break-words">{booking.clientName}</p>
                    <p className="text-xs text-brand-dark/50">Booking {booking.id}</p>
                  </div>
                  <span className="font-mono text-xs text-brand-dark/70 bg-brand-sand/20 px-2 py-1 rounded shrink-0 max-w-[45%] truncate">{booking.referenceId || 'No ref'}</span>
                </div>
                <p className="text-sm font-bold text-brand-dark">{booking.className}</p>
                <p className="text-xs text-brand-dark/60 mb-4">{booking.date} at {booking.time} • Spot {booking.spot}</p>
                <button
                  onClick={() => { setBookingError(''); setSelectedBooking(booking); }}
                  className={`w-full ${theme.bg} ${theme.text} ${theme.bgHover} text-sm font-bold px-4 py-3 rounded-lg transition-colors`}
                >
                  Verify Receipt
                </button>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-brand-sand/30 overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-brand-sand/20 border-b border-brand-sand/50">
                    <th className="py-4 px-6 font-bold text-brand-dark text-sm">Booking ID</th>
                    <th className="py-4 px-6 font-bold text-brand-dark text-sm">Client</th>
                    <th className="py-4 px-6 font-bold text-brand-dark text-sm">Class Details</th>
                    <th className="py-4 px-6 font-bold text-brand-dark text-sm">Ref Number</th>
                    <th className="py-4 px-6 font-bold text-brand-dark text-sm text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-brand-dark/50 font-medium">
                        No pending verifications.
                      </td>
                    </tr>
                  ) : (
                    pendingList.map((booking) => (
                      <tr key={booking.id} className="border-b border-brand-sand/20 hover:bg-black/5 transition-colors">
                        <td className="py-4 px-6 font-bold text-brand-dark text-sm">{booking.id}</td>
                        <td className="py-4 px-6 text-brand-dark text-sm">{booking.clientName}</td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-brand-dark">{booking.className}</p>
                          <p className="text-xs text-brand-dark/60">{booking.date} at {booking.time} • Spot {booking.spot}</p>
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-brand-dark/80">{booking.referenceId}</td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => { setBookingError(''); setSelectedBooking(booking); }}
                            className={`${theme.bg} ${theme.text} ${theme.bgHover} text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap`}
                          >
                            Verify Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="text-xl font-bold text-brand-dark mb-4">Recently Resolved</h2>
          <div className="md:hidden bg-white rounded-xl shadow-sm border border-brand-sand/30 divide-y divide-brand-sand/20">
            {resolvedList.length === 0 ? (
              <p className="py-4 text-center text-brand-dark/50 text-sm">No resolved bookings yet.</p>
            ) : resolvedList.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-brand-dark font-medium truncate">{booking.clientName}</p>
                  <p className="text-xs text-brand-dark/50">Booking {booking.id}</p>
                </div>
                <div className="shrink-0">
                        {booking.status === 'confirmed' ? (
                          <span className="text-green-600 font-bold flex items-center gap-1 text-sm"><CheckCircle size={14}/> Confirmed</span>
                        ) : booking.status === 'cancelled' ? (
                          <span className="text-brand-dark/50 font-bold flex items-center gap-1 text-sm"><XCircle size={14}/> Cancelled by client</span>
                        ) : (
                          <span className="text-red-600 font-bold flex items-center gap-1 text-sm"><XCircle size={14}/> Rejected</span>
                        )}
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-brand-sand/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse opacity-70 min-w-[500px]">
                <thead>
                  <tr className="bg-brand-sand/10 border-b border-brand-sand/50">
                    <th className="py-3 px-6 font-bold text-brand-dark text-xs">Booking ID</th>
                    <th className="py-3 px-6 font-bold text-brand-dark text-xs">Client</th>
                    <th className="py-3 px-6 font-bold text-brand-dark text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedList.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-4 text-center text-brand-dark/50 text-sm">
                        No resolved bookings yet.
                      </td>
                    </tr>
                  ) : (
                    resolvedList.map((booking) => (
                      <tr key={booking.id} className="border-b border-brand-sand/20">
                        <td className="py-3 px-6 text-brand-dark text-sm">{booking.id}</td>
                        <td className="py-3 px-6 text-brand-dark text-sm">{booking.clientName}</td>
                        <td className="py-3 px-6 text-sm">
                          {booking.status === 'confirmed' ? (
                            <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14}/> Confirmed</span>
                          ) : booking.status === 'cancelled' ? (
                            <span className="text-brand-dark/50 font-bold flex items-center gap-1 text-sm"><XCircle size={14}/> Cancelled by client</span>
                          ) : (
                            <span className="text-red-600 font-bold flex items-center gap-1"><XCircle size={14}/> Rejected</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="text-xl font-bold text-brand-dark mt-12 mb-1">Package purchases</h2>
          <p className="text-sm text-brand-dark/60 mb-4">Check each reference number against your GCash or BPI records, then activate the package. The client is emailed and their validity period starts now.</p>
          {purchaseError && <p role="alert" className="mb-4 text-sm font-medium text-[#E02424]">{purchaseError}</p>}
          {(() => {
            const pendingPurchases = packagePurchases.filter(p => p.status === 'pending');
            const recentPurchases = packagePurchases.filter(p => p.status !== 'pending').slice(0, 8);
            const statusText = { active: ['Active', 'text-green-600'], expired: ['Expired', 'text-brand-dark/50'], rejected: ['Rejected', 'text-red-600'] };
            return (
              <>
                {pendingPurchases.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 py-8 text-center text-brand-dark/50 font-medium">No package purchases waiting.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingPurchases.map((p) => (
                      <div key={p.id} className="bg-white rounded-xl shadow-sm border border-brand-sand/30 p-5 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            <p className="font-bold text-brand-dark break-words">{p.clientName || 'No name yet'}</p>
                            <p className="text-xs text-brand-dark/60 break-all">{p.clientEmail}</p>
                          </div>
                          <p className="font-bold text-brand-dark shrink-0">{p.price}</p>
                        </div>
                        <p className="text-sm font-bold text-brand-dark">{p.name}</p>
                        <p className="text-xs text-brand-dark/60 mb-4">
                          Ref <span className="font-mono">{p.referenceId}</span> • Bought {new Date(p.purchasedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          {p.hasReceipt && <> • <button onClick={() => openPurchaseReceipt(p)} className="font-bold text-brand-brown underline underline-offset-2">View receipt</button></>}
                        </p>
                        <div className="mt-auto flex gap-3">
                          <button
                            onClick={() => setPurchaseStatus(p, 'rejected')}
                            disabled={busyPurchaseId === p.id}
                            className="flex-1 py-2.5 rounded-lg border border-[#ffb3b3] text-[#E02424] font-bold text-sm hover:bg-[#fff5f5] transition-colors disabled:opacity-60"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setPurchaseStatus(p, 'active')}
                            disabled={busyPurchaseId === p.id}
                            className={`flex-1 py-2.5 rounded-lg ${theme.bg} ${theme.text} ${theme.bgHover} font-bold text-sm transition-colors disabled:opacity-60`}
                          >
                            {busyPurchaseId === p.id ? 'Saving…' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {recentPurchases.length > 0 && (
                  <div className="mt-4 bg-white rounded-xl shadow-sm border border-brand-sand/30 divide-y divide-brand-sand/20">
                    {recentPurchases.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                        <div className="min-w-0">
                          <p className="text-sm text-brand-dark font-medium truncate">{p.clientName || p.clientEmail} • {p.name}</p>
                          <p className="text-xs text-brand-dark/50">Ref {p.referenceId}</p>
                        </div>
                        <span className={`text-sm font-bold shrink-0 ${statusText[p.status]?.[1] ?? ''}`}>{statusText[p.status]?.[0] ?? p.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      );
    }
    if (activeTab === 'schedule') {
      const adminHeaderContent = (
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <h2 className="text-2xl md:text-[32px] font-bold text-[#3A2A20] tracking-tight">Upcoming Schedule</h2>
            <span className={`${theme.pillBg} ${theme.pillText} px-3 py-1 rounded-full text-[13px] font-bold`}>{selectedBranch === 'Angeles Branch' ? 'Angeles' : 'San Fernando'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-[10px] border border-[#E8E2D9] flex p-1 shadow-sm">
              <button 
                onClick={() => setScheduleView('calendar')}
                className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-[13px] font-bold transition-colors ${scheduleView === 'calendar' ? 'bg-[#F5F2ED] text-[#3A2A20]' : 'text-[#3A2A20]/50 hover:text-[#3A2A20]'}`}
              >
                <Calendar size={16} /> Calendar
              </button>
              <button 
                onClick={() => setScheduleView('list')}
                className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-[13px] font-bold transition-colors ${scheduleView === 'list' ? 'bg-[#F5F2ED] text-[#3A2A20]' : 'text-[#3A2A20]/50 hover:text-[#3A2A20]'}`}
              >
                <LayoutList size={16} /> List
              </button>
            </div>
            <button 
              onClick={() => {
                setEditingClass(null);
                setPrefilledClassData(null);
                setClassTypeTitle('Reformer Flow');
                setCapacity(DEFAULT_CAPACITY['Reformer Flow']);
                setCoachId(branchCoaches[0]?.id ?? '');
                setClassFormError('');
                setIsClassModalOpen(true);
              }}
              className={`${theme.bg} ${theme.text} ${theme.bgHover} px-5 py-2.5 rounded-[10px] font-bold text-[13px] flex items-center gap-2 whitespace-nowrap transition-colors shadow-sm`}
            >
              <Plus size={16} /> Add Class
            </button>
          </div>
        </div>
      );

      return (
        <div className="animate-fade-in -mx-4 sm:-mx-6 lg:-mx-12 mt-[-30px]">
          <ClassScheduleGrid 
            hideTitle={true} 
            adminHeader={adminHeaderContent} 
            branch={selectedBranch}
            refreshKey={refreshKey}
            view={scheduleView}
            onClassClick={(cls) => {
              setEditingClass(cls);
              setPrefilledClassData(null);
              setClassTypeTitle(cls.title || 'Reformer Flow');
              setCapacity(cls.capacity ?? DEFAULT_CAPACITY[cls.title] ?? DEFAULT_CAPACITY['Reformer Flow']);
              setCoachId(cls.coachId);
              setClassFormError('');
              setModalStartTime(cls.time);
              setModalEndTime(minutesToLabel((labelToMinutes(cls.time) ?? DAY_START) + durationOf(cls)));

              setIsClassModalOpen(true);
            }}
            onEmptySlotClick={(dateId, time) => {
              setEditingClass(null);
              setClassTypeTitle('Reformer Flow');
              setCapacity(DEFAULT_CAPACITY['Reformer Flow']);
              setCoachId(branchCoaches[0]?.id ?? '');
              setClassFormError('');
              const d = new Date(dateId);
              // Adjust for local timezone to ensure YYYY-MM-DD is correct
              const date = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
              
              setModalStartTime(time);
              setModalEndTime(minutesToLabel((labelToMinutes(time) ?? DAY_START) + 60));

              setPrefilledClassData({ date });
              setIsClassModalOpen(true);
            }}
          />
        </div>
      );
    }


    if (activeTab === 'coaches') {
      return <AdminCoaches coaches={coaches} branch={branchName} theme={theme} onChanged={fetchCoaches} />;
    }

    if (activeTab === 'users') {
      let filteredClients = clientsData.filter(client => {
        return client.name.toLowerCase().includes(clientSearch.toLowerCase()) || client.email.toLowerCase().includes(clientSearch.toLowerCase());
      });

      filteredClients.sort((a, b) => {
        let valA = a[clientSort];
        let valB = b[clientSort];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return clientSortDir === 'asc' ? -1 : 1;
        if (valA > valB) return clientSortDir === 'asc' ? 1 : -1;
        return 0;
      });

      const handleSort = (key) => {
        if (clientSort === key) {
          setClientSortDir(clientSortDir === 'asc' ? 'desc' : 'asc');
        } else {
          setClientSort(key);
          setClientSortDir('asc');
        }
      };

      const SortIcon = ({ column }) => {
        if (clientSort !== column) return null;
        return clientSortDir === 'asc' ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />;
      };

      return (
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <h2 className="text-3xl font-bold text-brand-dark">Client Directory</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40" />
                <input 
                  type="text" 
                  placeholder="Search clients..." 
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full bg-white border border-brand-sand/50 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-brand-brown text-sm font-medium"
                />
              </div>
            </div>
          </div>
          
          <div className="md:hidden space-y-3">
            {filteredClients.length > 0 ? filteredClients.map((user) => (
              <button key={user.email} onClick={() => setProfileEmail(user.email)} className="w-full text-left bg-white rounded-xl shadow-sm border border-brand-sand/30 p-5 flex items-center justify-between gap-4 hover:border-brand-brown transition-colors">
                <div className="min-w-0">
                  <p className="font-bold text-brand-dark break-words">{user.name || <span className="font-normal opacity-50">No name yet</span>}</p>
                  <p className="text-sm text-brand-dark/70 break-all">{user.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-brand-dark leading-none">{user.bookings}</p>
                  <p className="text-[11px] text-brand-dark/50 mt-1">{user.bookings === 1 ? 'booking' : 'bookings'}</p>
                </div>
              </button>
            )) : (
              <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 py-8 text-center text-brand-dark/50 font-medium">No clients found matching your search.</div>
            )}
          </div>

          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-brand-sand/30 overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-brand-sand/10 border-b border-brand-sand/50">
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm cursor-pointer hover:bg-black/5" onClick={() => handleSort('name')}>
                    Client Name <SortIcon column="name" />
                  </th>
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm cursor-pointer hover:bg-black/5" onClick={() => handleSort('email')}>
                    Email <SortIcon column="email" />
                  </th>
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm cursor-pointer hover:bg-black/5" onClick={() => handleSort('bookings')}>
                    Bookings <SortIcon column="bookings" />
                  </th>
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? filteredClients.map((user, idx) => (
                  <tr key={idx} className="border-b border-brand-sand/20 hover:bg-black/5 transition-colors">
                    <td className="py-4 px-6 font-bold text-brand-dark text-sm">{user.name || <span className="font-normal opacity-50">No name yet</span>}</td>
                    <td className="py-4 px-6 text-brand-dark text-sm">{user.email}</td>
                    <td className="py-4 px-6 text-brand-dark text-sm">{user.bookings}</td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => setProfileEmail(user.email)} className="text-brand-brown hover:underline text-sm font-bold">View Profile</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-brand-dark/50 font-medium">No clients found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'settings') {
      return <AdminStudioSettings theme={theme} />;
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans pt-[90px]">
      <Navbar adminTheme={isAngeles ? 'dark' : 'light'} />
      
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-90px)] max-w-7xl mx-auto w-full border-x border-brand-sand/30 bg-white">
        
        {/* Admin Sidebar */}
        <aside className="w-full lg:w-[320px] bg-white border-b lg:border-b-0 lg:border-r border-brand-sand/30 flex flex-col shrink-0">
          <div className="p-8 pb-4">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Studio Admin</h2>
            <div className={`rounded-lg transition-colors z-50 ${theme.bg} ${theme.text}`}>
              <CustomDropdown
                value={selectedBranch}
                onChange={setSelectedBranch}
                options={['Angeles Branch', 'San Fernando Branch']}
                triggerClassName="px-4 py-2"
              />
            </div>
          </div>
          
          <nav className="flex-1 py-4 flex flex-row lg:flex-col overflow-x-auto scrollbar-hide gap-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={(e) => {
                  setActiveTab(item.id);
                  // On phones the menu is a sideways strip: keep the picked item in view.
                  e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
                }}
                className={`flex-none flex items-center gap-4 px-6 lg:px-8 py-3.5 transition-colors text-left border-b-2 lg:border-b-0 lg:border-l-4 ${
                  activeTab === item.id 
                    ? `${theme.pillBg} ${theme.border} text-brand-dark font-bold` 
                    : 'border-transparent text-brand-dark/60 hover:bg-black/5 hover:text-brand-dark'
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? theme.pillText : 'text-brand-dark/40'} />
                <span className="text-sm whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full p-6 sm:p-10 lg:p-12 min-w-0 bg-[#FAF7F2]">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {profileEmail && <AdminClientProfile email={profileEmail} onClose={() => setProfileEmail(null)} />}

      {receiptPreview && (
        <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4 animate-fade-in" onClick={() => setReceiptPreview(null)}>
          <div role="dialog" aria-modal="true" aria-label="Receipt" className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-brand-sand/30">
              <p className="font-bold text-brand-dark text-sm truncate">{receiptPreview.title}</p>
              <button onClick={() => setReceiptPreview(null)} aria-label="Close" className="text-brand-dark/40 hover:text-brand-dark"><XCircle size={22} /></button>
            </div>
            <div className="flex-1 overflow-auto bg-[#FAF7F2] flex items-center justify-center min-h-[200px]">
              {receiptPreview.state === 'ready' && receiptPreview.src ? (
                <img src={receiptPreview.src} alt="Payment receipt" className="max-w-full" />
              ) : (
                <p className="text-sm text-brand-dark/60 p-8">{receiptPreview.state === 'loading' ? 'Loading receipt…' : 'The receipt could not be loaded.'}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            {/* Receipt Image Side (Edge-to-Edge) */}
            <div className="w-full md:w-1/2 h-64 md:h-auto">
              {bookingReceipt.state === 'ready' ? (
                <a href={bookingReceipt.src} target="_blank" rel="noreferrer" title="Open full size" className="block w-full h-full bg-[#FAF7F2]">
                  <img 
                    src={bookingReceipt.src} 
                    alt="Payment receipt" 
                    className="w-full h-full object-contain"
                  />
                </a>
              ) : (
                <div className="w-full h-full bg-[#FAF7F2] flex items-center justify-center p-8 text-center text-sm text-[#1C2C39]/60">
                  {bookingReceipt.state === 'loading' ? 'Loading receipt…'
                    : bookingReceipt.state === 'error' ? 'The receipt could not be loaded.'
                    : 'No receipt image was uploaded. Check the reference number against your GCash or BPI records.'}
                </div>
              )}
            </div>
            
            {/* Details & Actions Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xl font-bold text-[#1C2C39]">Verify Payment</h3>
                <button onClick={() => setSelectedBooking(null)} className="text-[#1C2C39]/40 hover:text-[#1C2C39] transition-colors">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-5 flex-1">
                <div>
                  <p className="text-[10px] font-bold text-[#1C2C39]/40 uppercase tracking-widest mb-1">Booking ID</p>
                  <p className="text-sm font-medium text-[#1C2C39]">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1C2C39]/40 uppercase tracking-widest mb-1">Client</p>
                  <p className="text-sm font-medium text-[#1C2C39]">{selectedBooking.clientName}</p>
                  <p className="text-[13px] text-[#1C2C39]/60 mt-0.5 break-all">{selectedBooking.clientEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1C2C39]/40 uppercase tracking-widest mb-1">Class</p>
                  <p className="text-sm font-medium text-[#1C2C39]">{selectedBooking.className}</p>
                  <p className="text-[13px] text-[#1C2C39]/60 mt-0.5">{selectedBooking.date} • {selectedBooking.time}</p>
                </div>
                
                <div className="bg-[#FAF7F2] p-5 rounded-[12px] border border-[#E8E2D9] mt-6">
                  <p className="text-[10px] font-bold text-[#1C2C39]/40 uppercase tracking-widest mb-1">Amount Due</p>
                  <p className="text-xl font-bold text-[#1C2C39] mb-4">{selectedBooking.amount}</p>
                  
                  <p className="text-[10px] font-bold text-[#1C2C39]/40 uppercase tracking-widest mb-1">Submitted Ref No.</p>
                  <p className="font-mono font-bold text-[#1C2C39]">{selectedBooking.referenceId}</p>
                </div>
              </div>

              {bookingError && <p role="alert" className="mt-6 text-sm font-medium text-[#E02424]">{bookingError}</p>}

              <div className="mt-8 flex gap-3 pt-6 border-t border-[#E8E2D9]">
                <button 
                  onClick={() => handleReject(selectedBooking.id)}
                  className="flex-1 py-3.5 rounded-[10px] border border-[#ffb3b3] text-[#E02424] font-bold text-[13px] hover:bg-[#fff5f5] transition-colors"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleConfirm(selectedBooking.id)}
                  className={`flex-1 py-3.5 rounded-[10px] ${theme.bg} ${theme.text} ${theme.bgHover} font-bold text-[13px] transition-colors shadow-sm`}
                >
                  Confirm Booking
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Class Form Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const sMins = parseTimeInput(modalStartTime);
              const eMins = parseTimeInput(modalEndTime);
              if (sMins === null || eMins === null) {
                setClassFormError('Please enter the start and end times, like 9:00 AM or 10:15.');
                return;
              }
              const durationMins = eMins - sMins;
              if (durationMins < 15) {
                setClassFormError('The end time must be at least 15 minutes after the start time.');
                return;
              }
              const timeStr = minutesToLabel(sMins);

              if (!coachId) {
                setClassFormError(`Add a coach for the ${branchName} branch first, under Coaches.`);
                return;
              }
              
              const [y, m, d] = formData.get('date').split('-');
              const localDate = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
              
              const newClass = {
                title: classTypeTitle,
                time: timeStr,
                date: formData.get('date'),
                dateId: localDate.toDateString(),
                coachId,
                branch: selectedBranch === 'Angeles Branch' ? 'Angeles' : 'San Fernando',
                duration: durationMins,
                capacity: Number(capacity),
                isFull: editingClass ? editingClass.isFull : false,
                isEmpty: editingClass ? editingClass.isEmpty : true,
                isDone: editingClass ? editingClass.isDone : false
              };
            
              try {
                const method = editingClass ? 'PATCH' : 'POST';
                const url = editingClass 
                  ? `/api/classes/${editingClass.id}`
                  : '/api/classes';

                setClassFormError('');
                const res = await apiFetch(url, {
                  method,
                  body: JSON.stringify(newClass)
                });
                if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Request failed');
                setIsClassModalOpen(false);
                setRefreshKey(prev => prev + 1);
              } catch (error) {
                console.error("Failed to save class:", error);
                setClassFormError(`Could not save the class: ${error.message}`);
              }
            }} className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-bold text-brand-dark">{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
                <button type="button" onClick={() => setIsClassModalOpen(false)} className="text-brand-dark/40 hover:text-brand-dark transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Class Name</label>
                    <div className="bg-white border border-brand-sand/50 rounded-lg focus-within:border-brand-brown z-40 relative">
                      <CustomDropdown
                        value={classTypeTitle}
                        onChange={(title) => {
                          setClassTypeTitle(title);
                          setCapacity(DEFAULT_CAPACITY[title] ?? 1);
                        }}
                        options={CLASS_TYPES}
                        triggerClassName="px-4 py-3"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="class-date" className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Date</label>
                      <input id="class-date" name="date" required type="date" defaultValue={
                        editingClass?.date || prefilledClassData?.date || ''
                      } className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium text-sm" />
                    </div>
                    <TimeField
                      id="class-start"
                      label="Start Time"
                      value={modalStartTime}
                      options={START_TIME_OPTIONS}
                      onChange={(value) => {
                        setModalStartTime(value);
                        // Keep the end an hour later when the start moves past it.
                        const start = parseTimeInput(value);
                        const end = parseTimeInput(modalEndTime);
                        if (start !== null && (end === null || end <= start)) setModalEndTime(minutesToLabel(start + 60));
                      }}
                    />
                    <TimeField
                      id="class-end"
                      label="End Time"
                      value={modalEndTime}
                      options={END_TIME_OPTIONS}
                      onChange={setModalEndTime}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Instructor</label>
                    {branchCoaches.length === 0 ? (
                      <p className="border border-dashed border-brand-sand rounded-lg px-4 py-3 text-sm text-brand-dark/60">
                        No coaches at the {branchName} branch yet. Add one under Coaches first.
                      </p>
                    ) : (
                      <div className="bg-white border border-brand-sand/50 rounded-lg focus-within:border-brand-brown z-[35] relative">
                        <CustomDropdown
                          value={branchCoaches.find(coach => coach.id === coachId)?.name}
                          onChange={(name) => setCoachId(branchCoaches.find(coach => coach.name === name).id)}
                          options={branchCoaches.map(coach => coach.name)}
                          placeholder="Choose an instructor"
                          triggerClassName="px-4 py-3"
                        />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Experience Level</label>
                      <div className="bg-white border border-brand-sand/50 rounded-lg focus-within:border-brand-brown z-30 relative">
                        <CustomDropdown
                          value={experienceLevel}
                          onChange={setExperienceLevel}
                          options={['Beginner', 'Intermediate', 'Advanced', 'All Levels']}
                          triggerClassName="px-4 py-3"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Capacity (Slots Available)</label>
                      <div className="flex items-stretch border border-brand-sand/50 rounded-lg overflow-hidden focus-within:border-brand-brown">
                        <button
                          type="button"
                          aria-label="Decrease capacity"
                          onClick={() => changeCapacity(-1)}
                          disabled={Number(capacity) <= 1}
                          className="px-3 text-brand-dark hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          name="capacity"
                          type="number"
                          required
                          min="1"
                          max={MAX_CAPACITY}
                          step="1"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                          className="w-full min-w-0 text-center py-3 focus:outline-none font-medium [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          aria-label="Increase capacity"
                          onClick={() => changeCapacity(1)}
                          disabled={Number(capacity) >= MAX_CAPACITY}
                          className="px-3 text-brand-dark hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
              </div>

              {editingClass?.isCancelled && (
                <p className="mt-6 text-sm font-bold text-[#E02424]">This class is cancelled. Clients see it as cancelled and cannot book it.</p>
              )}
              {classFormError && (
                <p role="alert" className="mt-6 text-sm font-medium text-[#E02424]">{classFormError}</p>
              )}

              <div className="mt-8 pt-6 border-t border-brand-sand/30 flex flex-wrap justify-end gap-2">
                {editingClass && (
                  editingClass.isCancelled ? (
                    <button
                      type="button"
                      onClick={() => handleSetCancelled(false)}
                      className="mr-auto px-5 py-3 rounded-xl border border-brand-sand font-bold text-brand-dark hover:bg-black/5 transition-colors"
                    >
                      Restore Class
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetCancelled(true)}
                      className="mr-auto px-5 py-3 rounded-xl border border-[#ffb3b3] text-[#E02424] font-bold hover:bg-[#fff5f5] transition-colors"
                    >
                      Cancel Class
                    </button>
                  )
                )}
                <button 
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-brand-dark hover:bg-black/5 transition-colors"
                >
                  {editingClass ? 'Close' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  className={`px-8 py-3 rounded-xl ${theme.bg} ${theme.text} ${theme.bgHover} font-bold transition-colors shadow-sm`}
                >
                  {editingClass ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
