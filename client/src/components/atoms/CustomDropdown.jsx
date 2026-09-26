import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ value, onChange, options, placeholder, triggerClassName = "px-6 py-4" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full relative h-full flex flex-col justify-center" ref={dropdownRef}>
      <div 
        className={`w-full flex items-center justify-between cursor-pointer group ${triggerClassName}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-bold">
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-[100%] left-0 w-[120%] min-w-[200px] mt-2 bg-[#F5F2ED] border border-[#D8CFC4] rounded-2xl shadow-xl z-50 overflow-hidden py-2">
          {options.map((option, idx) => (
            <div
              key={idx}
              className={`px-6 py-2.5 text-sm cursor-pointer transition-colors ${value === option ? 'font-bold bg-[#3A2A20] text-[#F5F2ED]' : 'text-[#3A2A20] hover:bg-black/5'}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
