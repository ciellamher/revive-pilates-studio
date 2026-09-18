import { useState } from 'react';
import Navbar from '../components/organisms/Navbar';
import { Calendar, Users, ClipboardCheck, Settings, CheckCircle, XCircle, Plus, Edit3, LayoutList, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [scheduleView, setScheduleView] = useState('calendar'); // 'list' or 'calendar'
  const [selectedBranch, setSelectedBranch] = useState('angeles');
  
  // Simulated State for pending bookings
  const [pendingBookings, setPendingBookings] = useState([
    {
      id: 'BK-7829',
      clientName: 'Graciella Jimenez',
      className: 'Reformer Flow',
      date: 'Thu, 20 Aug 2026',
      time: '08:00 AM',
      spot: 'S2',
      amount: '₱800',
      referenceId: 'GC-10928374',
      status: 'pending',
      receiptUrl: '/src/assets/revive-photos/reformer_22.jpg', // Dummy receipt
    },
    {
      id: 'BK-7830',
      clientName: 'John Doe',
      className: 'Mat Pilates',
      date: 'Fri, 21 Aug 2026',
      time: '10:00 AM',
      spot: 'S8',
      amount: '₱500',
      referenceId: 'BPI-998822',
      status: 'pending',
      receiptUrl: '/src/assets/revive-photos/reformer_11.jpg',
    }
  ]);

  const handleConfirm = (id) => {
    setPendingBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: 'confirmed' } : booking
    ));
    setSelectedBooking(null);
  };

  const handleReject = (id) => {
    setPendingBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: 'rejected' } : booking
    ));
    setSelectedBooking(null);
  };

  const MENU_ITEMS = [
    { id: 'pending', label: 'Pending Verifications', icon: ClipboardCheck },
    { id: 'schedule', label: 'Manage Schedule', icon: Calendar },
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
            <span className="text-lg font-medium text-brand-dark/50 bg-brand-sand/20 px-3 py-1 rounded-full">
              {selectedBranch === 'angeles' ? 'Angeles' : 'San Fernando'}
            </span>
          </h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 overflow-hidden mb-12">
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
                            onClick={() => setSelectedBooking(booking)}
                            className="bg-brand-brown text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
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
          <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 overflow-hidden">
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
        </div>
      );
    }
    if (activeTab === 'schedule') {
      const weekDays = [
        { day: 'Sun', date: '16', active: false },
        { day: 'Mon', date: '17', active: false },
        { day: 'Tue', date: '18', active: false },
        { day: 'Wed', date: '19', active: false },
        { day: 'Thu', date: '20', active: true },
        { day: 'Fri', date: '21', active: false },
        { day: 'Sat', date: '22', active: false },
      ];

      const renderCalendar = () => {
        const mockEvents = {
          '16': [
            { time: '08:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Bea', location: 'San Fernando' },
            { time: '10:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Bea', location: 'San Fernando' },
            { time: '01:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Giana', location: 'Angeles' },
            { time: '03:00 PM (50 min)', type: 'Private Session', instructor: 'Coach Giana', location: 'Angeles' },
          ],
          '17': [
             { time: '08:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Dani', location: 'Angeles' },
             { time: '09:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Dani', location: 'Angeles' },
             { time: '01:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Bea', location: 'San Fernando' },
             { time: '02:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Bea', location: 'San Fernando' },
             { time: '04:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Bea', location: 'Angeles' },
          ],
          '18': [
             { time: '08:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'San Fernando' },
             { time: '09:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'San Fernando' },
             { time: '10:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'Angeles' },
             { time: '04:00 PM (50 min)', type: 'Mat Pilates', instructor: 'Coach Chelsea', location: 'Angeles' },
             { time: '06:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Bea', location: 'San Fernando' },
          ],
          '19': [
             { time: '08:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'Angeles' },
             { time: '10:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'San Fernando' },
             { time: '02:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Bea', location: 'Angeles' },
             { time: '05:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Bea', location: 'San Fernando' },
          ],
          '20': [
             { time: '09:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'Angeles' },
             { time: '11:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Bea', location: 'San Fernando' },
             { time: '03:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'Angeles' },
             { time: '05:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Bea', location: 'San Fernando', full: true },
          ],
          '21': [
             { time: '08:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Van', location: 'Angeles' },
             { time: '10:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Van', location: 'San Fernando', full: true },
             { time: '02:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'Angeles' },
             { time: '06:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'San Fernando' },
          ],
          '22': [
             { time: '09:00 AM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'Angeles', full: true },
             { time: '10:30 AM (50 min)', type: 'Barre', instructor: 'Coach Alex', location: 'San Fernando' },
             { time: '02:00 PM (50 min)', type: 'Reformer Flow', instructor: 'Coach Chelsea', location: 'Angeles' },
          ],
        };

        return (
          <div className="bg-[#F8F5F0] rounded-[32px] p-8 mt-6 border border-brand-sand/30 shadow-sm">
            {/* Calendar Grid Wrapper */}
            <div className="bg-transparent rounded-3xl border border-brand-sand/30 overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-brand-sand/30 divide-x divide-brand-sand/30">
                {weekDays.map((d, i) => (
                  <div key={i} className="py-4 flex flex-col items-center justify-center gap-1 bg-transparent">
                    <span className="text-[10px] font-bold text-brand-dark/50">{d.day}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${d.active ? 'bg-[#3A2F2A] text-white' : 'text-brand-dark'}`}>
                      {d.date}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Columns */}
              <div className="grid grid-cols-7 divide-x divide-brand-sand/30 min-h-[500px]">
                {weekDays.map((d, i) => (
                  <div key={i} className="p-2 flex flex-col gap-2 bg-transparent">
                    {(mockEvents[d.date] || []).map((event, eIdx) => (
                      <div key={eIdx} className="bg-brand-brown/10 border-l-[3px] border-brand-brown rounded p-2 flex flex-col gap-0.5 hover:bg-brand-brown/20 cursor-pointer transition-colors shadow-sm">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-bold text-brand-dark/60 uppercase tracking-wider">{event.time}</span>
                          {event.full && <span className="text-[8px] font-bold text-red-700 tracking-widest bg-red-100 px-1 rounded-sm">FULL</span>}
                        </div>
                        <span className="text-[12px] font-bold text-brand-dark tracking-tight leading-tight">{event.type}</span>
                        <span className="text-[10px] text-brand-dark/70 font-medium leading-tight">{event.instructor} • {event.location}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      };

      return (
        <div className="animate-fade-in">
          {/* Header: Date Carousel */}
          <div className="flex justify-center items-center gap-12 mb-10 mt-4">
            <button className="w-10 h-10 rounded-full border border-brand-sand flex items-center justify-center text-brand-dark/50 hover:bg-white shadow-sm"><ChevronLeft size={16} /></button>
            <div className="flex gap-10">
              {weekDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-bold text-brand-dark/60">{d.day}</span>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm transition-colors ${d.active ? 'bg-[#3A2F2A] text-white' : 'text-brand-dark bg-transparent'}`}>
                    {d.date}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-10 h-10 rounded-full border border-brand-sand flex items-center justify-center text-brand-dark/50 hover:bg-white shadow-sm"><ChevronRight size={16} /></button>
          </div>

          {/* Filter Row */}
          <div className="flex w-full max-w-4xl mx-auto border border-brand-sand/50 rounded-full overflow-hidden divide-x divide-brand-sand/50 bg-transparent mb-12 shadow-sm">
            {['All categories', 'Location', 'Classes', 'Instructor'].map(filter => (
              <div key={filter} className="relative flex-1">
                <select className="w-full appearance-none bg-transparent px-6 py-3.5 pr-10 text-[13px] font-bold text-brand-dark outline-none cursor-pointer hover:bg-black/5 transition-colors">
                  <option>{filter}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown size={14} className="text-brand-dark/50" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-brand-dark uppercase tracking-tight mb-2 flex items-center gap-3">
                Upcoming Schedule
                <span className="text-sm font-bold text-brand-brown bg-brand-brown/10 px-3 py-1 rounded-full normal-case tracking-normal">
                  {selectedBranch === 'angeles' ? 'Angeles Branch' : 'San Fernando Branch'}
                </span>
              </h2>
              <p className="text-brand-dark/60 text-sm font-medium">Manage and view your studio schedule</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white rounded-lg border border-brand-sand/30 flex p-1 shadow-sm">
                <button 
                  onClick={() => setScheduleView('calendar')}
                  className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-bold transition-colors ${scheduleView === 'calendar' ? 'bg-brand-sand/30 text-brand-dark' : 'text-brand-dark/50 hover:text-brand-dark'}`}
                >
                  <Calendar size={16} /> Calendar
                </button>
                <button 
                  onClick={() => setScheduleView('list')}
                  className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-bold transition-colors ${scheduleView === 'list' ? 'bg-brand-sand/30 text-brand-dark' : 'text-brand-dark/50 hover:text-brand-dark'}`}
                >
                  <LayoutList size={16} /> List
                </button>
              </div>
              <button 
                onClick={() => {
                  setEditingClass(null);
                  setIsClassModalOpen(true);
                }}
                className="bg-brand-brown text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors shadow-sm"
              >
                <Plus size={18} /> Add Class
              </button>
            </div>
          </div>
          
          {scheduleView === 'list' ? (
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center justify-between mb-2 px-2">
                 <h3 className="text-xl font-bold text-brand-dark">Thu, 20 Aug <span className="text-sm font-medium text-brand-dark/50 ml-2">4 classes</span></h3>
              </div>

              {[
                { time: '09:00am', duration: '50 mins', title: 'REFORMER', location: 'Angeles', available: '8 / 8 left', instructor: 'Coach Chelsea' },
                { time: '11:00am', duration: '50 mins', title: 'MAT PILATES', location: 'San Fernando', available: '5 / 10 left', instructor: 'Coach Bea' },
                { time: '03:00pm', duration: '50 mins', title: 'BARRE', location: 'Angeles', available: '2 / 12 left', instructor: 'Coach Chelsea' },
                { time: '05:00pm', duration: '50 mins', title: 'PRIVATE SESSION', location: 'San Fernando', available: '1 / 1 left', instructor: 'Coach Van' },
              ].map((cls, idx) => (
                <div key={idx} className="flex gap-6 items-center group">
                  <div className="w-20 shrink-0 flex flex-col items-end text-right pr-2">
                    <span className="font-bold text-brand-dark text-sm">{cls.time}</span>
                    <span className="text-xs text-brand-dark/50 font-medium">{cls.duration}</span>
                  </div>
                  
                  <div className="flex-1 bg-[#3A2F2A] rounded-[32px] py-5 px-8 flex items-center justify-between shadow-sm">
                    <div className="w-1/4">
                      <span className="font-bold text-white tracking-wider text-[15px]">{cls.title}</span>
                    </div>
                    <div className="w-1/4">
                      <span className="font-bold text-white text-[15px]">{cls.location}</span>
                    </div>
                    <div className="w-1/4 flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <button className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center text-xs hover:bg-white/30 transition-colors">-</button>
                        <span className="font-bold text-white text-sm">{cls.available}</span>
                        <button className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center text-xs hover:bg-white/30 transition-colors">+</button>
                      </div>
                      <span className="text-[12px] text-white/60 font-medium pl-8">{cls.instructor}</span>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button className="bg-[#FAF7F2] text-brand-dark px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-white transition-colors shadow-sm">Book User</button>
                      <button className="bg-white/10 text-white p-2.5 rounded-full hover:bg-white/20 transition-colors"><Edit3 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderCalendar()
          )}
        </div>
      );
    }

    if (activeTab === 'users') {
      return (
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-brand-dark mb-8">Client Directory</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-brand-sand/10 border-b border-brand-sand/50">
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm">Client Name</th>
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm">Email</th>
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm">Active Package</th>
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm">Credits</th>
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Graciella Jimenez', email: 'graciellamher@gmail.com', pkg: '10-Class Reformer', credits: '4' },
                  { name: 'John Doe', email: 'john@example.com', pkg: '5-Class Mat', credits: '1' },
                  { name: 'Jane Smith', email: 'jane@example.com', pkg: 'Drop-in', credits: '0' },
                ].map((user, idx) => (
                  <tr key={idx} className="border-b border-brand-sand/20 hover:bg-black/5 transition-colors">
                    <td className="py-4 px-6 font-bold text-brand-dark text-sm">{user.name}</td>
                    <td className="py-4 px-6 text-brand-dark text-sm">{user.email}</td>
                    <td className="py-4 px-6 text-brand-dark text-sm">
                      {user.pkg !== 'Drop-in' ? <span className="bg-brand-sand/30 px-2 py-1 rounded text-xs font-bold">{user.pkg}</span> : <span className="text-xs opacity-50">None</span>}
                    </td>
                    <td className="py-4 px-6 text-brand-dark text-sm font-mono">{user.credits}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-brand-brown hover:underline text-sm font-bold">View Profile</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'settings') {
      return (
        <div className="animate-fade-in max-w-3xl">
          <h2 className="text-3xl font-bold text-brand-dark mb-8">Studio Settings</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 p-8 mb-8">
            <h3 className="text-xl font-bold text-brand-dark mb-6 border-b border-brand-sand/30 pb-4">Payment Methods</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">GCash Number</label>
                <input type="text" defaultValue="0917 123 4567" className="w-full border border-brand-sand/50 rounded-lg px-4 py-2 focus:outline-none focus:border-brand-brown" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">BPI Account Number</label>
                <input type="text" defaultValue="1234 5678 90" className="w-full border border-brand-sand/50 rounded-lg px-4 py-2 focus:outline-none focus:border-brand-brown" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Account Name</label>
                <input type="text" defaultValue="Revive Pilates Studio" className="w-full border border-brand-sand/50 rounded-lg px-4 py-2 focus:outline-none focus:border-brand-brown" />
              </div>
              <button className="bg-brand-brown text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-dark transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans pt-[90px]">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-90px)] max-w-7xl mx-auto w-full border-x border-brand-sand/30 bg-white">
        
        {/* Admin Sidebar */}
        <aside className="w-full lg:w-[320px] bg-white border-b lg:border-b-0 lg:border-r border-brand-sand/30 flex flex-col shrink-0">
          <div className="p-8 pb-4">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Studio Admin</h2>
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-brand-sand/10 border border-brand-sand/30 rounded-lg px-3 py-2 text-sm font-bold text-brand-dark outline-none cursor-pointer hover:border-brand-brown/50 transition-colors"
            >
              <option value="angeles">Angeles Branch</option>
              <option value="san_fernando">San Fernando Branch</option>
            </select>
          </div>
          
          <nav className="flex-1 py-4 flex flex-row lg:flex-col overflow-x-auto scrollbar-hide gap-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-none flex items-center gap-4 px-6 lg:px-8 py-3.5 transition-colors text-left border-b-2 lg:border-b-0 lg:border-l-4 ${
                  activeTab === item.id 
                    ? 'bg-brand-sand/10 border-brand-brown text-brand-dark font-bold' 
                    : 'border-transparent text-brand-dark/60 hover:bg-black/5 hover:text-brand-dark'
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-brand-brown' : 'text-brand-dark/40'} />
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

      {/* Verification Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            {/* Receipt Image Side */}
            <div className="w-full md:w-1/2 bg-black/5 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-brand-sand/30 h-64 md:h-auto">
              <img 
                src={selectedBooking.receiptUrl} 
                alt="Payment Receipt" 
                className="max-w-full max-h-full object-contain rounded shadow-md"
              />
            </div>
            
            {/* Details & Actions Side */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-brand-dark">Verify Payment</h3>
                <button onClick={() => setSelectedBooking(null)} className="text-brand-dark/40 hover:text-brand-dark">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">Booking ID</p>
                  <p className="font-medium text-brand-dark">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">Client</p>
                  <p className="font-medium text-brand-dark">{selectedBooking.clientName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">Class</p>
                  <p className="font-medium text-brand-dark">{selectedBooking.className}</p>
                  <p className="text-sm text-brand-dark/70">{selectedBooking.date} • {selectedBooking.time}</p>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-brand-sand/50 mt-4">
                  <p className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">Amount Due</p>
                  <p className="text-xl font-bold text-brand-dark mb-4">{selectedBooking.amount}</p>
                  
                  <p className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">Submitted Ref No.</p>
                  <p className="font-mono font-bold text-lg text-brand-dark">{selectedBooking.referenceId}</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4 pt-4 border-t border-brand-sand/30">
                <button 
                  onClick={() => handleReject(selectedBooking.id)}
                  className="flex-1 py-3 rounded-xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleConfirm(selectedBooking.id)}
                  className="flex-1 py-3 rounded-xl bg-brand-brown text-white font-bold hover:bg-brand-dark transition-colors shadow-sm"
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
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-bold text-brand-dark">{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
                <button onClick={() => setIsClassModalOpen(false)} className="text-brand-dark/40 hover:text-brand-dark transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Details */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Class Name</label>
                    <input type="text" defaultValue={editingClass?.type || ''} className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium" placeholder="e.g. ABC Reformer" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Date</label>
                      <input type="date" className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Time</label>
                      <input type="time" className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Instructor</label>
                    <input type="text" defaultValue={editingClass?.instructor || ''} className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium" placeholder="Instructor Name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Experience Level</label>
                      <select className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium text-sm bg-white">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>All Levels</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Capacity</label>
                      <input type="number" defaultValue="12" className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium" />
                    </div>
                  </div>
                </div>

                {/* Right Column: Rules & Media */}
                <div className="space-y-5">
                  <div className="bg-[#FAF7F2] p-5 rounded-xl border border-brand-sand/50 space-y-4">
                    <h4 className="font-bold text-brand-dark mb-2 text-sm border-b border-brand-sand/50 pb-2">Booking Rules</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-dark/70">Booking ahead (days)</span>
                      <input type="number" defaultValue="7" className="w-20 border border-brand-sand/50 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-brown text-center font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-dark/70">Cancel before (hours)</span>
                      <input type="number" defaultValue="6" className="w-20 border border-brand-sand/50 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-brown text-center font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-dark/70">Close before start (hrs)</span>
                      <input type="number" defaultValue="2" className="w-20 border border-brand-sand/50 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-brown text-center font-bold" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Class Cover Image</label>
                    <div className="border-2 border-dashed border-brand-sand rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FAF7F2] transition-colors">
                      <div className="bg-brand-sand/30 p-3 rounded-full mb-3">
                        <Plus size={24} className="text-brand-dark/50" />
                      </div>
                      <p className="text-sm font-bold text-brand-dark">Click to upload image</p>
                      <p className="text-xs text-brand-dark/50 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-brand-sand/30 flex justify-end gap-4">
                <button 
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-brand-dark hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-8 py-3 rounded-xl bg-brand-brown text-white font-bold hover:bg-brand-dark transition-colors shadow-sm"
                >
                  {editingClass ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
