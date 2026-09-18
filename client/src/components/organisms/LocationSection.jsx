import { MapPin, Phone } from 'lucide-react';

export default function LocationSection() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col gap-10">
        
        {/* Angeles City Location */}
        <div className="relative w-full h-[400px] md:h-[450px] rounded-[32px] overflow-hidden shadow-lg group">
          <img 
            src="/src/assets/revive-photos/mat_pilates_9.jpg" 
            alt="Revive Studio Angeles City" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          />
          {/* Gradient overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
          
          <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl text-white">
            <h3 className="text-2xl md:text-3xl font-bold font-sans mb-8">Revive Studio - Angeles City</h3>
            
            <div className="flex items-start gap-4 mb-4">
              <MapPin size={22} className="mt-0.5 shrink-0" />
              <p className="text-sm md:text-base opacity-90">Omnistellar Building, Fil-Am Friendship Hwy., Angeles City, Pampanga</p>
            </div>
            
            <div className="flex items-center gap-4 mb-10">
              <Phone size={22} className="shrink-0" />
              <p className="text-sm md:text-base opacity-90">+63 917 183 2746</p>
            </div>
            
            <a 
              href="https://maps.google.com/maps?q=Omnistellar%20Building,%20Angeles%20City"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#3A2A20] px-8 py-3.5 rounded-full font-bold text-sm w-max hover:bg-gray-100 transition-colors shadow-sm"
            >
              View More
            </a>
          </div>
        </div>

        {/* San Fernando Location */}
        <div className="relative w-full h-[400px] md:h-[450px] rounded-[32px] overflow-hidden shadow-lg group">
          <img 
            src="/src/assets/revive-photos/reformer_9.jpg" 
            alt="Revive Studio San Fernando" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          />
          {/* Gradient overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
          
          <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl text-white">
            <h3 className="text-2xl md:text-3xl font-bold font-sans mb-8">Revive Studio - San Fernando</h3>
            
            <div className="flex items-start gap-4 mb-4">
              <MapPin size={22} className="mt-0.5 shrink-0" />
              <p className="text-sm md:text-base opacity-90">St. Charbel Square Building, MacArthur Hwy., San Fernando, Pampanga</p>
            </div>
            
            <div className="flex items-center gap-4 mb-10">
              <Phone size={22} className="shrink-0" />
              <p className="text-sm md:text-base opacity-90">+63 917 183 2746</p>
            </div>
            
            <a 
              href="https://maps.google.com/maps?q=St.%20Charbel%20Square%20Building,%20San%20Fernando,%20Pampanga"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#3A2A20] px-8 py-3.5 rounded-full font-bold text-sm w-max hover:bg-gray-100 transition-colors shadow-sm"
            >
              View More
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
