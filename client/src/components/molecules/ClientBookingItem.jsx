import { CalendarDays, Clock, MapPin } from 'lucide-react';

export default function ClientBookingItem({ title, date, time, branch, spot, status }) {
  const statusColors = {
    Confirmed: 'bg-brand-sand/50 text-brand-dark border-brand-sand',
    Pending: 'bg-white text-brand-dark/70 border-brand-sand border-dashed',
    Waitlisted: 'bg-brand-beige text-brand-brown border-brand-sand',
    Cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
    Completed: 'bg-green-50 text-green-700 border-green-200'
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-brand-sand/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h4 className="font-serif text-xl font-bold text-brand-dark">{title}</h4>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[status]}`}>
            {status}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-brand-dark/70">
          <span className="flex items-center gap-1.5"><CalendarDays size={16} className="text-brand-brown/60" /> {date}</span>
          <span className="flex items-center gap-1.5"><Clock size={16} className="text-brand-brown/60" /> {time}</span>
          <span className="flex items-center gap-1.5"><MapPin size={16} className="text-brand-brown/60" /> {branch}</span>
        </div>
      </div>

      <div className="bg-brand-beige/50 px-6 py-4 rounded-xl border border-brand-sand/30 flex flex-col items-center justify-center min-w-[120px]">
        <span className="text-xs uppercase tracking-wider font-semibold text-brand-dark/50 mb-1">Your Spot</span>
        <span className="font-bold text-brand-brown text-lg">{spot}</span>
        {status === 'Confirmed' && (
          <button className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors mt-2 md:mt-0">
            Cancel Booking <span className="text-xs font-normal text-gray-500 block">(Must be 12hrs prior)</span>
          </button>
        )}
        {status === 'Completed' && (
          <button className="text-sm font-semibold text-brand-brown hover:text-brand-dark transition-colors mt-2 md:mt-0 bg-brand-sand/30 px-4 py-2 rounded-lg border border-brand-sand">
            ★ Leave a Review
          </button>
        )}
      </div>

    </div>
  );
}
