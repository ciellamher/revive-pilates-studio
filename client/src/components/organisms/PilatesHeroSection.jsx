import logoImg from '../../assets/logo.png';
import logoTextImg from '../../assets/logo_text_beige_hd.png';

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

        {/* Centered Logo */}
        <img 
          src={logoTextImg} 
          alt="Revive Studio Pilates" 
          className="w-full max-w-xs md:max-w-md lg:max-w-xl h-auto object-contain drop-shadow-lg opacity-90 mt-4"
        />
        
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
