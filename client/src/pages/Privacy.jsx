import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';

const SECTIONS = [
  ['What we collect', [
    'Your name and email address when you sign in, book a class, buy a package or join our newsletter.',
    'Anything you add to your profile: mobile number, date of birth, gender and address.',
    'Your bookings, package purchases, payment reference numbers and any receipt image you attach.',
  ]],
  ['How we use it', [
    'To run your bookings: holding your spot, confirming payments, and emailing your confirmation, class reminder or cancellation notice.',
    'To send studio news and offers, only if you switched "Deals and promotions" on or joined the newsletter.',
    'We do not sell your information or share it with advertisers.',
  ]],
  ['Your choices', [
    'Edit your details and email preferences anytime under My profile and Notification settings.',
    'Class reminders can be turned off. Booking confirmations and cancellation notices are always sent, because they are about something you booked.',
    'To have your account and history removed, email us at hello.revivepilates@gmail.com.',
  ]],
  ['How it is kept', [
    'Your information is stored in our database, hosted by Neon and Vercel. Sign-in uses one-time email links, so we never store a password for you.',
  ]],
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 max-w-3xl w-full mx-auto px-4 sm:px-6">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-dark mb-4">Privacy Policy</h1>
        <p className="text-brand-dark/70 mb-12">How Revive Pilates Studio handles the information you give us.</p>
        {SECTIONS.map(([title, points]) => (
          <section key={title} className="mb-10">
            <h2 className="text-xl font-bold text-brand-dark mb-4">{title}</h2>
            <ul className="space-y-3 text-brand-dark/80 leading-relaxed list-disc pl-5">
              {points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
