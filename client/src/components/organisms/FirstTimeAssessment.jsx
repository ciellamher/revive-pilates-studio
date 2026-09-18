import { useState } from 'react';

export default function FirstTimeAssessment() {
  const [experience, setExperience] = useState(null);
  
  return (
    <div className="bg-brand-sand/10 rounded-2xl p-6 border border-brand-sand/40 shadow-sm mb-6">
      <h3 className="font-serif text-2xl font-bold text-brand-dark mb-2">First-Time Assessment</h3>
      <p className="text-sm text-brand-dark/70 mb-6">Help us guide you safely by answering a few quick questions.</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-3">What is your current Pilates experience?</label>
          <div className="space-y-2">
            {['I am new to Pilates', 'I have tried Pilates a few times', 'I regularly do Pilates'].map((option, idx) => (
              <button 
                key={idx}
                onClick={() => setExperience(option)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                  experience === option 
                    ? 'bg-brand-brown text-white border-brand-brown' 
                    : 'bg-white text-brand-dark border-brand-sand hover:border-brand-brown'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-dark mb-3">Do you have any current or past injuries?</label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="injury" className="accent-brand-brown w-4 h-4" />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="injury" className="accent-brand-brown w-4 h-4" />
              <span>No</span>
            </label>
          </div>
          <input type="text" placeholder="If yes, please specify..." className="w-full px-4 py-2 rounded-xl border border-brand-sand focus:outline-none focus:border-brand-brown" />
        </div>
      </div>
    </div>
  );
}
