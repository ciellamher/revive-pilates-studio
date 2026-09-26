import { useState } from 'react';

export default function SpotSelectorMap({ classType = 'reformer' }) {
  const [selectedSpot, setSelectedSpot] = useState(null);

  // 10 spots for Mat/Barre, 4 for Reformer
  const spotCount = classType === 'reformer' ? 4 : 10;
  
  const spots = Array.from({ length: spotCount }, (_, i) => ({
    id: i + 1,
    label: `S${i + 1}`,
    isAvailable: i !== 2, // Spot 3 is taken
  }));

  // Render shapes based on classType
  const renderShape = (spot) => {
    const isSelected = selectedSpot === spot.id;
    const isAvailable = spot.isAvailable;

    if (classType === 'mat') {
      return (
        <div className={`relative w-12 h-20 sm:w-16 sm:h-24 rounded-lg shadow-md transition-colors duration-300 border border-white/20
          ${isSelected ? 'bg-brand-dark' : isAvailable ? 'bg-[#D8CFC4] group-hover:bg-[#C8BFA4]' : 'bg-[#D4DAD5]'}
        `}>
           <div className={`absolute inset-1 sm:inset-1.5 rounded-md opacity-40
              ${isSelected ? 'bg-brand-beige' : 'bg-brand-dark'}
           `}></div>
           <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-black/10 rounded-full"></div>
        </div>
      );
    }
    
    if (classType === 'barre') {
      return (
        <div className="relative w-12 h-20 sm:w-16 sm:h-24 flex flex-col items-center">
          {/* Standing Circle */}
          <div className={`absolute bottom-2 sm:bottom-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md transition-colors duration-300 border-2 border-white/40
            ${isSelected ? 'bg-brand-dark' : isAvailable ? 'bg-[#D8CFC4] group-hover:bg-[#C8BFA4]' : 'bg-[#D4DAD5]'}
          `}>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black/10 rounded-full"></div>
          </div>
          {/* Section of Barre */}
          <div className="absolute top-2 sm:top-4 w-full h-1 bg-brand-dark/30 shadow-sm"></div>
          <div className="absolute top-2 sm:top-4 w-1 h-6 bg-brand-dark/20 left-1/2 -translate-x-1/2"></div>
        </div>
      );
    }

    // Default Reformer shape (Highly detailed based on user image)
    return (
      <div className={`relative w-12 h-36 rounded-2xl shadow-md transition-colors duration-300 flex flex-col items-center justify-center border border-white/40
        ${isSelected ? 'bg-[#D8CFC4] ring-2 ring-brand-dark' : isAvailable ? 'bg-[#EBE7DF] group-hover:bg-[#D8CFC4]' : 'bg-[#D4DAD5] opacity-50'}
      `}>
        {/* Top U-Bar (Silver) */}
        <div className="absolute -top-3 w-14 h-5 border-b-0 border-[3px] border-gray-400 rounded-t-lg shadow-sm"></div>
        
        {/* Carriage (Dark Pad) */}
        <div className={`absolute top-5 w-[85%] h-[60%] rounded shadow-inner flex flex-col items-center overflow-hidden
          ${isSelected ? 'bg-[#3A2A20]' : isAvailable ? 'bg-[#43484D]' : 'bg-gray-400'}
        `}>
          {/* Shoulder Rests */}
          <div className="absolute top-2 left-1.5 w-2 h-3.5 bg-[#2A2D30] rounded-sm"></div>
          <div className="absolute top-2 right-1.5 w-2 h-3.5 bg-[#2A2D30] rounded-sm"></div>
          
          {/* Headrest divider line */}
          <div className="absolute top-8 w-full h-[2px] bg-black/20"></div>
        </div>

        {/* Bottom Bar (Black) */}
        <div className="absolute bottom-2 w-10 h-3.5 border-t-0 border-[3px] border-[#2A2D30] rounded-b-md"></div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-brand-sand/30 shadow-sm overflow-hidden flex flex-col items-center">
      
      <div className="text-center w-full mb-2">
        <h3 className="text-2xl font-bold text-brand-dark mb-2 font-serif">Select Your Spot</h3>
        <p className="text-sm text-brand-dark/70">Click on an available {classType === 'mat' ? 'mat' : classType === 'barre' ? 'barre spot' : 'reformer'} to reserve it.</p>
      </div>

      {/* 3D Room Container */}
      <div 
        className="relative w-full max-w-[600px] h-[280px] flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        
        {/* Room Floor */}
        <div 
          className="absolute w-[95%] aspect-video bg-[#EBE7DF] border-4 border-[#D8CFC4] shadow-xl rounded-xl transition-all duration-700 ease-in-out hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
          style={{ transform: 'rotateX(55deg) translateZ(-20px)' }}
        >
          
          {/* Mirror / Front Wall */}
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/60 to-transparent border-b-2 border-[#D8CFC4] flex items-center justify-center">
            <div className="w-1/2 h-0.5 bg-[#D8CFC4]/50 rounded-full"></div>
            <span className="absolute text-[8px] uppercase tracking-[0.4em] text-[#3A2A20]/40 font-bold top-1.5">Front Mirror</span>
          </div>
          
          {/* Continuous Barre Line (only for Barre class) */}
          {classType === 'barre' && (
             <div className="absolute top-16 left-4 right-4 h-1.5 bg-[#3A2A20]/40 shadow-sm rounded-full z-0"></div>
          )}
          
          {/* Grid of Spots */}
          <div className="absolute top-4 sm:top-8 left-0 w-full h-[calc(100%-1rem)] flex flex-wrap justify-center content-start gap-4 sm:gap-x-6 sm:gap-y-4 px-4 sm:px-12 py-4">
            {spots.map((spot) => (
              <button
                key={spot.id}
                disabled={!spot.isAvailable}
                onClick={() => spot.isAvailable && setSelectedSpot(spot.id)}
                className={`relative max-w-[80px] flex flex-col items-center justify-center transition-all duration-300 transform outline-none group z-10
                  ${!spot.isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  ${[2, 4, 7, 9].includes(spot.id) ? '-mt-8' : 'mt-4'}
                  ${selectedSpot === spot.id ? '-translate-y-6 scale-110 drop-shadow-xl' : spot.isAvailable ? 'hover:-translate-y-3 hover:scale-105 hover:drop-shadow-lg' : ''}
                `}
                style={{ transformStyle: 'preserve-3d' }}
              >
                
                {renderShape(spot)}

                {/* Spot Label floating above */}
                <div className={`absolute -bottom-6 font-bold text-xs tracking-widest transition-colors duration-300
                  ${selectedSpot === spot.id ? 'text-brand-dark' : 'text-brand-dark/50'}
                `}>
                  {spot.label}
                </div>

                {/* Selection Indicator */}
                {selectedSpot === spot.id && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-brand-beige rounded-full flex items-center justify-center shadow-md animate-pulse" style={{ transform: 'translateZ(15px)' }}>
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3A2A20" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                   </div>
                )}

              </button>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
