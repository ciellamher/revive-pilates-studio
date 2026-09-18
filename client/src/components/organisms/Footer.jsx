import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import logoTextImg from '../../assets/logo_text.png';

export default function Footer() {
  return (
    <footer className="w-full bg-[#EBE7DF] pt-16 pb-24 border-t border-brand-sand/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
          
          {/* Left Column: Logo & Address */}
          <div className="flex flex-col">
            <img src={logoTextImg} alt="Revive Pilates" className="h-10 md:h-12 object-contain mb-6 -ml-2 filter invert brightness-0 saturate-100 opacity-90" style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(8%) saturate(2206%) hue-rotate(345deg) brightness(91%) contrast(85%)' }} />
            <div className="text-brand-dark text-[13px] leading-relaxed flex flex-col gap-4">
              <div>
                <p className="font-bold mb-0.5 opacity-80">Angeles City</p>
                <p>Omnistellar Building</p>
                <p>Fil-Am Friendship Hwy, Angeles City</p>
              </div>
              <div>
                <p className="font-bold mb-0.5 opacity-80">San Fernando</p>
                <p>St. Charbel Square Building</p>
                <p>MacArthur Hwy, San Fernando</p>
              </div>
            </div>
          </div>

          {/* Right Columns: Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 lg:gap-32">
            
            {/* Resources */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[15px] font-medium text-brand-dark mb-4">Resources</h4>
              <Link to="/schedule" className="text-[13px] text-brand-dark/80 hover:text-brand-dark underline decoration-brand-dark/30 underline-offset-4 transition-colors">Schedule</Link>
              <a href="#faqs" className="text-[13px] text-brand-dark/80 hover:text-brand-dark underline decoration-brand-dark/30 underline-offset-4 transition-colors">FAQs</a>
              <Link to="/policies" className="text-[13px] text-brand-dark/80 hover:text-brand-dark underline decoration-brand-dark/30 underline-offset-4 transition-colors">Studio Policies</Link>
              <Link to="/intake" className="text-[13px] text-brand-dark/80 hover:text-brand-dark underline decoration-brand-dark/30 underline-offset-4 transition-colors">Private Session Intake Form</Link>
              <Link to="/privacy" className="text-[13px] text-brand-dark/80 hover:text-brand-dark underline decoration-brand-dark/30 underline-offset-4 transition-colors">Privacy Policy</Link>
              <a href="#" className="text-[13px] text-brand-dark/80 hover:text-brand-dark underline decoration-brand-dark/30 underline-offset-4 transition-colors">Download Our App</a>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[15px] font-medium text-brand-dark mb-4">Contact</h4>
              <a href="mailto:hello@revivestudio.com.ph" className="text-[13px] text-brand-dark/80 hover:text-brand-dark underline decoration-brand-dark/30 underline-offset-4 transition-colors">hello@revivestudio.com.ph</a>
              <p className="text-[13px] text-brand-dark/80">(045) 888-0000</p>
              
              <div className="mt-4 flex items-center gap-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-brand-dark hover:opacity-70 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-brand-dark hover:opacity-70 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
