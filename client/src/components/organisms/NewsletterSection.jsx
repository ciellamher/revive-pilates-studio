export default function NewsletterSection() {
  return (
    <section className="relative w-full min-h-[700px] flex items-center justify-center pt-32 pb-24 overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/src/assets/revive-photos/studio_empty_1.jpg" alt="Studio background" className="w-full h-full object-cover" />
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

      {/* Form Card */}
      <div className="relative z-20 bg-[#E8E4D9] p-8 md:p-12 w-[90%] max-w-[600px] shadow-2xl rounded-[32px]">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3A2A20] mb-2 font-sans">
          Let's Make It Official.
        </h2>
        <p className="text-[#3A2A20]/80 text-sm mb-8 font-sans">
          Sign up for early access, studio news, and all things Revive.
        </p>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#3A2A20] mb-2 px-1">First Name *</label>
              <input 
                type="text" 
                required
                className="w-full bg-[#F5F2ED] border border-gray-300 rounded-full px-5 py-3 text-sm outline-none focus:border-[#516B84] transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#3A2A20] mb-2 px-1">Last Name *</label>
              <input 
                type="text" 
                required
                className="w-full bg-[#F5F2ED] border border-gray-300 rounded-full px-5 py-3 text-sm outline-none focus:border-[#516B84] transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#3A2A20] mb-2 px-1">Email *</label>
            <input 
              type="email" 
              required
              className="w-full bg-[#F5F2ED] border border-gray-300 rounded-full px-5 py-3 text-sm outline-none focus:border-[#516B84] transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 bg-[#516B84] text-white py-3 md:py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#3A4E63] transition-colors shadow-sm"
          >
            Submit
          </button>
        </form>
      </div>

    </section>
  );
}
