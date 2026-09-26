import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

import logoImg from '../assets/logo.png';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLogin, setIsLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '' });
  const [experience, setExperience] = useState(null);
  const [goals, setGoals] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [hasInjury, setHasInjury] = useState('no');
  const [injuryDetails, setInjuryDetails] = useState('');
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '' });
  
  const totalSteps = 5;

  const toggleGoal = (goal) => {
    setGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
  };

  const toggleClassType = (type) => {
    setClassTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const [status, setStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const emailToUse = isLogin ? loginForm.email : registerForm.email;
    setLoading(true);
    setStatus('');
    setPreviewUrl('');
    
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setStatus(data.error || 'Failed to send link');
      } else {
        setStatus(data.message);
        if (data.previewUrl) setPreviewUrl(data.previewUrl);
      }
    } catch (err) {
      console.error(err);
      setStatus('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex font-sans">
      
      {/* Left side: Image Cover */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-end p-12">
        <div className="absolute inset-0 z-0">
          <img src="/src/assets/revive-photos/reformer_5.jpg" alt="Studio" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        
        <div className="relative z-10">
          <Link to="/">
            <img src={logoImg} alt="Revive Pilates" className="h-16 object-contain brightness-0 invert opacity-90 cursor-pointer" />
          </Link>
        </div>
      </div>

      {/* Right side: Form / Wizard */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 sm:px-16 py-12 relative bg-[#F4F7F9]">
        
        {/* Global Login Link */}
        <div className="absolute top-8 right-8 sm:right-16 text-sm text-[#1C2C39]/70 z-20">
          {isLogin ? (
            <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-[#1C2C39] font-bold hover:underline transition-colors">Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-[#1C2C39] font-bold hover:underline transition-colors">Log in</button></>
          )}
        </div>
        
        <div className="w-full max-w-md">
          
          {/* Progress Bar (Only show if not login) */}
          {!isLogin && (
            <div className="flex gap-2 mb-16">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-[#2A180E]' : 'bg-gray-300'}`}></div>
              ))}
            </div>
          )}

          {isLogin ? (
            <div className="animate-fade-in w-full">
              <h1 className="text-4xl font-serif text-[#1C2C39] mb-4">Welcome Back</h1>
              <p className="text-sm font-semibold text-[#1C2C39]/80 mb-8">Please enter your credentials to log in.</p>
              
              <form className="space-y-6" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="block text-xs font-semibold text-[#1C2C39]/60 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={loginForm.email}
                    onChange={e => setLoginForm({ email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-300 focus:outline-none focus:border-[#1C2C39] transition-colors" 
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#433B38] text-white px-8 py-3 font-medium hover:bg-black transition-colors mt-8 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Log In'}
                </button>

                {status && (
                  <div className="mt-4 text-center text-sm font-medium text-brand-dark/80">
                    {status}
                    {previewUrl && (
                      <div className="mt-2">
                        <a href={previewUrl} target="_blank" rel="noreferrer" className="text-brand-brown underline hover:text-brand-dark">
                          Click here to view test email (Ethereal)
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          ) : (
            <>
          {/* Wizard Steps */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-serif text-[#1C2C39] mb-4">Your Pilates experience</h1>
              <p className="text-sm font-semibold text-[#1C2C39]/80 mb-8">What is your current Pilates experience?</p>
              
              <div className="space-y-3 mb-16">
                {['I am new to Pilates', 'I have tried Pilates a few times', 'I regularly do Pilates', 'I am an advanced practitioner'].map((option, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setExperience(option)}
                    className={`w-full text-left px-6 py-4 border transition-colors ${
                      experience === option 
                        ? 'bg-[#433B38] text-white border-[#433B38]' 
                        : 'bg-transparent text-[#1C2C39] border-[#1C2C39] hover:bg-black/5'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!experience}
                  className={`text-[#1C2C39] font-medium flex items-center gap-2 transition-opacity ${!experience ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-70'}`}
                >
                  NEXT &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-serif text-[#1C2C39] mb-4">Your Goals</h1>
              <p className="text-sm font-semibold text-[#1C2C39]/80 mb-8">What are you hoping to achieve? (Select all that apply)</p>
              
              <div className="space-y-3 mb-16">
                {['Build core strength', 'Improve flexibility', 'Rehabilitate an injury', 'Stress relief & mindfulness', 'General fitness & toning'].map((goal, idx) => (
                  <button 
                    key={idx}
                    onClick={() => toggleGoal(goal)}
                    className={`w-full text-left px-6 py-4 border transition-colors flex justify-between items-center ${
                      goals.includes(goal)
                        ? 'bg-[#433B38] text-white border-[#433B38]' 
                        : 'bg-transparent text-[#1C2C39] border-[#1C2C39] hover:bg-black/5'
                    }`}
                  >
                    {goal}
                    {goals.includes(goal) && <span>✓</span>}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="text-[#1C2C39] font-medium hover:opacity-70">&larr; BACK</button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={goals.length === 0}
                  className={`text-[#1C2C39] font-medium flex items-center gap-2 transition-opacity ${goals.length === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-70'}`}
                >
                  NEXT &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-serif text-[#1C2C39] mb-4">Class Preferences</h1>
              <p className="text-sm font-semibold text-[#1C2C39]/80 mb-8">What types of classes interest you most?</p>
              
              <div className="space-y-3 mb-16">
                {['Reformer Pilates', 'Mat Pilates', 'Yogalates (Yoga + Pilates)', 'Private 1-on-1 Sessions'].map((type, idx) => (
                  <button 
                    key={idx}
                    onClick={() => toggleClassType(type)}
                    className={`w-full text-left px-6 py-4 border transition-colors flex justify-between items-center ${
                      classTypes.includes(type)
                        ? 'bg-[#433B38] text-white border-[#433B38]' 
                        : 'bg-transparent text-[#1C2C39] border-[#1C2C39] hover:bg-black/5'
                    }`}
                  >
                    {type}
                    {classTypes.includes(type) && <span>✓</span>}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="text-[#1C2C39] font-medium hover:opacity-70">&larr; BACK</button>
                <button 
                  onClick={() => setStep(4)}
                  disabled={classTypes.length === 0}
                  className={`text-[#1C2C39] font-medium flex items-center gap-2 transition-opacity ${classTypes.length === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-70'}`}
                >
                  NEXT &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-serif text-[#1C2C39] mb-4">Your Health & Safety</h1>
              <p className="text-sm font-semibold text-[#1C2C39]/80 mb-8">Do you have any current or past injuries?</p>
              
              <div className="space-y-6 mb-16">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-[#1C2C39] font-medium border border-[#1C2C39] px-6 py-3 hover:bg-black/5 transition-colors">
                    <input 
                      type="radio" 
                      name="injury" 
                      className="accent-[#2A180E] w-4 h-4" 
                      checked={hasInjury === 'yes'}
                      onChange={() => setHasInjury('yes')}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#1C2C39] font-medium border border-[#1C2C39] px-6 py-3 hover:bg-black/5 transition-colors">
                    <input 
                      type="radio" 
                      name="injury" 
                      className="accent-[#2A180E] w-4 h-4" 
                      checked={hasInjury === 'no'}
                      onChange={() => setHasInjury('no')}
                    />
                    <span>No</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-[#1C2C39]/60 uppercase tracking-wider mb-2">If yes, please specify</label>
                  <input 
                    type="text" 
                    placeholder="Type here..." 
                    value={injuryDetails}
                    onChange={(e) => setInjuryDetails(e.target.value)}
                    disabled={hasInjury === 'no'}
                    className="w-full px-4 py-3 bg-transparent border-b border-[#1C2C39] focus:outline-none focus:border-[#2A180E] placeholder-gray-400 disabled:opacity-30 disabled:cursor-not-allowed" 
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className="text-[#1C2C39] font-medium hover:opacity-70">&larr; BACK</button>
                <button 
                  onClick={() => setStep(5)} 
                  disabled={hasInjury === 'yes' && injuryDetails.trim() === ''}
                  className={`text-[#1C2C39] font-medium flex items-center gap-2 transition-opacity ${hasInjury === 'yes' && injuryDetails.trim() === '' ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-70'}`}
                >
                  NEXT &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-serif text-[#1C2C39] mb-4">Create Account</h1>
              <p className="text-sm font-semibold text-[#1C2C39]/80 mb-8">Let's get your details to finalize registration.</p>
              
              <form className="space-y-6 mb-12" onSubmit={handleLoginSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2C39]/60 uppercase tracking-wider mb-2">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 focus:outline-none focus:border-[#1C2C39] transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2C39]/60 uppercase tracking-wider mb-2">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-300 focus:outline-none focus:border-[#1C2C39] transition-colors" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2C39]/60 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-300 focus:outline-none focus:border-[#1C2C39] transition-colors" 
                  />
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button type="button" onClick={() => setStep(4)} className="text-[#1C2C39] font-medium hover:opacity-70">&larr; BACK</button>
                  <button 
                    type="submit"
                    disabled={loading || !registerForm.email}
                    className="bg-[#433B38] text-white px-8 py-3 font-medium hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Sign Up'}
                  </button>
                </div>

                {status && (
                  <div className="mt-6 text-center text-sm font-medium text-brand-dark/80 bg-white p-4 rounded-xl shadow-sm border border-brand-sand">
                    {status}
                    {previewUrl && (
                      <div className="mt-2">
                        <a href={previewUrl} target="_blank" rel="noreferrer" className="text-brand-brown underline hover:text-brand-dark">
                          Click here to view test email (Ethereal)
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}
          </>
          )}

        </div>
      </div>
    </div>
  );
}
