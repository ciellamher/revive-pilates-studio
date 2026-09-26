import { Link } from 'react-router-dom';

export default function PilatesPrivateSessionSection() {
  return (
    <section className="relative w-full bg-[#D4DAD5] py-24 pb-32 overflow-hidden">
      
      {/* Wavy Text SVG - Zigzag Pattern */}
      <div className="absolute top-0 left-0 w-full h-[450px] overflow-hidden pointer-events-none opacity-80 flex items-start mt-0">
        <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible">
          <path id="wavy-arch" d="M -300,150 Q -100,275 100,150 T 500,150 T 900,150 T 1300,150 T 1700,150" fill="transparent" />
          <text className="text-[52px] font-sans font-medium fill-[#3A2A20]" style={{letterSpacing: '0.05em'}}>
            <textPath href="#wavy-arch" startOffset="0%">
              <animate attributeName="startOffset" from="0%" to="-20%" begin="0s" dur="12s" repeatCount="indefinite" />
              {"Book a Private Session \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ".repeat(40)}
            </textPath>
          </text>
        </svg>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px] md:mt-[160px]">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center md:items-start mb-24">
          
          {/* Left Image */}
          <div className="flex-1 w-full max-w-[450px]">
            <div className="aspect-[3/4] overflow-hidden shadow-sm mt-0 md:mt-12">
               <img src="/src/assets/revive-photos/ladder_barrel_1.jpg" alt="Private Session" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Text, Button & Cards */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mt-20 md:mt-32">
            <div className="w-full max-w-md flex flex-col items-center md:items-start mb-12">
              <p className="text-[#3A2A20] text-[12px] leading-relaxed mb-6 text-center md:text-left font-medium">
                One-on-one and semi-private sessions tailored to your body, goals, and rhythm. Includes 50-minute workout using Pilates equipment such as the Reformer, Tower, and Chair.
              </p>
              
              <Link to="mailto:reserve@revivestudio.com" className="border border-[#3A2A20] text-[#3A2A20] hover:bg-[#3A2A20] hover:text-[#F5F2ED] px-6 py-2 text-[12px] font-medium transition-colors w-fit">
                email to reserve
              </Link>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[500px] mx-auto md:mx-0">
              
              {/* Card 1: Intro Offer */}
              <div className="relative bg-[#F5F2ED] flex flex-col items-center text-center pb-8 pt-0 shadow-sm h-full">
                {/* Badge */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#FCE38A] rounded-full flex items-center justify-center rotate-[-15deg] shadow-sm z-10" style={{clipPath: 'polygon(50% 0%, 61% 11%, 76% 7%, 83% 21%, 98% 25%, 95% 40%, 100% 55%, 89% 66%, 86% 81%, 71% 84%, 60% 98%, 45% 92%, 31% 100%, 22% 86%, 7% 81%, 12% 66%, 0% 52%, 9% 38%, 3% 23%, 18% 18%, 24% 3%)'}}>
                  <span className="text-[10px] font-bold text-[#3A2A20] leading-tight px-2 text-center">Intro<br/>Offer!</span>
                </div>

                <div className="w-full h-4 bg-[#3B657F] mb-8 shrink-0"></div>

                <div className="flex flex-col flex-grow w-full px-6">
                  <h3 className="text-[13px] font-medium text-[#3A2A20] mb-2">Intro Class</h3>
                  <p className="text-[10px] uppercase tracking-wider text-[#3A2A20]/80 mb-4">3-Session Package</p>
                  <div className="flex justify-center items-end gap-1 mb-4 flex-grow">
                    <span className="text-4xl lg:text-[42px] font-sans text-[#3A2A20] leading-none">₱6,000</span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex flex-col items-center shrink-0 w-full">
                    <p className="text-[10px] italic text-[#3A2A20] mb-2 font-medium">For first-time private clients only!</p>
                    <p className="text-[10px] italic text-[#3A2A20]/70 mb-6">Expires 30 days after purchase.</p>
                    
                    <Link to="/checkout" className="flex justify-center items-center border border-[#3A2A20] text-[#3A2A20] hover:bg-[#3A2A20] hover:text-[#F5F2ED] px-8 py-2 text-[12px] font-medium transition-colors w-full bg-transparent whitespace-nowrap">
                      Buy now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2: Private Session */}
              <div className="relative bg-[#F5F2ED] flex flex-col items-center text-center pb-8 pt-0 shadow-sm h-full mt-8 sm:mt-0">
                <div className="w-full h-4 bg-[#3B657F] mb-8 shrink-0"></div>

                <div className="flex flex-col flex-grow w-full px-6">
                  <h3 className="text-[13px] font-medium text-[#3A2A20] mb-6 mt-0">Single Session</h3>
                  <div className="flex justify-center items-end gap-1 mb-6 flex-grow">
                    <span className="text-4xl lg:text-[42px] font-sans text-[#3A2A20] leading-none">₱2,500</span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex flex-col items-center shrink-0 w-full">
                    <div className="h-[23px] mb-2 hidden sm:block"></div> {/* Spacer to match the "For first time..." height */}
                    <p className="text-[10px] italic text-[#3A2A20]/70 mb-6">Expires 30 days after purchase.</p>
                    
                    <Link to="/checkout" className="flex justify-center items-center border border-[#3A2A20] text-[#3A2A20] hover:bg-[#3A2A20] hover:text-[#F5F2ED] px-8 py-2 text-[12px] font-medium transition-colors w-full bg-transparent whitespace-nowrap">
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
