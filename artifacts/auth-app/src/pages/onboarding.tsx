import * as React from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, GraduationCap, Building2, Globe, Users, ShieldCheck, BarChart3, BriefcaseBusiness, BookOpen, Plane, Award, Bot, FileCheck2, Sparkles, MapPin, MessagesSquare, Rocket, Handshake } from 'lucide-react';

/* ─── Brand header ─────────────────────────────────────────────────── */
function BrandHeader() {
  return (
    <div className="flex flex-col items-center pt-5 pb-1">
      <img
        src="/logo.png"
        alt="Globetrek Overseas"
        className="h-14 w-auto object-contain"
        style={{ maxWidth: 220 }}
      />
      <span className="mt-1 text-[10px] font-semibold tracking-[.09em] text-[#062a53]/70">EDUCATION CONSULTANCY</span>
    </div>
  );
}

/* ─── Slide illustrations ──────────────────────────────────────────── */
function AboutIllustration() {
  return (
    <svg viewBox="0 0 240 140" className="w-full max-w-[260px]" fill="none">
      {/* Background circle */}
      <circle cx="120" cy="70" r="60" fill="#edf8f1" opacity="0.6"/>
      {/* Dotted flight path */}
      <path d="M30 90 Q80 20 160 50 Q200 65 220 45" stroke="#087b41" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.5"/>
      {/* Plane */}
      <g transform="translate(218 42) rotate(-30)">
        <path d="M0 0 L10 -4 L8 0 L10 4 Z" fill="#062a53"/>
        <path d="M5 0 L8 -7 L7 0 L8 7 Z" fill="#062a53" opacity="0.6"/>
      </g>
      {/* People figures */}
      {/* Left person (yellow) */}
      <circle cx="85" cy="68" r="10" fill="#f4c430"/>
      <rect x="78" y="80" width="14" height="22" rx="3" fill="#4a9e6b"/>
      <rect x="75" y="83" width="8" height="14" rx="2" fill="#4a9e6b"/>
      <rect x="91" y="83" width="8" height="14" rx="2" fill="#4a9e6b"/>
      {/* Center person (blue) */}
      <circle cx="120" cy="65" r="11" fill="#7db8d4"/>
      <rect x="113" y="78" width="14" height="24" rx="3" fill="#2563eb" opacity="0.8"/>
      <rect x="109" y="81" width="8" height="15" rx="2" fill="#2563eb" opacity="0.8"/>
      <rect x="123" y="81" width="8" height="15" rx="2" fill="#2563eb" opacity="0.8"/>
      {/* Right person (orange) */}
      <circle cx="155" cy="68" r="10" fill="#f97316"/>
      <rect x="148" y="80" width="14" height="22" rx="3" fill="#d97706" opacity="0.8"/>
      <rect x="145" y="83" width="8" height="14" rx="2" fill="#d97706" opacity="0.8"/>
      <rect x="159" y="83" width="8" height="14" rx="2" fill="#d97706" opacity="0.8"/>
      {/* Rockets */}
      <g transform="translate(52 55)">
        <rect x="0" y="8" width="12" height="24" rx="3" fill="#94a3b8"/>
        <path d="M6 0 L12 8 L0 8 Z" fill="#64748b"/>
        <rect x="2" y="28" width="4" height="6" rx="1" fill="#f97316" opacity="0.7"/>
      </g>
      <g transform="translate(178 58)">
        <rect x="0" y="8" width="12" height="22" rx="3" fill="#94a3b8"/>
        <path d="M6 0 L12 8 L0 8 Z" fill="#64748b"/>
        <rect x="2" y="26" width="4" height="6" rx="1" fill="#f97316" opacity="0.7"/>
      </g>
      {/* Graduation cap */}
      <g transform="translate(112 42)">
        <rect x="0" y="5" width="16" height="3" rx="1" fill="#062a53"/>
        <path d="M8 0 L16 5 L8 10 L0 5 Z" fill="#062a53"/>
        <line x1="14" y1="5" x2="14" y2="12" stroke="#062a53" strokeWidth="1.5"/>
        <circle cx="14" cy="13" r="2" fill="#087b41"/>
      </g>
    </svg>
  );
}

function ServicesIllustration() {
  return (
    <svg viewBox="0 0 240 130" className="w-full max-w-[260px]" fill="none">
      <circle cx="120" cy="65" r="55" fill="#edf8f1" opacity="0.5"/>
      {/* Desk */}
      <rect x="60" y="88" width="120" height="8" rx="2" fill="#94a3b8"/>
      <rect x="68" y="96" width="6" height="20" fill="#94a3b8"/>
      <rect x="166" y="96" width="6" height="20" fill="#94a3b8"/>
      {/* Counsellor (green shirt) */}
      <circle cx="95" cy="60" r="12" fill="#f4c430"/>
      <rect x="83" y="74" width="24" height="20" rx="4" fill="#087b41"/>
      {/* Student (blue shirt) */}
      <circle cx="155" cy="63" r="11" fill="#7db8d4"/>
      <rect x="144" y="76" width="22" height="18" rx="4" fill="#1e40af" opacity="0.8"/>
      {/* Laptop on desk */}
      <rect x="108" y="78" width="24" height="16" rx="2" fill="#e2e8f0"/>
      <rect x="110" y="80" width="20" height="12" rx="1" fill="#3b82f6" opacity="0.6"/>
      <rect x="103" y="94" width="34" height="3" rx="1" fill="#cbd5e1"/>
      {/* Graduation cap flight path */}
      <path d="M40 30 Q80 10 150 25 Q190 35 210 20" stroke="#087b41" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity="0.4"/>
      <g transform="translate(108 15)">
        <rect x="0" y="4" width="14" height="2.5" rx="1" fill="#062a53"/>
        <path d="M7 0 L14 4 L7 8 L0 4 Z" fill="#062a53"/>
      </g>
    </svg>
  );
}

function WhyChooseIllustration() {
  return (
    <svg viewBox="0 0 240 140" className="w-full max-w-[260px]" fill="none">
      <circle cx="120" cy="70" r="58" fill="#fef9e7" opacity="0.6"/>
      {/* Podium */}
      <rect x="70" y="90" width="40" height="35" rx="3" fill="#3b82f6" opacity="0.8"/>
      <rect x="50" y="100" width="36" height="25" rx="3" fill="#94a3b8"/>
      <rect x="110" y="108" width="36" height="17" rx="3" fill="#94a3b8"/>
      {/* Star on 1st place */}
      <path d="M90 70 L93 79 L103 79 L95 85 L98 94 L90 88 L82 94 L85 85 L77 79 L87 79 Z" fill="#f59e0b"/>
      {/* Trophy top */}
      <rect x="84" y="82" width="12" height="8" rx="1" fill="#f59e0b" opacity="0.8"/>
      {/* Medal left */}
      <circle cx="68" cy="94" r="8" fill="#94a3b8" stroke="#6b7280" strokeWidth="1"/>
      <path d="M68 89 L69.5 93 L74 93 L70.5 95.5 L72 100 L68 97 L64 100 L65.5 95.5 L62 93 L66.5 93 Z" fill="white" transform="scale(0.5) translate(68 88)"/>
      {/* Medal right */}
      <circle cx="172" cy="100" r="7" fill="#cd7f32" stroke="#a0522d" strokeWidth="1"/>
      {/* Stars around */}
      <path d="M30 50 L31.5 54 L36 54 L32.5 56.5 L34 61 L30 58 L26 61 L27.5 56.5 L24 54 L28.5 54 Z" fill="#fbbf24" opacity="0.6" transform="scale(0.7) translate(15 20)"/>
      <path d="M190 35 L191.5 39 L196 39 L192.5 41.5 L194 46 L190 43 L186 46 L187.5 41.5 L184 39 L188.5 39 Z" fill="#fbbf24" opacity="0.5" transform="scale(0.8) translate(50 5)"/>
    </svg>
  );
}

function GetStartedIllustration() {
  return (
    <svg viewBox="0 0 240 130" className="w-full max-w-[260px]" fill="none">
      <circle cx="120" cy="65" r="55" fill="#edf8f1" opacity="0.5"/>
      {/* Globe */}
      <circle cx="120" cy="65" r="38" fill="#dbeafe" stroke="#087b41" strokeWidth="1.5"/>
      <ellipse cx="120" cy="65" rx="38" ry="17" stroke="#087b41" strokeWidth="1" fill="none" opacity="0.4"/>
      <ellipse cx="120" cy="65" rx="38" ry="28" stroke="#087b41" strokeWidth="1" fill="none" opacity="0.3"/>
      <line x1="120" y1="27" x2="120" y2="103" stroke="#087b41" strokeWidth="1" opacity="0.4"/>
      <line x1="82" y1="65" x2="158" y2="65" stroke="#087b41" strokeWidth="1" opacity="0.4"/>
      {/* Continents */}
      <path d="M95 52 Q102 47 110 50 Q116 53 112 58 Q107 61 101 58 Z" fill="#087b41" opacity="0.6"/>
      <path d="M122 54 Q129 50 135 54 Q138 58 134 60 Q128 61 122 58 Z" fill="#087b41" opacity="0.5"/>
      <path d="M97 64 Q102 61 108 64 Q110 68 106 70 Q101 70 97 67 Z" fill="#087b41" opacity="0.45"/>
      {/* Orbit line */}
      <ellipse cx="120" cy="65" rx="54" ry="20" stroke="#062a53" strokeWidth="1.2" strokeDasharray="4 2" fill="none" transform="rotate(-15 120 65)" opacity="0.35"/>
      {/* Plane */}
      <g transform="rotate(-15 120 65) translate(173 57)">
        <path d="M0 0 L9 -3.5 L7.5 0 L9 3.5 Z" fill="#062a53"/>
        <path d="M4 0 L7 -6 L6 0 L7 6 Z" fill="#062a53" opacity="0.6"/>
      </g>
      {/* Stars */}
      <circle cx="50" cy="30" r="3" fill="#fbbf24" opacity="0.7"/>
      <circle cx="195" cy="40" r="2.5" fill="#fbbf24" opacity="0.6"/>
      <circle cx="40" cy="95" r="2" fill="#fbbf24" opacity="0.5"/>
      <circle cx="205" cy="95" r="3" fill="#fbbf24" opacity="0.6"/>
    </svg>
  );
}

function AssessmentIllustration() {
  return (
    <svg viewBox="0 0 240 140" className="w-full max-w-[260px]" fill="none" aria-hidden="true">
      <circle cx="120" cy="70" r="60" fill="#e8f5ef" />
      <path d="M33 92Q68 35 114 44T208 35" stroke="#087b41" strokeWidth="1.5" strokeDasharray="4 4" opacity=".45" />
      <rect x="78" y="42" width="84" height="66" rx="22" fill="#f8fcff" stroke="#9fc6df" strokeWidth="2" />
      <rect x="96" y="56" width="48" height="29" rx="12" fill="#062a53" />
      <circle cx="110" cy="70" r="5" fill="#71df9e" />
      <circle cx="130" cy="70" r="5" fill="#71df9e" />
      <path d="M110 78Q120 85 130 78" stroke="#71df9e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M120 42V31" stroke="#062a53" strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="27" r="5" fill="#087b41" />
      <rect x="61" y="65" width="17" height="30" rx="8" fill="#087b41" />
      <rect x="162" y="65" width="17" height="30" rx="8" fill="#087b41" />
      <rect x="45" y="40" width="38" height="28" rx="6" fill="#fff" stroke="#c7d9e8" strokeWidth="1.5" />
      <circle cx="56" cy="51" r="5" fill="#087b41" opacity=".8" />
      <path d="M65 49h10M65 55h7" stroke="#8ca5ba" strokeWidth="2" strokeLinecap="round" />
      <rect x="160" y="39" width="38" height="33" rx="6" fill="#fff" stroke="#c7d9e8" strokeWidth="1.5" />
      <path d="M169 64V54M177 64V47M185 64V43" stroke="#087b41" strokeWidth="4" strokeLinecap="round" />
      <circle cx="184" cy="101" r="16" fill="#fff" stroke="#c7d9e8" strokeWidth="1.5" />
      <path d="m177 101 5 5 9-11" stroke="#087b41" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Slide data ───────────────────────────────────────────────────── */
const slides = [
  {
    id: 'about',
    illustration: <img src="/onboarding/about-students.png" alt="" className="h-[150px] w-full max-w-[270px] object-contain mix-blend-multiply" />,
    title: 'About Us',
    body: 'At GlobeTrek Overseas, we help students achieve their dream of studying abroad through expert guidance, trusted university partnerships and complete admission support.',
    stats: [
      { icon: <GraduationCap size={22} className="text-[#087b41]" />, value: '5000+', label: 'Students Guided' },
      { icon: <Building2 size={22} className="text-[#087b41]" />, value: '250+', label: 'Partner Universities' },
      { icon: <Globe size={22} className="text-[#087b41]" />, value: '25+', label: 'Study Destinations' },
    ],
  },
  {
    id: 'services',
    illustration: <img src="/onboarding/services-counsellor.png" alt="" className="h-[150px] w-full max-w-[270px] object-contain mix-blend-multiply" />,
    title: 'Our Services',
    body: 'From choosing the right university to securing your visa, we provide end-to-end support throughout your study abroad journey.',
    services: [
      { icon: <BriefcaseBusiness size={20} className="text-[#087b41]" />, label: 'Career Counselling' },
      { icon: <Building2 size={20} className="text-[#087b41]" />, label: 'University Selection' },
      { icon: <BookOpen size={20} className="text-[#087b41]" />, label: 'Application Assistance' },
      { icon: <Globe size={20} className="text-[#087b41]" />, label: 'Visa Support' },
      { icon: <Award size={20} className="text-[#087b41]" />, label: 'Scholarship Guidance' },
      { icon: <Plane size={20} className="text-[#087b41]" />, label: 'Pre & Post Arrival Support' },
    ],
  },
  {
    id: 'assessment',
    illustration: <img src="/onboarding/ai-assessment.png" alt="" className="h-[150px] w-full max-w-[270px] object-contain mix-blend-multiply" />,
    title: 'AI-Powered Assessment',
    body: 'Upload your academic details and let our AI match you with suitable countries, universities and courses based on your eligibility.',
    assessment: [
      { icon: <Bot size={19} className="text-[#087b41]" />, label: 'AI Analysis' },
      { icon: <GraduationCap size={19} className="text-[#087b41]" />, label: 'Course Recommendations' },
      { icon: <FileCheck2 size={19} className="text-[#087b41]" />, label: 'Document Check' },
      { icon: <Sparkles size={19} className="text-[#087b41]" />, label: 'Eligibility Score' },
    ],
  },
  {
    id: 'why',
    illustration: <img src="/onboarding/why-achievement.png" alt="" className="h-[150px] w-full max-w-[270px] object-contain mix-blend-multiply" />,
    title: 'Why Choose Us',
    body: 'Experience transparent guidance, expert counsellors, global university partnerships and real-time application tracking — all in one app.',
    reasons: [
      { icon: <Users size={16} className="text-[#087b41]" />, label: 'Experienced Counsellors' },
      { icon: <ShieldCheck size={16} className="text-[#087b41]" />, label: 'High Visa Success Rate' },
      { icon: <Globe size={16} className="text-[#087b41]" />, label: 'Global Network' },
      { icon: <BarChart3 size={16} className="text-[#087b41]" />, label: 'Live Application Tracking' },
    ],
  },
  {
    id: 'start',
    illustration: <img src="/onboarding/get-started.png" alt="" className="h-[150px] w-full max-w-[270px] object-contain mix-blend-multiply" />,
    title: 'Start Your Journey',
    body: 'Create your free account and take the first step towards your dream of studying abroad with personalised guidance.',
    cta: true,
  },
];


function MobileSlideFrame({ children }: { children: React.ReactNode }) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useLayoutEffect(() => {
    const fitContent = () => {
      const contentHeight = contentRef.current?.scrollHeight ?? 0;
      const nextScale = contentHeight
        ? Math.min(1, Math.max(0.42, (window.innerHeight - 28) / contentHeight))
        : 1;
      setScale((currentScale) =>
        Math.abs(currentScale - nextScale) < 0.01 ? currentScale : nextScale,
      );
    };

    const frame = window.requestAnimationFrame(fitContent);
    window.addEventListener('resize', fitContent);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', fitContent);
    };
  }, []);

  const expandedWidth = 100 / scale;

  return (
    <div className='h-[100dvh] w-full overflow-hidden'>
      <div
        ref={contentRef}
        style={{
          transform: 'scale(' + scale + ')',
          transformOrigin: 'top center',
          width: expandedWidth + '%',
          marginLeft: (100 - expandedWidth) / 2 + '%',
        }}
      >
        {children}
      </div>
    </div>
  );
}


function GlobalJourneySplash({ onNext }: { onNext: () => void }) {
  React.useEffect(() => {
    const timer = window.setTimeout(onNext, 3000);
    return () => window.clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#f8fbff]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="relative h-full w-full">
        <img
          src="/onboarding/global-journey-splash.jpeg"
          alt="GTO Connect — Your Global Journey, Our Guidance"
          className="h-full w-full object-cover"
        />
        <div className="gto-splash-status-cleaner" aria-hidden="true" />
        <button
          type="button"
          aria-label="Continue to About Us"
          onClick={onNext}
          className="absolute inset-0 z-10 cursor-pointer"
        />
        <button type="button" onClick={onNext} className="gto-splash-get-started">Get Started</button>
      </motion.div>
    </div>
  );
}

function AboutReferenceSlide({ onNext }: { onNext: () => void }) {
  const stats = [
    { icon: <GraduationCap size={24} />, value: '5000+', lines: ['Students', 'Guided'] },
    { icon: <Building2 size={24} />, value: '250+', lines: ['Partner', 'Universities'] },
    { icon: <Globe size={24} />, value: '25+', lines: ['Study', 'Destinations'] },
  ];
  const features = [
    { icon: <MessagesSquare size={24} />, title: 'Expert Guidance', body: 'Personalized counselling for your success.' },
    { icon: <Handshake size={24} />, title: 'Trusted Partners', body: 'Collaborations with top global universities.' },
    { icon: <Users size={24} />, title: 'End-to-End Support', body: 'From application to visa and beyond.' },
    { icon: <Rocket size={24} />, title: 'Your Success Our Mission', body: 'Committed to building your global future.' },
  ];
  return (
    <MobileSlideFrame>
    <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }} transition={{ duration: 0.28 }} className="w-full">
      <section className="relative overflow-hidden bg-[#fbfdff]">
        <div className="absolute right-[-28px] top-[76px] h-[165px] w-[230px] opacity-60" aria-hidden="true"><div className="h-full w-full rounded-[48%] border border-dashed border-[#9cb5ca]/50" /><div className="absolute left-6 top-7 h-[110px] w-[185px] rounded-[48%] border border-dashed border-[#9cb5ca]/40" /></div>
        <div className="relative px-7 pt-7">
          <img src="/logo.png" alt="GlobeTrek Overseas" className="h-[55px] w-auto object-contain object-left" />
          <p className="mt-1 text-[10px] font-semibold tracking-wide text-[#062a53]/75">Education Consultancy</p>
          <div className="mt-8 max-w-[235px]">
            <h1 className="font-serif text-[29px] font-bold leading-[1.03] text-[#062a53]">Your Dream.<br /><span className="text-[#087b41]">Our Expertise.</span></h1>
            <div className="mt-3 h-[3px] w-10 rounded-full bg-[#087b41]" />
            <p className="mt-4 text-[12px] font-medium leading-[1.55] text-slate-600">Guiding students. Connecting opportunities. Creating global success stories.</p>
          </div>
          <div className="absolute right-8 top-[150px] flex h-8 w-8 items-center justify-center rounded-full bg-[#087b41]/10 text-[#087b41]"><MapPin size={18} /></div>
          <div className="absolute right-16 top-[198px] flex h-8 w-8 items-center justify-center rounded-full bg-[#087b41]/10 text-[#087b41]"><MapPin size={18} /></div>
          <div className="absolute right-[111px] top-[202px] rotate-[25deg] text-[#062a53]" aria-hidden="true"><Plane size={34} fill="currentColor" strokeWidth={1.2} /></div>
        </div>
        <div className="relative mt-5 h-[245px] overflow-hidden">
          <img src="/onboarding/about-study-group.png" alt="Students collaborating at a university" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#062a53]/50 to-transparent" />
          <div className="absolute -bottom-9 left-[-8%] h-24 w-[72%] rounded-[50%] border-t-[7px] border-[#087b41] bg-[#062a53]" />
          <div className="absolute -bottom-9 right-[-12%] h-24 w-[56%] rounded-[50%] border-t-[7px] border-[#087b41] bg-[#062a53]" />
        </div>
      </section>
      <section className="relative mx-4 -mt-7 rounded-[30px] bg-white px-5 pb-5 pt-12 shadow-[0_12px_30px_rgba(11,54,99,.16)]">
        <div className="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-white text-[#087b41] shadow-[0_8px_18px_rgba(11,54,99,.18)]"><Users size={31} /></div>
        <h2 className="text-center text-[29px] font-bold leading-none text-[#062a53]">About <span className="text-[#087b41]">Us</span></h2>
        <p className="mx-auto mt-5 max-w-[305px] text-center text-[13px] font-medium leading-[1.55] text-slate-700">At GlobeTrek Overseas, we help students achieve their dream of studying abroad through expert guidance, trusted university partnerships and complete admission support.</p>
        <div className="mt-6 grid grid-cols-3">{stats.map((stat, index) => <div key={stat.value} className={index ? 'flex flex-col items-center border-l border-slate-200 px-2' : 'flex flex-col items-center px-2'}><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf8f1] text-[#087b41]">{stat.icon}</div><span className="mt-2 text-[23px] font-bold leading-none text-[#087b41]">{stat.value}</span><span className="mt-1 text-center text-[11px] font-semibold leading-[1.25] text-[#062a53]">{stat.lines[0]}<br />{stat.lines[1]}</span></div>)}</div>
      </section>
      <section className="mx-4 mt-4 rounded-[23px] bg-[#062a53] px-2 py-4 shadow-[0_12px_25px_rgba(6,42,83,.24)]"><div className="grid grid-cols-4 divide-x divide-white/20">{features.map(feature => <div key={feature.title} className="flex min-w-0 flex-col items-center px-1.5 text-center"><div className="text-[#6bd26f]">{feature.icon}</div><h3 className="mt-2 text-[10px] font-bold leading-[1.12] text-white">{feature.title}</h3><p className="mt-2 text-[8px] font-medium leading-[1.3] text-white/72">{feature.body}</p></div>)}</div></section>
      <div className="flex justify-center gap-3 py-5">{slides.map((_, index) => <button key={index} type="button" onClick={() => index > 0 && onNext()}><span className={index === 0 ? 'block h-2.5 w-2.5 rounded-full bg-[#087b41]' : 'block h-2.5 w-2.5 rounded-full bg-slate-300'} /></button>)}</div>
      <button onClick={onNext} className="mx-6 mb-7 flex w-[calc(100%-3rem)] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#006d39] via-[#087b41] to-[#006d39] py-3.5 text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(8,123,65,.28)]">Next <ChevronRight size={19} /></button>
      </motion.div>
    </MobileSlideFrame>
  );
}

function ReferenceStyleSlide({
  slide,
  currentIndex,
  onNext,
  onSelect,
  onSkip,
}: {
  slide: (typeof slides)[number];
  currentIndex: number;
  onNext: () => void;
  onSelect: (index: number) => void;
  onSkip: () => void;
}) {
  const slideData = slide as any;
  const metaMap = {
    services: { first: 'Your Future.', second: 'Our Services.', icon: <BriefcaseBusiness size={29} /> },
    assessment: { first: 'Smart Choices.', second: 'AI Assessment.', icon: <Bot size={29} /> },
    why: { first: 'Your Goals.', second: 'Our Commitment.', icon: <Award size={29} /> },
    start: { first: 'Your Dream.', second: 'Starts Here.', icon: <Plane size={29} /> },
  };
  const meta = metaMap[slide.id as keyof typeof metaMap] ?? metaMap.services;
  const defaultItems = [
    { icon: <ShieldCheck size={20} />, label: 'Simple & Secure' },
    { icon: <Sparkles size={20} />, label: 'Personalised Plan' },
    { icon: <Users size={20} />, label: 'Expert Support' },
    { icon: <Globe size={20} />, label: 'Global Opportunities' },
  ];
  const items = slideData.services ?? slideData.assessment ?? slideData.reasons ?? defaultItems;
  const details = items.slice(0, 6);
  const footerItems = items.slice(0, 4);
  const detailGrid = details.length > 4 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <MobileSlideFrame>
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.28 }}
      className="w-full"
    >
      <section className="relative overflow-hidden bg-[#fbfdff]">
        <div className="absolute right-[-26px] top-[67px] h-[170px] w-[235px] opacity-55" aria-hidden="true">
          <div className="h-full w-full rounded-[48%] border border-dashed border-[#9cb5ca]/50" />
          <div className="absolute left-6 top-7 h-[112px] w-[185px] rounded-[48%] border border-dashed border-[#9cb5ca]/40" />
        </div>
        <button type="button" onClick={onSkip} className="absolute right-6 top-6 z-10 text-[12px] font-bold text-[#087b41]">Skip</button>
        <div className="relative px-7 pt-7">
          <img src="/logo.png" alt="GlobeTrek Overseas" className="h-[52px] w-auto object-contain object-left" />
          <p className="mt-1 text-[10px] font-semibold tracking-wide text-[#062a53]/75">Education Consultancy</p>
          <div className="mt-7 max-w-[245px]">
            <h1 className="font-serif text-[27px] font-bold leading-[1.04] text-[#062a53]">{meta.first}<br /><span className="text-[#087b41]">{meta.second}</span></h1>
            <div className="mt-3 h-[3px] w-10 rounded-full bg-[#087b41]" />
            <p className="mt-3 text-[11px] font-medium leading-[1.55] text-slate-600">Everything you need to confidently move closer to your international education goal.</p>
          </div>
          <div className="absolute right-8 top-[145px] flex h-8 w-8 items-center justify-center rounded-full bg-[#087b41]/10 text-[#087b41]"><MapPin size={18} /></div>
          <div className="absolute right-16 top-[193px] flex h-8 w-8 items-center justify-center rounded-full bg-[#087b41]/10 text-[#087b41]"><MapPin size={18} /></div>
          <div className="absolute right-[111px] top-[196px] rotate-[25deg] text-[#062a53]" aria-hidden="true"><Plane size={31} fill="currentColor" strokeWidth={1.2} /></div>
        </div>
        <div className="relative mt-4 h-[198px] overflow-hidden bg-slate-100">
          <div className="flex h-full w-full items-center justify-center [&>img]:!h-full [&>img]:!max-w-none [&>img]:!w-full [&>img]:object-cover [&>img]:mix-blend-normal">{slide.illustration}</div>
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#062a53]/55 to-transparent" />
          <div className="absolute -bottom-10 left-[-8%] h-24 w-[72%] rounded-[50%] border-t-[7px] border-[#087b41] bg-[#062a53]" />
          <div className="absolute -bottom-10 right-[-12%] h-24 w-[56%] rounded-[50%] border-t-[7px] border-[#087b41] bg-[#062a53]" />
        </div>
      </section>

      <section className="relative mx-4 -mt-7 rounded-[30px] bg-white px-5 pb-5 pt-12 shadow-[0_12px_30px_rgba(11,54,99,.16)]">
        <div className="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-white text-[#087b41] shadow-[0_8px_18px_rgba(11,54,99,.18)]">{meta.icon}</div>
        <h2 className="text-center font-serif text-[27px] font-bold leading-none text-[#062a53]">{slide.title}</h2>
        <div className="mx-auto mt-3 h-[3px] w-9 rounded-full bg-[#087b41]" />
        <p className="mx-auto mt-3 max-w-[310px] text-center text-[12px] font-medium leading-[1.5] text-slate-700">{slide.body}</p>
        <div className={"mt-5 grid gap-2 " + detailGrid}>
          {details.map((item: { icon: React.ReactNode; label: string }) => (
            <div key={item.label} className="flex min-h-[62px] flex-col items-center justify-center rounded-2xl bg-[#edf8f1]/80 px-1.5 py-2 text-center">
              <div className="text-[#087b41]">{item.icon}</div>
              <span className="mt-1 text-[9px] font-bold leading-[1.15] text-[#062a53]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 mt-4 rounded-[23px] bg-[#062a53] px-2 py-3.5 shadow-[0_12px_25px_rgba(6,42,83,.24)]">
        <div className="grid grid-cols-4 divide-x divide-white/20">
          {footerItems.map((item: { icon: React.ReactNode; label: string }) => (
            <div key={item.label} className="flex min-w-0 flex-col items-center px-1.5 text-center">
              <div className="text-[#6bd26f]">{item.icon}</div>
              <h3 className="mt-1.5 text-[9px] font-bold leading-[1.15] text-white">{item.label}</h3>
              <p className="mt-1.5 text-[8px] font-medium leading-[1.25] text-white/72">Guidance built around your success.</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center gap-3 py-4">
        {slides.map((_, index) => (
          <button key={index} type="button" onClick={() => onSelect(index)} aria-label={"Go to slide " + (index + 1)}>
            <span className={index === currentIndex ? 'block h-2.5 w-2.5 rounded-full bg-[#087b41]' : 'block h-2.5 w-2.5 rounded-full bg-slate-300'} />
          </button>
        ))}
      </div>
      <button onClick={onNext} className="mx-6 mb-7 flex w-[calc(100%-3rem)] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#006d39] via-[#087b41] to-[#006d39] py-3.5 text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(8,123,65,.28)]">
        {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'} <ChevronRight size={19} />
      </button>
      </motion.div>
    </MobileSlideFrame>
  );
}

export default function OnboardingPage() {
  const [current, setCurrent] = React.useState(-1);
  const [, setLocation] = useLocation();
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const next = () => {
    if (isLast) setLocation('/auth');
    else setCurrent(c => c + 1);
  };

  const skip = () => setLocation('/auth');

  return (
    <div className="gto-auth-shell gto-onboarding-shell h-[100dvh] min-h-0 w-full max-w-[430px] mx-auto flex flex-col items-center justify-start overflow-hidden">
      <div className="h-[100dvh] min-h-0 w-full max-w-none flex flex-col relative overflow-hidden">

        <AnimatePresence mode="wait">
          {current === -1 ? (
            <GlobalJourneySplash onNext={next} />
          ) : current === 0 ? (
            <AboutReferenceSlide onNext={next} />
          ) : (
            <ReferenceStyleSlide slide={slide} currentIndex={current} onNext={next} onSelect={setCurrent} onSkip={skip} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
