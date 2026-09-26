import { useState, useEffect } from 'react';
import Navbar from '../components/organisms/Navbar';
import ClassScheduleGrid from '../components/organisms/ClassScheduleGrid';
import CustomDropdown from '../components/atoms/CustomDropdown';
import { Calendar, Users, ClipboardCheck, Settings, CheckCircle, XCircle, Plus, Edit3, LayoutList, ChevronLeft, ChevronRight, ChevronDown, Search, ArrowUp, ArrowDown, Filter, Upload, Image as ImageIcon } from 'lucide-react';

const TIME_OPTIONS = (() => {
  const times = [];
  for (let h = 8; h <= 19; h++) {
    for (let m = 0; m < 60; m += 10) {
      if (h === 19 && m > 0) break;
      const ampm = h >= 12 ? 'PM' : 'AM';
      let hh = h % 12;
      if (hh === 0) hh = 12;
      times.push(`${hh.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`);
    }
  }
  return times;
})();

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [prefilledClassData, setPrefilledClassData] = useState(null);
  const [classTypeTitle, setClassTypeTitle] = useState('Reformer Flow');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [modalStartTime, setModalStartTime] = useState('08:00 AM');
  const [modalEndTime, setModalEndTime] = useState('08:50 AM');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Clients state
  const [clientSearch, setClientSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('All');
  const [clientSort, setClientSort] = useState('name');
  const [clientSortDir, setClientSortDir] = useState('asc');

  const [clientsData, setClientsData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) setClientsData(data.users);
      })
      .catch(err => console.error("Error fetching users:", err));
  }, []);
  const [scheduleView, setScheduleView] = useState('calendar'); // 'list' or 'calendar'
  const [selectedBranch, setSelectedBranch] = useState('Angeles Branch');
  
  const isAngeles = selectedBranch === 'Angeles Branch';
  
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
    fetch('http://localhost:3000/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (data.bookings) setPendingBookings(data.bookings);
      })
      .catch(console.error);
  }, []);

  const handleConfirm = (id) => {
    fetch(`http://localhost:3000/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'confirmed' })
    }).then(() => {
      setPendingBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status: 'confirmed' } : booking
      ));
      setSelectedBooking(null);
    });
  };

  const handleReject = (id) => {
    fetch(`http://localhost:3000/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' })
    }).then(() => {
      setPendingBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status: 'rejected' } : booking
      ));
      setSelectedBooking(null);
    });
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
            <span className={`text-lg font-medium px-3 py-1 rounded-full ${theme.pillBg} ${theme.pillText}`}>
              {selectedBranch === 'Angeles Branch' ? 'Angeles' : 'San Fernando'}
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
                setIsClassModalOpen(true);
              }}
              className={`${theme.bg} ${theme.text} ${theme.bgHover} px-5 py-2.5 rounded-[10px] font-bold text-[13px] flex items-center gap-2 transition-colors shadow-sm`}
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
              setModalStartTime(cls.time);
              
              let [timePart, modifier] = cls.time.split(' ');
              let [hours, minutes] = timePart.split(':');
              if (hours === '12') hours = '00';
              if (modifier === 'PM' && hours !== '00') hours = (parseInt(hours, 10) + 12).toString();
              const startMins = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
              const durMins = parseInt(cls.duration?.replace(' min', '') || '50', 10);
              const endMins = startMins + durMins;
              let eH = Math.floor(endMins / 60);
              const eM = endMins % 60;
              const eAmPm = eH >= 12 && eH < 24 ? 'PM' : 'AM';
              eH = eH % 12 || 12;
              setModalEndTime(`${eH.toString().padStart(2, '0')}:${eM.toString().padStart(2, '0')} ${eAmPm}`);

              setIsClassModalOpen(true);
            }}
            onEmptySlotClick={(dateId, time) => {
              setEditingClass(null);
              setClassTypeTitle('Reformer Flow');
              const d = new Date(dateId);
              // Adjust for local timezone to ensure YYYY-MM-DD is correct
              const date = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
              
              setModalStartTime(time);
              let [timePart, modifier] = time.split(' ');
              let [hours, minutes] = timePart.split(':');
              if (hours === '12') hours = '00';
              if (modifier === 'PM' && hours !== '00') hours = (parseInt(hours, 10) + 12).toString();
              const startMins = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
              const endMins = startMins + 50;
              let eH = Math.floor(endMins / 60);
              const eM = endMins % 60;
              const eAmPm = eH >= 12 && eH < 24 ? 'PM' : 'AM';
              eH = eH % 12 || 12;
              setModalEndTime(`${eH.toString().padStart(2, '0')}:${eM.toString().padStart(2, '0')} ${eAmPm}`);

              setPrefilledClassData({ date });
              setIsClassModalOpen(true);
            }}
          />
        </div>
      );
    }


    if (activeTab === 'users') {
      let filteredClients = clientsData.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(clientSearch.toLowerCase()) || client.email.toLowerCase().includes(clientSearch.toLowerCase());
        const matchesFilter = clientFilter === 'All Packages' || client.pkg === clientFilter;
        return matchesSearch && matchesFilter;
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
              <div className="relative w-full sm:w-auto bg-white border border-brand-sand/50 rounded-lg focus-within:border-brand-brown z-20">
                <CustomDropdown
                  value={clientFilter === 'All' ? 'All Packages' : clientFilter}
                  onChange={setClientFilter}
                  options={['All Packages', '10-Class Reformer', '5-Class Mat', 'Drop-in']}
                  triggerClassName="px-4 py-2"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-brand-sand/10 border-b border-brand-sand/50">
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm cursor-pointer hover:bg-black/5" onClick={() => handleSort('name')}>
                    Client Name <SortIcon column="name" />
                  </th>
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm cursor-pointer hover:bg-black/5" onClick={() => handleSort('email')}>
                    Email <SortIcon column="email" />
                  </th>
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm cursor-pointer hover:bg-black/5" onClick={() => handleSort('pkg')}>
                    Active Package <SortIcon column="pkg" />
                  </th>
                  <th className="py-4 px-6 font-bold text-brand-dark text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? filteredClients.map((user, idx) => (
                  <tr key={idx} className="border-b border-brand-sand/20 hover:bg-black/5 transition-colors">
                    <td className="py-4 px-6 font-bold text-brand-dark text-sm">{user.name}</td>
                    <td className="py-4 px-6 text-brand-dark text-sm">{user.email}</td>
                    <td className="py-4 px-6 text-brand-dark text-sm">
                      {user.pkg !== 'Drop-in' ? <span className="bg-brand-sand/30 px-2 py-1 rounded text-xs font-bold">{user.pkg}</span> : <span className="text-xs opacity-50">None</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-brand-brown hover:underline text-sm font-bold">View Profile</button>
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
                <label className="block text-sm font-bold text-brand-dark mb-2">GCash QR Code</label>
                <div className="border-2 border-dashed border-brand-sand/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-black/5 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-brand-brown/10 text-brand-brown flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-brand-dark">Click to upload QR code</p>
                    <p className="text-xs text-brand-dark/50 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">BPI Account Number</label>
                <input type="text" defaultValue="1234 5678 90" className="w-full border border-brand-sand/50 rounded-lg px-4 py-2 focus:outline-none focus:border-brand-brown" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">BPI QR Code</label>
                <div className="border-2 border-dashed border-brand-sand/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-black/5 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-brand-brown/10 text-brand-brown flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-brand-dark">Click to upload QR code</p>
                    <p className="text-xs text-brand-dark/50 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Account Name</label>
                <input type="text" defaultValue="Revive Pilates Studio" className="w-full border border-brand-sand/50 rounded-lg px-4 py-2 focus:outline-none focus:border-brand-brown" />
              </div>
              <button className={`${theme.bg} ${theme.text} ${theme.bgHover} px-6 py-2 rounded-lg font-bold transition-colors`}>Save Changes</button>

            </div>
          </div>
        </div>
      );
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
                onClick={() => setActiveTab(item.id)}
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

      {/* Verification Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            {/* Receipt Image Side (Edge-to-Edge) */}
            <div className="w-full md:w-1/2 h-64 md:h-auto">
              <img 
                src={selectedBooking.receiptUrl} 
                alt="Payment Receipt" 
                className="w-full h-full object-cover"
              />
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
              const parseAmPmToMins = (timeString) => {
                let [timePart, modifier] = timeString.split(' ');
                let [hours, minutes] = timePart.split(':');
                if (hours === '12') hours = '00';
                if (modifier === 'PM' && hours !== '00') hours = (parseInt(hours, 10) + 12).toString();
                return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
              };

              let sMins = parseAmPmToMins(modalStartTime);
              let eMins = parseAmPmToMins(modalEndTime);
              let durationMins = eMins - sMins;
              if (durationMins <= 0) durationMins += 24 * 60; // handle wrap around midnight

              let timeStr = modalStartTime;
              
              const [y, m, d] = formData.get('date').split('-');
              const localDate = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
              
              const newClass = {
                title: classTypeTitle,
                time: timeStr,
                dateId: localDate.toDateString(),
                instructor: formData.get('instructor'),
                branch: selectedBranch === 'Angeles Branch' ? 'Angeles' : 'San Fernando',
                duration: `${durationMins} min`,
                capacity: parseInt(formData.get('capacity') || '12', 10),
                isFull: editingClass ? editingClass.isFull : false,
                isEmpty: editingClass ? editingClass.isEmpty : true,
                isDone: editingClass ? editingClass.isDone : false
              };
            
              try {
                const method = editingClass ? 'PATCH' : 'POST';
                const url = editingClass 
                  ? `http://localhost:3000/api/classes/${editingClass.id}`
                  : 'http://localhost:3000/api/classes';

                await fetch(url, {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newClass)
                });
                setIsClassModalOpen(false);
                setRefreshKey(prev => prev + 1);
              } catch (error) {
                console.error("Failed to add class:", error);
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
                        onChange={setClassTypeTitle}
                        options={['Reformer Flow', 'Mat Pilates', 'Barre']}
                        triggerClassName="px-4 py-3"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Date</label>
                      <input name="date" required type="date" defaultValue={
                        editingClass?.dateId ? new Date(new Date(editingClass.dateId).getTime() - (new Date(editingClass.dateId).getTimezoneOffset() * 60000)).toISOString().split('T')[0] : prefilledClassData?.date || ''
                      } className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Start Time</label>
                      <div className="bg-white border border-brand-sand/50 rounded-lg focus-within:border-brand-brown z-40 relative">
                        <CustomDropdown
                          value={modalStartTime}
                          onChange={(val) => {
                             setModalStartTime(val);
                             // Auto update end time to +50 mins
                             let [timePart, modifier] = val.split(' ');
                             let [hours, minutes] = timePart.split(':');
                             if (hours === '12') hours = '00';
                             if (modifier === 'PM' && hours !== '00') hours = (parseInt(hours, 10) + 12).toString();
                             const startMins = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
                             const endMins = startMins + 50;
                             let eH = Math.floor(endMins / 60);
                             const eM = endMins % 60;
                             const eAmPm = eH >= 12 && eH < 24 ? 'PM' : 'AM';
                             eH = eH % 12 || 12;
                             setModalEndTime(`${eH.toString().padStart(2, '0')}:${eM.toString().padStart(2, '0')} ${eAmPm}`);
                          }}
                          options={TIME_OPTIONS}
                          triggerClassName="px-4 py-3"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">End Time</label>
                      <div className="bg-white border border-brand-sand/50 rounded-lg focus-within:border-brand-brown z-30 relative">
                        <CustomDropdown
                          value={modalEndTime}
                          onChange={setModalEndTime}
                          options={TIME_OPTIONS}
                          triggerClassName="px-4 py-3"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Instructor</label>
                    <input name="instructor" required type="text" defaultValue={editingClass?.instructor || ''} className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium" placeholder="Coach Name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                      <input name="capacity" type="number" defaultValue="12" className="w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium" />
                    </div>
                  </div>
              </div>

              <div className="mt-8 pt-6 border-t border-brand-sand/30 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-brand-dark hover:bg-black/5 transition-colors"
                >
                  Cancel
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
