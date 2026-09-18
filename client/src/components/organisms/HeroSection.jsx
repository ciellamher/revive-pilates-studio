import heroImage from '../../assets/revive-photos/studio_empty_1.jpg';
import logoTextImg from '../../assets/logo_text.png';

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-dark flex items-center justify-center">
      
      {/* Full Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: 'center 40%' // Adjust to focus on the back
        }}
      >
      </div>
      
      {/* Optional Dark Overlay for contrast and mood */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

      {/* Centered Logo Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-12 w-full max-w-4xl px-8">
        <div 
          className="w-full h-32 md:h-48 lg:h-64 drop-shadow-lg opacity-90"
          style={{
            backgroundColor: '#DCD1C4',
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

    </div>
  );
}
