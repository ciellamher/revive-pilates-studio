import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

const DATES = [
  { date: '17', day: 'Mon' },
  { date: '18', day: 'Tue' },
  { date: '19', day: 'Wed' },
  { date: '20', day: 'Thu' },
  { date: '21', day: 'Fri' },
  { date: '22', day: 'Sat' },
];

const TIME_SLOTS = [
  '8:00 AM - 8:50 AM',
  '9:00 AM - 9:50 AM',
  '1:00 PM - 1:50 PM',
  '5:00 PM - 5:50 PM'
];

export default function ReservationSelector() {
  const [selectedDate, setSelectedDate] = useState('17');
  const [selectedTime, setSelectedTime] = useState('8:00 AM - 8:50 AM');

  return (
    <div className="bg-white p-6 rounded-3xl border border-brand-sand/30 shadow-sm mb-6">
      
      {/* Date Selection */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={18} className="text-brand-dark/70" />
          <h3 className="font-semibold text-brand-dark">Select a reservation date</h3>
        </div>
        <p className="text-xs text-brand-dark/50 mb-4">You can reserve up to 1 week in advance, with a maximum of 2 reservations</p>
        
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {DATES.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`min-w-[60px] py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                selectedDate === d.date
                  ? 'border-2 border-brand-dark bg-white shadow-sm'
                  : 'border border-transparent bg-brand-beige/30 hover:bg-brand-beige/50 text-brand-dark/70'
              }`}
            >
              <span className={`text-xl font-medium ${selectedDate === d.date ? 'text-brand-dark' : ''}`}>{d.date}</span>
              <span className="text-xs font-medium uppercase">{d.day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-brand-dark/70" />
          <h3 className="font-semibold text-brand-dark">Select a time slot</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                selectedTime === time
                  ? 'bg-brand-brown text-white shadow-sm'
                  : 'bg-brand-beige/30 text-brand-dark/70 hover:bg-brand-beige/60'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Footer / Price / CTA */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-sm text-brand-dark/60 font-medium">Price</p>
          <p className="text-xl font-bold text-brand-dark">₱ 800 <span className="text-sm font-normal text-brand-dark/60">/ Session</span></p>
        </div>
        {/* We keep this button here visually, but actual booking submission in our prototype is in the PaymentUploadPanel */}
        <button className="bg-brand-dark text-white px-8 py-3 rounded-xl font-medium hover:bg-brand-brown transition-colors">
          Select Slot
        </button>
      </div>

      {/* Terms */}
      <div className="text-center text-[10px] text-brand-dark/50 border-t border-brand-sand/30 pt-4 leading-relaxed max-w-sm mx-auto">
        By making a reservation, you agree to the Terms and Conditions that 30% of the payment is non-refundable if you don't attend.
      </div>

    </div>
  );
}
