import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function PilatesTermsSection() {
  const [openTerm, setOpenTerm] = useState(null);

  const terms = [
    {
      title: "Bookings",
      content: "Classes can be booked online through our website booking platform or the Mindbody app. We recommend booking in advance, as class sizes are intentionally limited to ensure a personalised experience.\n\nBookings are subject to availability."
    },
    {
      title: "Cancellation Policy",
      content: "We kindly ask that all cancellations be made at least 6 hours before your scheduled class. Late cancellations and no-shows may incur a fee or result in the loss of the class credit or booking, depending on your membership or class pack.\n\nThis policy allows members on our waitlist the opportunity to attend."
    },
    {
      title: "Waitlist",
      content: "If a class is full, you may join the waitlist. Should a place become available, you will be automatically added to the class and notified.\n\nPlease ensure your notifications are enabled and remove yourself from the waitlist if you are no longer able to attend."
    },
    {
      title: "Health & Safety",
      content: "Please inform your instructor of any injuries, pregnancies or medical conditions before class.\n\nWhile our instructors provide guidance and modifications, participation is undertaken at your own discretion."
    },
    {
      title: "Changes to Schedule",
      content: "Occasionally we may adjust instructors, class formats or timetables. Where possible we will provide advance notice, however changes may occasionally occur without notice."
    },
    {
      title: "General",
      content: "By attending Revive Pilates you agree to these Terms & Conditions.\n\nWe reserve the right to update these terms as required."
    }
  ];

  return (
    <section className="bg-[#E8E4DB] text-[#3A2A20] py-24 md:py-32" id="terms">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-8">
          
          {/* Left Title */}
          <div>
            <h2 className="text-4xl md:text-5xl font-sans text-[#3A2A20]">Terms &<br/>Conditions</h2>
          </div>
          
          {/* Right Accordion */}
          <div className="flex flex-col">
            {terms.map((term, idx) => (
              <div key={idx} className="border-t border-[#3A2A20]/20 last:border-b">
                <button 
                  onClick={() => setOpenTerm(openTerm === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span className="text-[15px] font-medium text-[#3A2A20] group-hover:text-black transition-colors pr-8">
                    {term.title}
                  </span>
                  <span className="text-[#3A2A20]/50 shrink-0 font-light">
                    {openTerm === idx ? <Minus size={20} strokeWidth={1} /> : <Plus size={20} strokeWidth={1} />}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openTerm === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="text-sm text-[#3A2A20]/80 leading-relaxed space-y-4">
                    {term.content.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
