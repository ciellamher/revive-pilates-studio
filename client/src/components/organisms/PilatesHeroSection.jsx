import logoImg from '../../assets/logo.png';
import logoTextImg from '../../assets/logo_text.png';

export default function PilatesHeroSection() {
  return (
    <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center bg-brand-dark py-20">
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 mt-10">
        
        {/* Logo Icon Mask in White */}
        <div 
          className="w-24 h-24 md:w-32 md:h-32"
          style={{
            backgroundColor: '#FFFFFF',
            maskImage: `url(${logoImg})`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskImage: `url(${logoImg})`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center'
          }}
        ></div>

        {/* Logo Text Mask in White */}
        <div 
          className="w-64 h-16 md:w-96 md:h-24"
          style={{
            backgroundColor: '#FFFFFF',
            maskImage: `url(${logoTextImg})`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskImage: `url(${logoTextImg})`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center'
          }}
        ></div>
        
      </div>

      {/* Bottom Arch transitioning to beige */}
      <svg 
        viewBox="0 0 1440 80" 
        className="absolute bottom-0 left-0 w-full z-10 translate-y-[1px]" 
        preserveAspectRatio="none" 
        style={{ height: '5vw', minHeight: '40px' }}
      >
        <path d="M0,80 Q720,0 1440,80 L1440,81 L0,81 Z" fill="#F5F2ED" />
      </svg>
    </section>
  );
}
