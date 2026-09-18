import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BarChart, ChevronLeft, ChevronRight } from 'lucide-react';
import imgReformer from '../../assets/revive-photos/reformer_1.jpg';
import imgMat from '../../assets/revive-photos/mat_pilates_1.jpg';
import imgBarre from '../../assets/revive-photos/barre_6.jpg';
import imgPrivate from '../../assets/revive-photos/studio_empty_1.jpg';
import imgClinical from '../../assets/revive-photos/barre_12.jpg';
import imgPrenatal from '../../assets/revive-photos/mat_pilates_5.jpg';
import imgPostnatal from '../../assets/revive-photos/mat_pilates_8.jpg';

export default function PilatesClassesSection() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const classes = [
    {
      id: 'reformer-classes',
      title: 'Reformer Classes',
      subtitle: 'Dynamic Resistance Training',
      points: [
        'Utilizes a special equipment called a "reformer"',
        'Offers adjustable resistance through springs and pulleys',
        'Provides a broader range of exercises in various positions'
      ],
      image: imgReformer
    },
    {
      id: 'mat-classes',
      title: 'Mat Classes',
      subtitle: 'Foundational Core Work',
      points: [
        'Performed on a mat or padded surface',
        'Uses body weight and minimal props for resistance',
        'Accessible and can be practiced in various settings',
        'Suitable for those seeking a simple Pilates experience'
      ],
      image: imgMat
    },
    {
      id: 'barre-classes',
      title: 'Barre Classes',
      subtitle: 'Low-Impact Sculpting',
      points: [
        'Full-body, low-impact workout',
        'Combines elements of ballet, Pilates, and yoga',
        'Uses small, controlled movements at the barre and on the mat',
        'Focuses on core stability, glute activation, and total-body toning'
      ],
      image: imgBarre
    },
    {
      id: 'private-classes',
      title: 'Private Classes',
      subtitle: 'Personalized Guidance',
      points: [
        'One-on-one, duo, or trio sessions',
        'Designed to meet your specific goals and needs',
        'Provides focused guidance and precise form correction'
      ],
      image: imgPrivate
    },
    {
      id: 'clinical-pilates',
      title: 'Clinical Pilates',
      subtitle: 'Therapeutic Movement',
      points: [
        'Led by a licensed physical therapist or certified clinical Pilates instructor',
        'Focuses on assessment-based, safe, and controlled movement',
        'Typically taken with a doctor\'s referral'
      ],
      image: imgClinical
    },
    {
      id: 'prenatal-pilates',
      title: 'Prenatal Pilates',
      subtitle: 'Support During Pregnancy',
      points: [
        'Designed for expectant mothers',
        'Enhances strength, mobility, and body support during pregnancy',
        'Emphasizes safe, controlled movements'
      ],
      image: imgPrenatal
    },
    {
      id: 'postnatal-pilates',
      title: 'Postnatal Pilates',
      subtitle: 'Postpartum Recovery',
      points: [
        'Designed for postpartum recovery',
        'Focuses on core strength, stability, and proper alignment',
        'Supports a safe and gradual return to movement'
      ],
      image: imgPostnatal
    }
  ];

  return (
    <section className="relative w-full bg-brand-beige py-24 pb-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-sans font-medium text-brand-dark">Our Classes</h2>
          <div className="flex items-center gap-3 hidden sm:flex">
            <button 
              onClick={scrollLeft}
              className="p-3 rounded-full border border-brand-dark/20 hover:bg-brand-dark hover:text-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={scrollRight}
              className="p-3 rounded-full border border-brand-dark/20 hover:bg-brand-dark hover:text-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 mb-12 pb-8 scrollbar-hide px-4 md:px-0"
        >
          {classes.map((cls) => (
            <div key={cls.id} className="w-[85vw] md:w-[380px] lg:w-[400px] snap-center shrink-0 bg-white flex flex-col rounded-[24px] overflow-hidden shadow-sm border border-brand-dark/5">
              <div className="w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden">
                {cls.image ? (
                  <img 
                    src={cls.image} 
                    alt={cls.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#E5E0DA] flex items-center justify-center">
                    <span className="text-brand-dark/30 text-sm font-medium tracking-widest uppercase">Placeholder</span>
                  </div>
                )}
              </div>
              <div className="p-6 pt-6 flex flex-col flex-grow">
                <h3 className="text-[22px] font-sans font-bold text-brand-dark mb-4">{cls.title}</h3>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#F5B82E] text-[#F5B82E]" />
                  ))}
                  <div className="ml-2 border border-brand-dark/20 rounded-full px-3 py-1 text-[11px] font-medium text-brand-dark/70">
                    {Math.floor(Math.random() * 20) + 5} Reviews
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-[12px] font-medium text-brand-dark/80">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{cls.id.includes('private') ? 'From 55 mins' : '55 mins'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart size={14} />
                    <span>All Levels</span>
                  </div>
                </div>
                
                <p className="text-brand-dark/70 text-[13px] leading-relaxed mb-6 line-clamp-3">
                  {cls.points.join('. ')}.
                </p>

                <div className="mt-auto">
                  <Link to="/book" className="inline-block bg-[#3A2A20] text-white px-6 py-2.5 rounded-full text-[13px] font-medium hover:bg-black transition-colors">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
