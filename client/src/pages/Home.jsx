import Navbar from '../components/organisms/Navbar';
import HeroSection from '../components/organisms/HeroSection';
import OfferingsSection from '../components/organisms/OfferingsSection';
import AboutSection from '../components/organisms/AboutSection';
import LocationSection from '../components/organisms/LocationSection';
import ClassScheduleGrid from '../components/organisms/ClassScheduleGrid';
import NewsletterSection from '../components/organisms/NewsletterSection';
import JourneySection from '../components/organisms/JourneySection';
import ContactFAQSection from '../components/organisms/ContactFAQSection';
import Footer from '../components/organisms/Footer';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="min-h-screen bg-brand-beige">
      <Navbar />
      
      <main>
        <HeroSection />
        <OfferingsSection />
        <AboutSection />
        <ClassScheduleGrid hideTitle={true} />
        {isLoggedIn ? <JourneySection /> : <NewsletterSection />}
        <LocationSection />
        <ContactFAQSection />
      </main>

      {/* Unified Main Footer */}
      <Footer />
    </div>
  );
}
