import { Search, MapPin, Clock, Filter, User } from 'lucide-react';

export default function FilterBar() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-brand-sand/30 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Branch Filter */}
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 bg-brand-beige/50 rounded-xl border border-transparent focus-within:border-brand-sand transition-colors">
          <MapPin className="text-brand-brown/70" size={20} />
          <div className="flex flex-col w-full">
            <span className="text-xs font-semibold text-brand-dark/50 uppercase tracking-wider">Branch</span>
            <select className="bg-transparent text-brand-dark font-medium outline-none appearance-none w-full cursor-pointer">
              <option>All Branches</option>
              <option>Angeles City</option>
              <option>San Fernando</option>
            </select>
          </div>
        </div>

        {/* Time Filter */}
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 bg-brand-beige/50 rounded-xl border border-transparent focus-within:border-brand-sand transition-colors">
          <Clock className="text-brand-brown/70" size={20} />
          <div className="flex flex-col w-full">
            <span className="text-xs font-semibold text-brand-dark/50 uppercase tracking-wider">Time</span>
            <select className="bg-transparent text-brand-dark font-medium outline-none appearance-none w-full cursor-pointer">
              <option>Any Time</option>
              <option>Morning (6AM - 11AM)</option>
              <option>Afternoon (12PM - 4PM)</option>
              <option>Evening (5PM - 9PM)</option>
            </select>
          </div>
        </div>

        {/* Style Filter */}
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 bg-brand-beige/50 rounded-xl border border-transparent focus-within:border-brand-sand transition-colors">
          <Filter className="text-brand-brown/70" size={20} />
          <div className="flex flex-col w-full">
            <span className="text-xs font-semibold text-brand-dark/50 uppercase tracking-wider">Class Type</span>
            <select className="bg-transparent text-brand-dark font-medium outline-none appearance-none w-full cursor-pointer">
              <option>All Types</option>
              <option>Reformer</option>
              <option>Mat Pilates</option>
              <option>Barre</option>
              <option>Clinical</option>
            </select>
          </div>
        </div>

        {/* Coach Filter */}
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 bg-brand-beige/50 rounded-xl border border-transparent focus-within:border-brand-sand transition-colors">
          <User className="text-brand-brown/70" size={20} />
          <div className="flex flex-col w-full">
            <span className="text-xs font-semibold text-brand-dark/50 uppercase tracking-wider">Coach</span>
            <select className="bg-transparent text-brand-dark font-medium outline-none appearance-none w-full cursor-pointer">
              <option>All Coaches</option>
              <option>Coach Dani</option>
              <option>Coach Bea</option>
              <option>Coach Chelsea</option>
              <option>Coach Van</option>
              <option>Coach Alex</option>
              <option>Coach Giana</option>
              <option>Coach Abby</option>
              <option>Coach Nerisse</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button className="w-full md:w-auto bg-brand-dark text-white p-4 rounded-xl hover:bg-brand-brown transition-colors flex items-center justify-center shadow-md">
          <Search size={24} />
        </button>

      </div>
    </div>
  );
}
