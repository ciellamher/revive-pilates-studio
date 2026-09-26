import heroImage from '../../assets/revive-photos/studio_empty_1.jpg';
import logoTextImg from '../../assets/logo_text_beige_hd.png';

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

      {/* Centered Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-12 w-full max-w-4xl px-8">
        <img 
          src={logoTextImg} 
          alt="Revive Studio Pilates" 
          className="w-full h-auto max-h-32 md:max-h-48 lg:max-h-64 object-contain drop-shadow-lg opacity-90"
        />
      </div>

    </div>
  );
}
