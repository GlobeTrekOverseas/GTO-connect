import { useLocation } from 'wouter';
import { ArrowRight, Award, GraduationCap, Plane, ShieldCheck, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  { label: 'Expert Counselling', icon: UserRound },
  { label: 'University Admissions', icon: GraduationCap },
  { label: 'Visa Assistance', icon: ShieldCheck },
  { label: 'Scholarships', icon: Award },
  { label: 'Pre & Post Departure Support', icon: Plane },
];

export default function SplashPage() {
  const [, setLocation] = useLocation();
  return <div className="min-h-[100dvh] w-full max-w-[430px] mx-auto overflow-hidden gto-travel-canvas--dark text-white flex flex-col">
    <section className="relative overflow-hidden px-7 pt-12 pb-0 min-h-[58dvh] bg-transparent">
      <div className="absolute -right-12 top-44 h-44 w-44 rounded-full border border-white/5" />
      <img src="/logo.png" alt="GlobeTrek Overseas" className="h-24 w-auto max-w-full object-contain object-left" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}>
        <h1 className="mt-12 text-[30px] font-bold leading-[1.1] tracking-tight">Your Dream.<br/>Our Guidance.<br/><span className="text-[#f0bc42]">Global Success.</span></h1>
        <p className="mt-4 max-w-[250px] text-[14px] leading-relaxed text-slate-100">From University Selection to Visa – We've got you covered!</p>
      </motion.div>
      <div className="relative mt-7 h-44 -mx-7 overflow-hidden bg-[radial-gradient(ellipse_at_50%_100%,#46749b_0,transparent_44%)]">
        <div className="absolute bottom-4 left-7 h-28 w-7 bg-[#ded8c9] [clip-path:polygon(45%_0,55%_0,55%_100%,45%_100%)]" />
        <div className="absolute bottom-4 left-16 h-20 w-11 bg-[#d6d8d0] [clip-path:polygon(35%_0,65%_0,65%_100%,35%_100%)]" />
        <div className="absolute bottom-4 left-[48%] h-24 w-14 bg-[#d9dfdc] [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
        <div className="absolute bottom-4 right-14 h-32 w-11 bg-[#cdd9dd] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
        <Plane className="absolute right-12 top-2 -rotate-20 text-white" size={42} fill="white" />
        <div className="absolute bottom-0 inset-x-0 h-7 bg-[#0a7140] rounded-t-[55%]" />
      </div>
    </section>
    <section className="flex-1 bg-[#062a53]/80 backdrop-blur-[1px] px-7 pt-7 pb-8">
      <div className="space-y-4">
        {services.map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-4 text-[16px] font-medium"><div className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#087442]"><Icon size={20}/></div>{label}</div>)}
      </div>
      <button onClick={() => setLocation('/onboarding')} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-[15px] font-bold text-[#075e36] shadow-lg active:scale-[.98]">Start Your Journey <ArrowRight size={18}/></button>
      <button onClick={() => setLocation('/auth')} className="mt-4 w-full text-center text-[12px] font-medium text-white/85">Already have an account? <span className="font-bold text-[#e4c550]">Sign in</span></button>
    </section>
  </div>;
}
