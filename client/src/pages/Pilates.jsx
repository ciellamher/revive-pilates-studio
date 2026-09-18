import Navbar from '../components/organisms/Navbar';
import PilatesHeroSection from '../components/organisms/PilatesHeroSection';
import PilatesParallaxText from '../components/organisms/PilatesParallaxText';
import PilatesClassesSection from '../components/organisms/PilatesClassesSection';
import PilatesPricingSection from '../components/organisms/PilatesPricingSection';
import PilatesPrivateSessionSection from '../components/organisms/PilatesPrivateSessionSection';
import PilatesTermsSection from '../components/organisms/PilatesTermsSection';
import ContactFAQSection from '../components/organisms/ContactFAQSection';
import Footer from '../components/organisms/Footer';

export default function Pilates() {
  return (
    <div className="min-h-screen bg-brand-beige">
      <Navbar />
      
      <main className="pt-20">
        <PilatesHeroSection />
        <PilatesParallaxText />
        <PilatesClassesSection />
        <PilatesPricingSection />
        <PilatesPrivateSessionSection />
        <PilatesTermsSection />
        <ContactFAQSection />
      </main>

      <Footer />
    </div>
  );
}
