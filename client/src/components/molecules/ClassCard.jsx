import { Clock, User, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClassCard({ 
  id,
  title, 
  instructor, 
  time, 
  duration,
  branch, 
  slotsLeft, 
  isWaitlist 
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-brand-sand/30 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      
      {/* Header (Title & Status) */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-brown transition-colors">
          {title}
        </h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap border ${
          isWaitlist 
            ? 'bg-brand-beige text-brand-brown border-brand-sand' 
            : slotsLeft <= 2 
              ? 'bg-white text-brand-dark border-brand-sand border-dashed' 
              : 'bg-brand-sand/50 text-brand-dark border-brand-sand'
        }`}>
          {isWaitlist ? 'Waitlist Only' : `${slotsLeft} spots left`}
        </span>
      </div>

      {/* Details */}
      <div className="flex-grow space-y-3 mb-6">
        <div className="flex items-center text-brand-dark/70 text-sm">
          <Clock size={16} className="mr-2 text-brand-brown/60" />
          <span>{time} ({duration})</span>
        </div>
        <div className="flex items-center text-brand-dark/70 text-sm">
          <User size={16} className="mr-2 text-brand-brown/60" />
          <span>{instructor}</span>
        </div>
        <div className="flex items-center text-brand-dark/70 text-sm">
          <MapPin size={16} className="mr-2 text-brand-brown/60" />
          <span>{branch}</span>
        </div>
      </div>

      {/* Action Button */}
      <Link 
        to="/checkout"
        state={{ isWaitlist, slotsLeft, title, instructor, time }}
        className={`w-full py-3 rounded-xl font-medium text-center transition-colors ${
          isWaitlist 
            ? 'bg-brand-sand/30 text-brand-dark hover:bg-brand-sand/50' 
            : 'bg-brand-brown text-white hover:bg-brand-dark shadow-sm hover:shadow'
        }`}
      >
        {isWaitlist ? 'Join Waitlist' : 'Reserve Spot'}
      </Link>
    </div>
  );
}
