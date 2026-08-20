import * as React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const COUNTRIES = [
  { code: 'CA', name: 'Canada',      flag: '🇨🇦' },
  { code: 'US', name: 'USA',         flag: '🇺🇸' },
  { code: 'GB', name: 'UK',          flag: '🇬🇧' },
  { code: 'AU', name: 'Australia',   flag: '🇦🇺' },
  { code: 'DE', name: 'Germany',     flag: '🇩🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'IE', name: 'Ireland',     flag: '🇮🇪' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'SG', name: 'Singapore',   flag: '🇸🇬' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
];

export default function CountriesPage() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggle = (code: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.size === 0) {
      toast.error('Please select at least one country');
      return;
    }
    // Save to localStorage for use in home screen
    localStorage.setItem('selected_countries', JSON.stringify([...selected]));
    setLocation('/home');
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-[430px] mx-auto flex flex-col items-center bg-[#f5f7f8] gto-app-shell overflow-y-auto">
      <div className="w-full max-w-[420px] flex flex-col px-5 pb-6">

        {/* Logo */}
        <div className="pt-10 pb-2 flex justify-center">
          <img src="/logo.png" alt="Globetrek Overseas" className="h-12 w-auto object-contain" style={{ maxWidth: 200 }} />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 pt-3 pb-6">
          <button
            onClick={() => setLocation('/documents')}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[22px] font-bold text-slate-900">Choose Countries</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Select countries you are interested in</p>
          </div>
        </div>

        {/* Country grid */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {COUNTRIES.map((country, i) => {
            const isSelected = selected.has(country.code);
            return (
              <motion.button
                key={country.code}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => toggle(country.code)}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-[#087b41] bg-[#f0faf5]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5">
                    <CheckCircle2 size={18} className="text-[#087b41]" fill="#087b41" stroke="white" />
                  </div>
                )}
                <span className="text-[38px] leading-none">{country.flag}</span>
                <span className={`text-[13px] font-semibold ${isSelected ? 'text-[#087b41]' : 'text-slate-700'}`}>
                  {country.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Continue button */}
        <div className="py-6">
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-[#087b41] text-white font-bold text-[16px] hover:bg-[#236040] active:scale-[0.98] transition-all shadow-lg shadow-[#087b41]/25 disabled:opacity-50"
            disabled={selected.size === 0}
          >
            Continue {selected.size > 0 && `(${selected.size} selected)`}
          </button>
        </div>
      </div>
    </div>
  );
}
