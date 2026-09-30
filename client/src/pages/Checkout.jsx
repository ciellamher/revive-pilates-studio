import Navbar from '../components/organisms/Navbar';
import ReservationSelector from '../components/organisms/ReservationSelector';
import SpotSelectorMap from '../components/organisms/SpotSelectorMap';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Ticket } from 'lucide-react';
import PaymentUploadPanel from '../components/organisms/PaymentUploadPanel';
import { API_BASE } from '../api/base';
import { useAuth } from '../contexts/AuthContext';
import classPreviewImg from '../assets/revive-photos/reformer_11.jpg';

export default function Checkout() {
  const [selectedPricing, setSelectedPricing] = useState(null);
  const [hasPackages, setHasPackages] = useState(false);
  
  const location = useLocation();
  const { 
    isWaitlist = false, 
    slotsLeft = 2, 
    title = 'Group Reformer Class', 
    instructor = 'Coach Dani',
    time = '8:00am',
    classId = null,
    date = null,
    duration = '55 mins',
    branch = 'Angeles',
    capacity,
    takenSpots = []
  } = location.state || {};

  // Signed-in clients start with their own details; they can still change them.
  const { user } = useAuth();
  const [attendeeName, setAttendeeName] = useState(user?.name ?? '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email ?? '');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [referenceId, setReferenceId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [booking, setBooking] = useState(null);

  // '2026-10-01' -> 'Thu, 1 Oct 2026', built from its parts so the day cannot
  // shift with the visitor's timezone.
  const dateLabel = date
    ? new Date(...date.split('-').map((part, i) => Number(part) - (i === 1 ? 1 : 0)))
        .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : 'Thu, 20 Aug 2026';

  // Infer classType from title for dynamic pricing and shapes
  const classType = title.toLowerCase().includes('mat') ? 'mat' : title.toLowerCase().includes('barre') ? 'barre' : 'reformer';

  let price = '1,100'; // Default to Reformer Group
  const t = title.toLowerCase();
  
  if (t.includes('mat') || t.includes('barre')) {
    price = '500';
  } else if (t.includes('private')) {
    price = '2,500';
  } else if (t.includes('clinical')) {
    price = '2,800';
  }

  const handleSubmitBooking = async () => {
    if (!classId) return setSubmitError('Please choose a class from the timetable first.');
    if (!attendeeName.trim()) return setSubmitError('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail.trim())) return setSubmitError('Please enter a valid email address.');
    if (!selectedSpot) return setSubmitError('Please select your spot.');

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: Number(classId),
          clientName: attendeeName,
          clientEmail: attendeeEmail,
          spot: selectedSpot,
          referenceId,
          amount: `₱ ${price}`
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Something went wrong. Please try again.');
      setBooking(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar />
      
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="text-xs font-bold text-brand-dark/60 mb-6">
          <Link to="/book" className="hover:text-brand-brown">Timetable</Link> <span className="mx-2">&gt;</span> {title} with {instructor}
        </div>

        <h1 className="text-3xl font-sans font-bold text-brand-dark mb-8">Book this class</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column */}
          {booking ? (
          <div className="flex-1">
            <section role="status" className="border border-brand-sand/50 rounded-xl p-8 bg-white shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-brand-dark mb-3">Booking received</h2>
              <p className="text-brand-dark/80 mb-2">
                Thanks, {booking.clientName}. Spot {booking.spot} in {booking.className} is held for you while the studio verifies your payment.
              </p>
              <p className="text-brand-dark/80 mb-6">
                Once it is confirmed, we will email a reminder to <strong className="text-brand-dark">{attendeeEmail.trim()}</strong> about 12 hours before your class.
              </p>
              <p className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-6">Booking ID {booking.id}</p>
              <Link to="/book" className="inline-block bg-brand-brown text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors">Back to timetable</Link>
            </section>
          </div>
          ) : (
          <div className="flex-1 flex flex-col gap-10">
            
            {/* Attendee Info */}
            <section>
              <h2 className="text-lg font-serif font-bold text-brand-dark mb-4">Attendee</h2>
              
              <div className="border border-brand-sand/50 rounded-xl p-4 bg-white shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="attendee-name" className="block text-xs font-bold text-brand-dark/60 mb-1">Full name</label>
                  <input
                    id="attendee-name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-sand focus:outline-none focus:border-brand-brown bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="attendee-email" className="block text-xs font-bold text-brand-dark/60 mb-1">Email</label>
                  <input
                    id="attendee-email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-sand focus:outline-none focus:border-brand-brown bg-white"
                  />
                </div>
                <p className="sm:col-span-2 text-xs text-brand-dark/60">We send your class reminder to this email, about 12 hours before the class.</p>
              </div>
            </section>

            {/* Spot Selector */}
            <section>
              <h2 className="text-lg font-bold text-brand-dark mb-4">Select your Spot</h2>
              <SpotSelectorMap
                classType={classType}
                spotCount={capacity}
                takenSpots={takenSpots}
                selectedSpot={selectedSpot}
                onSelectSpot={setSelectedSpot}
              />
            </section>

            {/* Pricing Option */}
            <section>
              <h2 className="text-lg font-serif font-bold text-brand-dark mb-4">Select pricing option</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setSelectedPricing('direct')}
                  className={`flex-1 py-8 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${selectedPricing === 'direct' ? 'border-brand-brown bg-brand-brown/5 shadow-md' : 'border-brand-sand/50 bg-white shadow-sm'}`}>
                  <span className="text-xl font-medium">₱ {price}</span>
                  <span className="text-sm font-bold text-brand-dark/70">Direct payment</span>
                </button>
                <button 
                  onClick={() => setSelectedPricing('plan')}
                  className={`flex-1 py-8 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${selectedPricing === 'plan' ? 'border-brand-brown bg-brand-brown text-white shadow-md' : 'border-brand-sand/50 bg-white shadow-sm'}`}>
                  <Ticket size={24} className="mb-1" />
                  <span className="text-sm font-bold">Current Packages</span>
                </button>
              </div>
            </section>

            {selectedPricing === 'direct' && (
              <section className="animate-fade-in -mt-4">
                <PaymentUploadPanel
                  referenceId={referenceId}
                  onReferenceChange={setReferenceId}
                  onSubmit={handleSubmitBooking}
                  submitting={submitting}
                  error={submitError}
                />
              </section>
            )}

            {selectedPricing === 'plan' && (
              <section className="animate-fade-in bg-white border border-brand-sand/50 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-brand-dark mb-4">Your Active Packages</h3>
                
                {hasPackages ? (
                  <>
                    <div className="border-2 border-brand-brown rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-sand/10 cursor-pointer hover:bg-brand-sand/20 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Active</span>
                          <span className="font-bold text-brand-dark">10-Class Reformer Package</span>
                        </div>
                        <p className="text-sm text-brand-dark/70">4 classes left • Expires Nov 20, 2026</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-brand-dark/60">-1 credit</span>
                        <div className="w-6 h-6 rounded-full border-2 border-brand-brown flex items-center justify-center bg-brand-brown">
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button className="bg-brand-brown text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-sm">
                        Confirm Booking (Use 1 Credit)
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-brand-sand/50 rounded-xl bg-brand-sand/10">
                    <Ticket size={48} className="text-brand-dark/20 mb-4" />
                    <p className="font-bold text-brand-dark mb-2">No active packages found</p>
                    <p className="text-sm text-brand-dark/70 mb-6">You don't have any class credits available right now.</p>
                    <Link to="/packages" className="bg-brand-brown text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-sm">
                      View & Buy Packages
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* What you'll need */}
            <section>
              <h2 className="text-lg font-bold text-brand-dark mb-4">What you'll need</h2>
              <ul className="grid grid-cols-3 gap-4 text-sm font-bold text-brand-dark/70">
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-brand-dark"></div> Grip socks</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-brand-dark"></div> Water bottle</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-brand-dark"></div> Towel</li>
              </ul>
            </section>

            <hr className="border-brand-sand/30" />

            {/* Getting There */}
            <section>
              <h2 className="text-lg font-bold text-brand-dark mb-4">Getting there</h2>
              <p className="text-sm text-brand-dark/70">Omnistellar Building, Angeles City</p>
            </section>

            <hr className="border-brand-sand/30" />

            {/* Studio Policies */}
            <section>
              <h2 className="text-lg font-bold text-brand-dark mb-4">Studio Policies</h2>
              <div className="text-sm text-brand-dark/70 space-y-4">
                <div>
                  <p className="font-bold text-brand-dark mb-1">SCHEDULE</p>
                  <p>We update our schedule weekly. Check our Facebook and Instagram pages to see the schedule of the week.</p>
                </div>
                <div>
                  <p className="font-bold text-brand-dark mb-1">LATE ARRIVAL</p>
                  <p>Timely starts matter for your safety. Please arrive on time to allow for proper warm-up and reduce injury risks.</p>
                  <p className="mt-1"><span className="font-bold text-brand-dark">*Late Arrival Policy:</span> If you're <strong className="text-brand-dark">15+ mins late</strong>, we'll aim to reschedule you to the next available class within the day. Otherwise, your session will be forfeited to maintain a safe environment.</p>
                </div>
                <div>
                  <p className="font-bold text-brand-dark mb-1">CANCELLATION</p>
                  <p>Should you need to reschedule or cancel, no worries, just let us know <strong className="text-brand-dark">12 hours BEFORE</strong> your session to avoid forfeiting the advance payment.</p>
                </div>
              </div>
            </section>
            
          </div>
          )}

          {/* Right Column: Summary Card */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-3xl border border-brand-sand/50 shadow-md overflow-hidden sticky top-32">
              
              {/* Image */}
              <div className="h-56 border-b border-brand-sand/30 overflow-hidden">
                <img src={classPreviewImg} alt="Class preview" className="w-full h-full object-cover" />
              </div>
              
              <div className="p-8">
                <h3 className="text-xl font-bold text-brand-dark mb-6">{title}</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex gap-4">
                    <Calendar size={20} className="text-brand-dark/40 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{dateLabel}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock size={20} className="text-brand-dark/40 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{time}, {duration}</p>
                      <p className="text-xs text-brand-dark/50">Check-in anytime before class begins</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin size={20} className="text-brand-dark/40 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-brand-dark">Revive Pilates Studio</p>
                      <p className="text-xs text-brand-dark/50">{branch === 'San Fernando' ? 'San Fernando Branch' : 'Angeles City Branch'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <User size={20} className="text-brand-dark/40 shrink-0" />
                    <p className="font-bold text-brand-dark text-lg">{instructor}</p>
                  </div>
                </div>
                
                <button className={`w-full py-4 rounded-xl font-bold mb-2 transition-colors ${
                  isWaitlist
                    ? 'bg-brand-sand/30 text-brand-dark hover:bg-brand-sand/50'
                    : 'bg-brand-brown text-white hover:bg-brand-dark shadow-sm'
                }`}>
                  {isWaitlist ? 'Join Waitlist' : 'Book Now'}
                </button>
                {!isWaitlist && (
                  <div className="text-center">
                    <p className="text-sm font-bold text-brand-dark">{slotsLeft} slots left</p>
                    
                    {classType === 'reformer' && slotsLeft === 4 && title !== 'Private Class' && (
                      <Link 
                        to="/checkout"
                        state={{
                          title: "Private Class",
                          instructor: instructor,
                          time: time,
                          isWaitlist: false,
                          slotsLeft: 1
                        }}
                        className="inline-block text-xs font-bold text-brand-brown hover:text-brand-dark underline underline-offset-2 mt-3 transition-colors"
                      >
                        Want to book this as a Private Class?
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
