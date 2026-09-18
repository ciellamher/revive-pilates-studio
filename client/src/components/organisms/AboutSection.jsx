import { Link } from 'react-router-dom';
import aboutImg from '../../assets/revive-photos/reformer_22.jpg';

export default function AboutSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Side: Image */}
        <div className="flex-1 w-full">
          <div className="rounded-[32px] overflow-hidden h-[500px] bg-brand-sand/10 flex items-center justify-center">
            <img src={aboutImg} alt="Revive Pilates Studio" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-brand-dark font-bold mb-6 leading-tight">
            Revive Pilates Studio – <br/>
            Elevate Your Practice
          </h2>
          <p className="text-brand-dark/70 text-lg leading-relaxed mb-8 max-w-lg">
            Revive Pilates Studio is a luxurious, modern space dedicated to your wellness. Enjoy certified instructors, personalized Pilates programs, seamless booking, and a stylish atmosphere designed to inspire strength, grace, and balance. Your journey begins at Revive.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/book" className="px-8 py-3 rounded-full border border-brand-brown text-brand-brown font-medium hover:bg-brand-brown hover:text-brand-beige transition-colors">
              Group Classes
            </Link>
            <Link to="/book" className="px-8 py-3 rounded-full border border-brand-brown text-brand-brown font-medium hover:bg-brand-brown hover:text-brand-beige transition-colors">
              Private Sessions
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
