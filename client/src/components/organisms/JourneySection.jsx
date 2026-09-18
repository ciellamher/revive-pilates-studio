import { Link } from 'react-router-dom';

export default function JourneySection() {
  return (
    <section className="relative w-full min-h-[700px] flex items-center justify-center pt-32 pb-24 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/src/assets/revive-photos/ladder_barrel_2.jpg" alt="Studio background" className="w-full h-full object-cover" />
      </div>

      {/* Wavy Top Divider to match the section above (bg-[#F5F2ED]) */}
      <svg 
        viewBox="0 0 1440 150" 
        className="absolute top-0 left-0 w-full z-10" 
        preserveAspectRatio="none" 
        style={{ height: '8vw', minHeight: '60px' }}
      >
        <path 
          d="M0,60 C320,-40 720,180 1440,20 L1440,0 L0,0 Z" 
          fill="#F5F2ED" 
        />
      </svg>

      {/* Content Card */}
      <div className="relative z-20 bg-[#E8E4D9] p-8 md:p-12 w-[90%] max-w-[600px] shadow-2xl rounded-[32px] text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#3A2A20] mb-4 font-sans">
          Start Your Pilates Journey Today!
        </h2>
        <p className="text-[#3A2A20]/80 text-base mb-8 font-sans">
          An invitation to move with strength, grace, and balance. Your journey begins at Revive Pilates Studio.
        </p>

        <Link 
          to="/pricing" 
          className="inline-block w-full bg-[#516B84] text-white py-3 md:py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#3A4E63] transition-colors shadow-sm"
        >
          View Packages
        </Link>
      </div>

    </section>
  );
}
