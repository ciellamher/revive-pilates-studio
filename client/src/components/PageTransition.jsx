import { useEffect, useState, cloneElement, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import logoTextImg from '../assets/logo_text.png';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  // phases: 'initial_center' (on load), 'top' (snap before entering), 'entering' (sliding in), 'exiting' (sliding out), 'idle' (hidden)
  const [phase, setPhase] = useState('initial_center');
  const timerRef = useRef(null);

  // Initial welcome screen timeout
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('exiting');
      timerRef.current = setTimeout(() => {
        setPhase('idle');
      }, 700); // 700ms is the duration of the slide out
    }, 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Clear any ongoing idle timeouts
      if (timerRef.current) clearTimeout(timerRef.current);

      // 1. Snap to top instantly (out of viewport)
      setPhase('top');
      
      // 2. Wait a tiny bit for DOM to apply 'top', then start sliding down to center
      const t1 = setTimeout(() => {
        setPhase('entering');
      }, 30);
      
      // 3. Wait for it to cover the screen, then swap the page content
      const t2 = setTimeout(() => {
        setDisplayLocation(location);
        window.scrollTo(0, 0);
        
        // 4. Slide out down to the bottom
        const t3 = setTimeout(() => {
          setPhase('exiting');
          
          // 5. Reset to idle after animation finishes
          timerRef.current = setTimeout(() => {
            setPhase('idle');
          }, 700);
        }, 100); // short pause at center
      }, 700); // 700ms slide in duration

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [location, displayLocation.pathname]);

  const getOverlayClass = () => {
    switch (phase) {
      case 'initial_center':
        return 'translate-y-0 transition-none opacity-100 z-[9999]';
      case 'top':
        return '-translate-y-full transition-none opacity-100 z-[9999]';
      case 'entering':
        return 'translate-y-0 transition-transform duration-700 ease-in-out opacity-100 z-[9999]';
      case 'exiting':
        return 'translate-y-full transition-transform duration-700 ease-in-out opacity-100 z-[9999]';
      case 'idle':
      default:
        return 'translate-y-full opacity-0 pointer-events-none transition-none z-[-1]';
    }
  };

  return (
    <>
      {/* Full Screen Overlay matching the screenshot */}
      <div 
        className={`fixed inset-0 bg-brand-dark flex flex-col items-center justify-center will-change-transform ${getOverlayClass()}`}
      >
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Logo Icon Mask in White */}
          <div 
            className="w-24 h-24 md:w-32 md:h-32"
            style={{
              backgroundColor: '#FFFFFF',
              maskImage: `url(${logoImg})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: `url(${logoImg})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center'
            }}
          ></div>

          {/* Logo Text Mask in White */}
          <div 
            className="w-64 h-16 md:w-96 md:h-24"
            style={{
              backgroundColor: '#FFFFFF',
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

      {/* Actual Route Content (delayed to wait for transition) */}
      {cloneElement(children, { location: displayLocation })}
    </>
  );
}
