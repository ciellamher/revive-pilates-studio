import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  { question: "What should I bring to a Pilates class?", answer: "We recommend bringing a water bottle, grip socks (required for reformer classes), and a small towel. Wear comfortable, form-fitting athletic wear so our instructors can check your alignment." },
  { question: "Do I need any experience to join?", answer: "Not at all! We welcome all levels. If you are new, we highly recommend starting with our beginner-friendly Mat Pilates or a Solo Session to get familiar with the equipment and terminology." },
  { question: "What's the difference between mat and reformer Pilates?", answer: "Mat Pilates uses your own body weight for resistance on a floor mat, focusing on core strength. Reformer Pilates uses a specialized machine with springs and pulleys to provide varied resistance and support." },
  { question: "How long are the classes?", answer: "All our group classes and private sessions run for 50 minutes, which includes a warm-up and a cool-down stretch." },
  { question: "How often should I attend?", answer: "For the best results, we recommend practicing 2-3 times a week. Consistency is key to building strength, flexibility, and mind-body connection." },
  { question: "How do I book or cancel a class?", answer: "You can easily book or cancel through your dashboard. Please note our 12-hour cancellation policy to avoid being charged for the session." }
];

export default function ContactFAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <section className="bg-brand-dark py-24 md:py-32" id="faqs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-8">
          
          {/* Left Title */}
          <div>
            <h2 className="text-4xl md:text-5xl font-sans text-brand-beige">FAQs</h2>
          </div>
          
          {/* Right Accordion */}
          <div className="flex flex-col">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border-t border-brand-beige/30 last:border-b">
                <button 
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span className="text-[15px] font-medium text-brand-beige group-hover:text-white transition-colors pr-8">
                    {faq.question}
                  </span>
                  <span className="text-brand-beige/50 shrink-0 font-light">
                    {openFAQ === idx ? <Minus size={20} strokeWidth={1} /> : <Plus size={20} strokeWidth={1} />}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm text-brand-beige/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
