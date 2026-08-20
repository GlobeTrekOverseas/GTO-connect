import * as React from 'react';
import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  FileText,
  FolderOpen,
  GraduationCap,
  Headphones,
  Landmark,
  MessageCircle,
  MoreHorizontal,
  Plane,
  Search,
  SlidersHorizontal,
  UsersRound,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tab } from '../home';

interface Props {
  name: string;
  setTab: (tab: Tab) => void;
  onVisaTracker: () => void;
  onMockTests: () => void;
}

type Service = {
  label: string;
  icon: React.ReactNode;
  tone: string;
  action: 'universities' | 'applications' | 'chat' | 'visa' | 'mock' | 'more';
};

const SERVICES: Service[] = [
  { label: 'Universities', icon: <Landmark size={22} />, tone: 'text-[#087b41] bg-[#e8f6ed]', action: 'universities' },
  { label: 'Courses', icon: <BookOpen size={22} />, tone: 'text-[#1e59c8] bg-[#eaf0ff]', action: 'universities' },
  { label: 'Scholarships', icon: <GraduationCap size={22} />, tone: 'text-[#218553] bg-[#eaf6ef]', action: 'universities' },
  { label: 'IELTS / PTE', icon: <Headphones size={22} />, tone: 'text-[#245bc0] bg-[#edf1ff]', action: 'mock' },
  { label: 'Visa Guide', icon: <FileText size={22} />, tone: 'text-[#087b41] bg-[#e8f6ed]', action: 'visa' },
  { label: 'Intakes', icon: <CalendarDays size={22} />, tone: 'text-[#245bc0] bg-[#edf1ff]', action: 'applications' },
  { label: 'Counseling', icon: <UsersRound size={22} />, tone: 'text-[#087b41] bg-[#e8f6ed]', action: 'chat' },
  { label: 'Documents', icon: <FolderOpen size={22} />, tone: 'text-[#1e59c8] bg-[#edf1ff]', action: 'applications' },
  { label: 'Application\nTracker', icon: <FileText size={22} />, tone: 'text-[#087b41] bg-[#e8f6ed]', action: 'applications' },
  { label: 'More', icon: <MoreHorizontal size={22} />, tone: 'text-[#684ee7] bg-[#f0edff]', action: 'more' },
];

const DESTINATIONS = [
  { flag: 'https://flagcdn.com/w80/gb.png', label: 'UK', students: '192 Students' },
  { flag: 'https://flagcdn.com/w80/ca.png', label: 'Canada', students: '356 Students' },
  { flag: 'https://flagcdn.com/w80/au.png', label: 'Australia', students: '278 Students' },
  { flag: 'https://flagcdn.com/w80/us.png', label: 'USA', students: '145 Students' },
  { flag: 'https://flagcdn.com/w80/eu.png', label: 'Europe', students: '98 Students' },
];

const INTAKES = [
  { month: 'Sep 2024', left: '30 Days Left' },
  { month: 'Jan 2025', left: '122 Days Left' },
  { month: 'May 2025', left: '242 Days Left' },
];

function SectionTitle({ title, action }: { title: string; action?: () => void }) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <h2 className="text-[13px] font-extrabold tracking-[-0.02em] text-[#102e55]">{title}</h2>
      {action && (
        <button type="button" onClick={action} className="text-[10px] font-bold text-[#087b41]">
          View All
        </button>
      )}
    </div>
  );
}

export default function HomeTab({ name, setTab, onVisaTracker, onMockTests }: Props) {
  const [search, setSearch] = React.useState('');
  const firstName = name || 'Ananya';

  const useService = (service: Service) => {
    if (service.action === 'universities') setTab('universities');
    else if (service.action === 'applications') setTab('applications');
    else if (service.action === 'chat') setTab('chat');
    else if (service.action === 'visa') onVisaTracker();
    else if (service.action === 'mock') onMockTests();
    else toast.info('More GTO Connect services are on their way.');
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f4f6f5]">
      <header className="relative shrink-0 overflow-hidden bg-[radial-gradient(circle_at_92%_0%,#155485_0,transparent_28%),linear-gradient(138deg,#021a3b,#063763)] px-5 pb-5 pt-7 text-white">
        <div aria-hidden="true" className="absolute inset-x-[15%] top-1 h-36 opacity-[.14] [background-image:radial-gradient(#b9d5ec_1px,transparent_1px)] [background-size:5px_5px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <Plane aria-hidden="true" className="absolute left-[56%] top-12 rotate-[21deg] text-white/55" size={25} />
        <div aria-hidden="true" className="absolute left-[37%] top-[73px] h-px w-[29%] rotate-[-27deg] border-t border-dashed border-white/45" />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center leading-none">
              <span className="text-[31px] font-black tracking-[-0.12em]">GTO</span>
              <span className="ml-1 grid h-5 w-5 place-items-center rounded-full border border-[#6bdd9b] text-[10px] text-[#6bdd9b]">✦</span>
            </div>
            <span className="block pl-0.5 text-[10px] font-extrabold tracking-[0.34em] text-[#48c572]">CONNECT</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button type="button" aria-label="Notifications" onClick={() => toast.info('You are all caught up!')} className="relative grid h-9 w-9 place-items-center rounded-full bg-white/10">
              <Bell size={20} />
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#1baf57] px-1 text-[8px] font-bold">3</span>
            </button>
            <button type="button" aria-label="Open profile" onClick={() => setTab('profile')} className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#55c77c] bg-[#f3c6b1] text-[15px] font-extrabold text-[#163757] shadow-sm">
              {firstName.slice(0, 1).toUpperCase()}
            </button>
          </div>
        </div>

        <div className="relative mt-4">
          <p className="text-[12px] font-medium text-white/80">Welcome back,</p>
          <h1 className="mt-0.5 text-[28px] font-extrabold leading-none tracking-[-0.05em]">{firstName} <span className="text-[23px]">👋</span></h1>
          <p className="mt-2 text-[11px] text-[#c8dcdf]">Let's make your study abroad dream a reality!</p>
        </div>

        <form onSubmit={(event) => { event.preventDefault(); setTab('universities'); }} className="relative mt-5 flex h-14 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_10px_24px_rgba(0,10,31,.22)]">
          <Search size={22} className="shrink-0 text-[#11385d]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search universities, courses, scholarships..." className="min-w-0 flex-1 bg-transparent text-[12px] text-[#163757] outline-none placeholder:text-slate-400" />
          <button type="submit" aria-label="Open university search" className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[#11385d]">
            <SlidersHorizontal size={20} />
          </button>
        </form>
      </header>

      <main className="gto-home-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-7 pt-3">
        <button type="button" onClick={() => setTab('universities')} className="relative block h-[202px] w-full overflow-hidden rounded-[22px] bg-[#042650] text-left shadow-[0_8px_18px_rgba(6,42,83,.16)]">
          <img src="/onboarding/about-students.png" alt="Students exploring study abroad" className="absolute inset-0 h-full w-full object-cover object-[68%_46%] opacity-90" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,31,65,.96)_0%,rgba(3,31,65,.83)_42%,rgba(3,31,65,.06)_88%)]" />
          <div className="relative flex h-full flex-col justify-between p-4 text-white">
            <div>
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#0b8a43] px-2 py-1 text-[9px] font-bold">Where Dreams Take Flight <Plane size={11} /></span>
              <h2 className="mt-4 text-[24px] font-extrabold leading-[1.03] tracking-[-0.04em]">Study in<br /><span className="text-[#28c55c]">Top Ranked</span><br />Universities</h2>
              <p className="mt-2 text-[12px] font-medium text-white/90">Apply for Sep 2024 Intake</p>
            </div>
            <div className="flex items-end justify-between">
              <span className="inline-flex items-center gap-2 rounded-xl bg-[#0a9847] px-4 py-2.5 text-[12px] font-bold">Explore Now <ChevronRight size={16} /></span>
              <span className="flex gap-1.5 pb-1 pr-1"><i className="h-2 w-2 rounded-full bg-[#18b651]" /><i className="h-2 w-2 rounded-full bg-white" /><i className="h-2 w-2 rounded-full bg-white" /><i className="h-2 w-2 rounded-full bg-white" /></span>
            </div>
          </div>
        </button>

        <section className="mt-3 overflow-hidden rounded-2xl bg-white py-3 shadow-[0_3px_10px_rgba(6,42,83,.08)]">
          <div className="grid grid-cols-4 divide-x divide-slate-100">
            {[
              ['1,248', 'Applications', <FileText size={19} />],
              ['856', 'Active Students', <GraduationCap size={19} />],
              ['125', 'Partner Universities', <Landmark size={19} />],
              ['94.6%', 'Visa Success Rate', <BookOpen size={19} />],
            ].map(([value, label, icon], index) => (
              <div key={String(label)} className="min-w-0 px-2 text-center">
                <span className={`mx-auto grid h-8 w-8 place-items-center rounded-lg ${index % 2 === 0 ? 'bg-[#e8f6ed] text-[#087b41]' : 'bg-[#edf1ff] text-[#164aa2]'}`}>{icon}</span>
                <strong className="mt-1.5 block text-[15px] leading-none tracking-[-0.04em] text-[#15365c]">{value}</strong>
                <span className="mt-1 block text-[8px] font-semibold leading-tight text-slate-500">{label}</span>
                <span className="mt-1 block text-[7px] text-[#1b9954]">↑ {index === 0 ? '18.5' : index === 1 ? '12.4' : index === 2 ? '8.7' : '6.3'}% this month</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-3 rounded-2xl bg-white p-3 shadow-[0_3px_10px_rgba(6,42,83,.07)]">
          <div className="grid grid-cols-5 gap-y-4">
            {SERVICES.map((service) => (
              <button key={service.label} type="button" onClick={() => useService(service)} className="flex min-w-0 flex-col items-center gap-1.5 px-0.5 active:scale-95">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${service.tone}`}>{service.icon}</span>
                <span className="whitespace-pre-line text-center text-[8.5px] font-bold leading-[1.15] text-[#1b3559]">{service.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <section className="min-w-0 rounded-2xl bg-white p-3 shadow-[0_3px_10px_rgba(6,42,83,.07)]">
            <SectionTitle title="Popular Destinations" action={() => setTab('universities')} />
            <div className="flex justify-between gap-1">
              {DESTINATIONS.map((destination) => (
                <button key={destination.label} type="button" onClick={() => setTab('universities')} className="min-w-0 text-center">
                  <img src={destination.flag} alt={`${destination.label} flag`} className="mx-auto h-[19px] w-[28px] rounded-[5px] object-cover shadow-sm" />
                  <span className="mt-1 block text-[8px] font-extrabold text-[#18365b]">{destination.label}</span>
                  <span className="mt-0.5 block truncate text-[6px] text-slate-400">{destination.students}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="min-w-0 rounded-2xl bg-white p-3 shadow-[0_3px_10px_rgba(6,42,83,.07)]">
            <SectionTitle title="Upcoming Intakes" action={() => setTab('applications')} />
            <div className="grid grid-cols-3 gap-1.5">
              {INTAKES.map((intake) => (
                <button key={intake.month} type="button" onClick={() => setTab('applications')} className="rounded-lg border border-slate-100 p-1.5 text-left">
                  <CalendarDays size={15} className="mb-1 text-[#0a9647]" />
                  <strong className="block whitespace-nowrap text-[7px] text-[#18365b]">{intake.month}</strong>
                  <span className="mt-0.5 block text-[6px] font-bold text-[#118e46]">Apply Now</span>
                  <span className="mt-2 block whitespace-nowrap text-[6px] text-slate-400">{intake.left}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setTab('chat')} className="relative min-h-[150px] overflow-hidden rounded-2xl bg-[#062c57] p-4 text-left shadow-[0_5px_12px_rgba(6,42,83,.17)]">
            <img src="/onboarding/about-students.png" alt="" aria-hidden="true" className="absolute -right-12 bottom-0 h-[120px] w-[180px] max-w-none object-cover object-[57%_48%] opacity-75 mix-blend-screen" />
            <div className="relative max-w-[138px] text-white">
              <span className="text-[9px] text-[#d7e6ee]">Get Expert Guidance</span>
              <h2 className="mt-1 text-[15px] font-bold leading-snug">Connect with our counselors and take the right step towards your future.</h2>
              <span className="mt-3 inline-flex rounded-lg bg-[#0b9d49] px-3 py-2 text-[9px] font-bold">Book a Free Session</span>
            </div>
          </button>
          <section className="rounded-2xl bg-white p-3 shadow-[0_3px_10px_rgba(6,42,83,.07)]">
            <SectionTitle title="Recent Updates" action={() => setTab('applications')} />
            <button type="button" onClick={() => setTab('applications')} className="flex gap-2 text-left">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#e8f6ed] text-[#0b9648]"><MessageCircle size={16} /></span>
              <span><strong className="block text-[8px] leading-[1.35] text-[#17385e]">University of Toronto Application Deadline Extended</strong><small className="mt-1 block text-[7px] text-slate-400">New deadline: 30 June 2024<br />2h ago</small></span>
            </button>
            <button type="button" onClick={onVisaTracker} className="mt-3 flex gap-2 text-left">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#edf1ff] text-[#245bc0]"><FileText size={16} /></span>
              <span><strong className="block text-[8px] leading-[1.35] text-[#17385e]">Australia Student Visa Changes for 2024</strong><small className="mt-1 block text-[7px] text-slate-400">Important updates for applicants<br />5h ago</small></span>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
