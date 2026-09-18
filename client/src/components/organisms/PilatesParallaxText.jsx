export default function PilatesParallaxText() {
  return (
    <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center bg-brand-beige py-32 px-4 overflow-hidden pt-40">
      <div className="flex flex-col items-center justify-center w-full max-w-[1400px] text-center">
        <p className="text-sm md:text-base font-sans text-brand-dark/80 mb-8 uppercase tracking-widest font-medium">
          More On The Classes We Offer
        </p>
        <h1 
          className="text-7xl sm:text-[120px] md:text-[160px] lg:text-[200px] font-serif leading-none tracking-tight mb-4"
          style={{
            backgroundImage: "url('/src/assets/revive-photos/reformer_1.jpg')",
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent'
          }}
        >
          EXPLORE
        </h1>

        {/* OUR CLASSES Text with Parallax Background */}
        <h1 
          className="text-6xl sm:text-[100px] md:text-[140px] lg:text-[180px] font-serif italic leading-none tracking-tighter mt-4"
          style={{
            backgroundImage: "url('/src/assets/revive-photos/reformer_28.jpg')",
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent'
          }}
        >
          OUR CLASSES
        </h1>
      </div>

    </section>
  );
}
