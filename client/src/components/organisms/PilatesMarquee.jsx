export default function PilatesMarquee() {
  return (
    <div className="relative w-full overflow-hidden bg-brand-beige pt-16 pb-12 border-b border-brand-dark/10">
      {/* Top Wave transitioning from Dark Hero */}
      <svg 
        viewBox="0 0 1440 80" 
        className="absolute top-0 left-0 w-full z-10 -translate-y-[99%]" 
        preserveAspectRatio="none" 
        style={{ height: '5vw', minHeight: '40px' }}
      >
        <path d="M0,80 C320,0 720,0 1440,80 L1440,80 L0,80 Z" fill="#F5F2ED" />
      </svg>
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...Array(10)].map((_, i) => (
            <span key={`first-${i}`} className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-dark px-8">
              OUR CLASSES <span className="text-brand-brown mx-4">•</span>
            </span>
          ))}
        </div>
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center">
          {[...Array(10)].map((_, i) => (
            <span key={`second-${i}`} className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-dark px-8">
              OUR CLASSES <span className="text-brand-brown mx-4">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
