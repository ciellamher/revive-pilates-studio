import { Link } from 'react-router-dom';

export default function PilatesPrivateSessionSection() {
  return (
    <section className="relative w-full bg-[#D4DAD5] py-24 pb-32 overflow-hidden">
      
      {/* Arched Text SVG - Pure Strict Implementation */}
      <div className="absolute top-0 left-0 w-full h-[250px] overflow-hidden pointer-events-none opacity-80 flex items-center">
        <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible">
          <path id="deep-arch" d="M -1000,20 Q 500,350 2000,20" fill="transparent" />
          <text className="text-[48px] font-sans font-medium fill-[#3A2A20]" style={{letterSpacing: '0.05em'}}>
            <textPath href="#deep-arch" startOffset="0%">
              <animate attributeName="startOffset" from="0%" to="-20%" begin="0s" dur="8s" repeatCount="indefinite" />
              {"Book a Private Session \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ".repeat(40)}
            </textPath>
          </text>
        </svg>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-[350px] md:mt-[400px]">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center mb-24">
          
          {/* Left Image */}
          <div className="flex-1 w-full max-w-[500px]">
            <div className="aspect-[4/5] overflow-hidden shadow-sm">
               <img src="/src/assets/revive-photos/ladder_barrel_1.jpg" alt="Private Session" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Text, Button & Cards */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mt-10 md:mt-0">
            <p className="text-[#3A2A20] text-sm leading-relaxed max-w-md mb-16">
              One-on-one and semi-private sessions tailored to your body, goals, and rhythm. Includes 50-minute workout using Pilates equipment such as the Reformer, Tower, and Chair.
            </p>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[900px]">
              
              {/* Card 1: Private Single */}
              <div className="relative bg-[#D8CFC4] flex flex-col items-center text-center pb-8 pt-0 shadow-sm h-full">
                <div className="w-full h-4 bg-[#3A2A20] mb-8 shrink-0"></div>

                <div className="flex flex-col flex-grow w-full px-8">
                  <div className="min-h-[20px] mb-3">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#3A2A20]/80">Private Classes</p>
                  </div>
                  <h3 className="text-[14px] font-medium text-[#3A2A20] mb-6">Single Session</h3>
                  <div className="flex justify-center items-end gap-1 mb-6 flex-grow">
                    <span className="text-3xl lg:text-4xl font-sans text-[#3A2A20] leading-none">₱2,500</span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex flex-col items-center shrink-0 w-full">
                    <p className="text-[12px] italic text-[#3A2A20]/70 mb-4">Expires 30 days after purchase.</p>
                    <div className="h-[18px] mb-6 flex items-center justify-center invisible">
                      <p className="text-[12px] text-[#3A2A20]/60 uppercase tracking-wider font-semibold">*per pax*</p>
                    </div>
                    
                    <Link to="/checkout" className="flex justify-center items-center border border-[#3A2A20] text-[#3A2A20] hover:bg-[#3A2A20] hover:text-[#F5F2ED] px-8 py-2 text-[14px] font-medium transition-colors w-full bg-transparent whitespace-nowrap">
                      Buy now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2: Duo */}
              <div className="relative bg-[#D8CFC4] flex flex-col items-center text-center pb-8 pt-0 shadow-sm h-full mt-8 sm:mt-0">
                <div className="w-full h-4 bg-[#3A2A20] mb-8 shrink-0"></div>

                <div className="flex flex-col flex-grow w-full px-8">
                  <div className="min-h-[20px] mb-3">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#3A2A20]/80">Duo Private Classes</p>
                  </div>
                  <h3 className="text-[14px] font-medium text-[#3A2A20] mb-6">Duo Private Session</h3>
                  <div className="flex justify-center items-end gap-1 mb-6 flex-grow">
                    <span className="text-3xl lg:text-4xl font-sans text-[#3A2A20] leading-none">₱2,200</span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex flex-col items-center shrink-0 w-full">
                    <p className="text-[12px] italic text-[#3A2A20]/70 mb-4">Expires 30 days after purchase.</p>
                    <div className="h-[18px] mb-6 flex items-center justify-center">
                      <p className="text-[12px] text-[#3A2A20]/60 uppercase tracking-wider font-semibold">*per pax*</p>
                    </div>
                    
                    <Link to="/checkout" className="flex justify-center items-center border border-[#3A2A20] text-[#3A2A20] hover:bg-[#3A2A20] hover:text-[#F5F2ED] px-8 py-2 text-[14px] font-medium transition-colors w-full bg-transparent whitespace-nowrap">
                      Buy now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 3: Trio */}
              <div className="relative bg-[#D8CFC4] flex flex-col items-center text-center pb-8 pt-0 shadow-sm h-full mt-8 lg:mt-0">
                <div className="w-full h-4 bg-[#3A2A20] mb-8 shrink-0"></div>

                <div className="flex flex-col flex-grow w-full px-8">
                  <div className="min-h-[20px] mb-3">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#3A2A20]/80">Trio Private Classes</p>
                  </div>
                  <h3 className="text-[14px] font-medium text-[#3A2A20] mb-6">Trio Private Session</h3>
                  <div className="flex justify-center items-end gap-1 mb-6 flex-grow">
                    <span className="text-3xl lg:text-4xl font-sans text-[#3A2A20] leading-none">₱2,000</span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex flex-col items-center shrink-0 w-full">
                    <p className="text-[12px] italic text-[#3A2A20]/70 mb-4">Expires 30 days after purchase.</p>
                    <div className="h-[18px] mb-6 flex items-center justify-center">
                      <p className="text-[12px] text-[#3A2A20]/60 uppercase tracking-wider font-semibold">*per pax*</p>
                    </div>
                    
                    <Link to="/checkout" className="flex justify-center items-center border border-[#3A2A20] text-[#3A2A20] hover:bg-[#3A2A20] hover:text-[#F5F2ED] px-8 py-2 text-[14px] font-medium transition-colors w-full bg-transparent whitespace-nowrap">
                      Buy now
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
