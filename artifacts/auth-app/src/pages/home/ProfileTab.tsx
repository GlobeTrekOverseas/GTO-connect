import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, LogOut, Building2, FolderOpen,
  CalendarCheck, Bell, Gift, Settings, HelpCircle,
  X, Check, Phone, Mail, Edit2, Lock, BellOff,
  ChevronDown, ChevronUp, Trash2, BookOpen,
  ArrowLeft, ShieldCheck, UserRound, FileText, Activity, SlidersHorizontal,
  GraduationCap, Landmark, TrendingUp, Globe2, ClipboardList, Medal,
  Plane, Camera, CircleCheck, MessageCircle, Sparkles,
} from 'lucide-react';
import { useGetMe, useLogout } from '@workspace/api-client-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { UNIVERSITIES, F, type University } from './data';
import type { Tab } from '../home';

type Sheet = 'saved' | 'appointments' | 'notifications' | 'refer' | 'settings' | 'help' | null;

const MENU = [
  { icon: <Building2 size={18} className="text-[#087b41]" />,  label: 'Saved Universities', bg: '#edf8f1',  action: 'saved' },
  { icon: <FolderOpen size={18} className="text-[#1e40af]" />, label: 'My Applications',    bg: '#eff6ff',  action: 'applications' },
  { icon: <CalendarCheck size={18} className="text-[#d97706]" />, label: 'My Appointments', bg: '#fef3c7', action: 'appointments' },
  { icon: <Bell size={18} className="text-[#7c3aed]" />,       label: 'Notifications',     bg: '#f5f3ff',  action: 'notifications' },
  { icon: <Gift size={18} className="text-[#e11d48]" />,       label: 'Refer & Earn',      bg: '#fff1f2',  action: 'refer' },
  { icon: <Settings size={18} className="text-[#0e7490]" />,   label: 'Settings',          bg: '#ecfeff',  action: 'settings' },
  { icon: <HelpCircle size={18} className="text-[#64748b]" />, label: 'Help & Support',    bg: '#f8fafc',  action: 'help' },
];

/* ── Bottom Sheet Wrapper ─────────────────────────────────────── */
function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[85dvh] flex flex-col"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><X size={15} className="text-slate-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Saved Universities Sheet ────────────────────────────────── */
function SavedUniversitiesSheet({ open, onClose, universities, onRemove, onBrowse }: {
  open: boolean;
  onClose: () => void;
  universities: University[];
  onRemove: (id: number) => void;
  onBrowse: () => void;
}) {
  return (
    <Sheet open={open} onClose={onClose} title="Saved Universities">
      <div className="px-5 py-4 flex flex-col gap-3">
        {universities.length === 0 ? (
          <div className="py-10 text-center">
            <Building2 size={34} className="mx-auto text-[#087b41] mb-3" />
            <p className="text-[14px] font-bold text-slate-800">No saved universities yet</p>
            <p className="text-[12px] text-slate-500 mt-1">Tap the heart on any university to add it here.</p>
            <button onClick={onBrowse} className="mt-5 px-5 py-3 rounded-xl bg-[#087b41] text-white text-[13px] font-bold">Browse Universities</button>
          </div>
        ) : (
          <>
            <p className="text-[12px] text-slate-500">{universities.length} {universities.length === 1 ? 'university' : 'universities'} saved to your shortlist</p>
            {universities.map((university) => (
              <div key={university.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#edf8f1] grid place-items-center">
                  {university.image ? <img src={university.image} alt="" className="w-full h-full object-cover" /> : <Building2 size={20} className="text-[#087b41]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-slate-900 leading-tight">{university.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <img src={F(university.countryCode)} alt={university.country} className="w-4 h-2.5 object-cover rounded-sm" />
                    <span className="text-[11px] text-slate-500">{university.country}</span>
                    <span className="text-[10px] text-[#087b41] font-bold">{university.rank}</span>
                  </div>
                </div>
                <button onClick={() => { onRemove(university.id); toast.success('Removed from saved universities'); }} aria-label={"Remove " + university.name} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                  <Trash2 size={15} className="text-red-500" />
                </button>
              </div>
            ))}
            <button onClick={onBrowse} className="mt-2 w-full py-3.5 rounded-2xl bg-[#062a53] text-white text-[13px] font-bold">Browse More Universities</button>
          </>
        )}
      </div>
    </Sheet>
  );
}
/* ── Appointments Sheet ───────────────────────────────────────── */
function AppointmentsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="My Appointments">
      <div className="px-5 py-4 flex flex-col gap-4">
        {[
          { type: 'Counselling Session', counsellor: 'Priya Sharma', date: 'Wed, 14 Aug 2026', time: '11:00 AM', status: 'Upcoming' },
          { type: 'Document Review',     counsellor: 'Rahul Verma',  date: 'Fri, 16 Aug 2026', time: '2:30 PM',  status: 'Upcoming' },
        ].map(a => (
          <div key={a.type} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-start">
              <p className="text-[13px] font-bold text-slate-900">{a.type}</p>
              <span className="text-[10px] font-bold bg-[#edf8f1] text-[#087b41] px-2 py-0.5 rounded-full">{a.status}</span>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">{a.counsellor}</p>
            <div className="flex gap-3 mt-2">
              <span className="text-[11px] text-slate-600">📅 {a.date}</span>
              <span className="text-[11px] text-slate-600">⏰ {a.time}</span>
            </div>
          </div>
        ))}
        <button className="w-full py-3.5 bg-[#087b41] text-white rounded-2xl text-[13px] font-bold">
          + Book New Appointment
        </button>
      </div>
    </Sheet>
  );
}

/* ── Notifications Sheet ──────────────────────────────────────── */
function NotificationsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Notifications">
      <div className="px-5 py-4 flex flex-col gap-3">
        {[
          { icon: '🎓', title: 'University of Toronto accepted your shortlist', time: '2 hrs ago', unread: true },
          { icon: '📋', title: 'Your documents are 75% complete. Upload IELTS report.', time: 'Yesterday', unread: true },
          { icon: '📅', title: 'Reminder: Sep 2024 intake deadline is in 10 days', time: '2 days ago', unread: false },
          { icon: '🎉', title: 'Congratulations! Your application is under review.', time: '3 days ago', unread: false },
        ].map((n, i) => (
          <div key={i} className={`flex gap-3 p-3.5 rounded-2xl ${n.unread ? 'bg-[#edf8f1]' : 'bg-slate-50'}`}>
            <span className="text-xl flex-shrink-0 mt-0.5">{n.icon}</span>
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-slate-800 leading-snug">{n.title}</p>
              <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full bg-[#087b41] flex-shrink-0 mt-1" />}
          </div>
        ))}
      </div>
    </Sheet>
  );
}

/* ── Refer & Earn Sheet ───────────────────────────────────────── */
function ReferEarnSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = React.useState(false);
  const code = 'GTO2026REF';
  return (
    <Sheet open={open} onClose={onClose} title="Refer & Earn">
      <div className="px-5 py-4 flex flex-col gap-5">
        <div className="bg-[#062a53] rounded-2xl p-5 text-center">
          <p className="text-3xl">🎁</p>
          <p className="text-[16px] font-bold text-white mt-2">Earn ₹2,000 per Referral</p>
          <p className="text-[12px] text-[#a7d4b8] mt-1">For every friend who signs up and enrols</p>
        </div>
        <div>
          <p className="text-[12px] text-slate-500 mb-2">Your referral code</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-100 rounded-2xl px-4 py-3">
              <span className="text-[15px] font-bold text-slate-800 tracking-widest">{code}</span>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); toast.success('Code copied!'); }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${copied ? 'bg-[#087b41]' : 'bg-slate-200'}`}
            >
              {copied ? <Check size={18} className="text-white" /> : <BookOpen size={18} className="text-slate-600" />}
            </button>
          </div>
        </div>
        <button className="w-full py-3.5 bg-[#087b41] text-white rounded-2xl text-[13px] font-bold">Share Referral Link</button>
      </div>
    </Sheet>
  );
}

/* ── Settings Sheet ───────────────────────────────────────────── */
function SettingsSheet({ open, onClose, name, email }: { open: boolean; onClose: () => void; name: string; email: string }) {
  const [editName, setEditName] = React.useState(name);
  return (
    <Sheet open={open} onClose={onClose} title="Settings">
      <div className="px-5 py-4 flex flex-col gap-4">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Profile</p>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
              <Edit2 size={15} className="text-slate-400" />
              <input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 bg-transparent text-[13px] text-slate-800 outline-none" />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
              <Mail size={15} className="text-slate-400" />
              <span className="text-[13px] text-slate-500">{email}</span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Preferences</p>
          {[
            { icon: <BellOff size={15} />, label: 'Push Notifications', val: true },
            { icon: <Lock size={15} />,    label: 'Two-Factor Auth',     val: false },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-600">{s.icon}<span className="text-[13px]">{s.label}</span></div>
              <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${s.val ? 'bg-[#087b41]' : 'bg-slate-200'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${s.val ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => { toast.success('Settings saved'); onClose(); }} className="w-full py-3.5 bg-[#087b41] text-white rounded-2xl text-[13px] font-bold">Save Changes</button>
      </div>
    </Sheet>
  );
}

/* ── Help Sheet ───────────────────────────────────────────────── */
function HelpSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const faqs = [
    { q: 'How do I apply to a university?', a: 'Go to the Universities tab, find your target university, tap the heart to shortlist it, then tap Apply Now.' },
    { q: 'What documents do I need?', a: 'Passport, 10th & 12th Marksheets, Bachelor\'s Degree, IELTS/PTE score, SOP, LOR, and bank statements.' },
    { q: 'How long does visa processing take?', a: 'Typically 4–8 weeks after receiving your Offer Letter. Start early to avoid delays.' },
    { q: 'Can I change my selected countries?', a: 'Yes! Contact your counsellor via the Chat tab to update your preferred study destinations.' },
    { q: 'Are scholarships available?', a: 'Yes, most universities offer merit and need-based scholarships. Check the Scholarship section in each university profile.' },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="Help & Support">
      <div className="px-5 py-4 flex flex-col gap-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-slate-50 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between px-4 py-3.5" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <span className="text-[13px] font-semibold text-slate-800 text-left">{f.q}</span>
              {openIdx === i ? <ChevronUp size={14} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />}
            </button>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <p className="px-4 pb-4 text-[12px] text-slate-500 leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <div className="bg-[#edf8f1] rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">💬</span>
          <div>
            <p className="text-[13px] font-bold text-[#1a5c35]">Still need help?</p>
            <p className="text-[11px] text-[#087b41] mt-0.5">Chat with our counsellors — available Mon–Sat, 9 AM–7 PM IST.</p>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ── Profile Dashboard ────────────────────────────────────────── */
function ProfileDashboard({
  name, email, mobile, savedCount, setTab, setSheet, setLocation, onLogout,
}: {
  name: string;
  email: string;
  mobile: string;
  savedCount: number;
  setTab: (tab: Tab) => void;
  setSheet: (sheet: Sheet) => void;
  setLocation: (location: string) => void;
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'applications' | 'documents' | 'activity' | 'preferences'>('overview');
  const [expandedApplication, setExpandedApplication] = React.useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = React.useState('');
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=88';

  const openSection = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  const academicDetails = [
    { icon: <BookOpen size={16} />, label: 'Highest Qualification', value: 'Bachelor of Commerce' },
    { icon: <Landmark size={16} />, label: 'University', value: 'Delhi University' },
    { icon: <CalendarCheck size={16} />, label: 'Graduation Year', value: '2024' },
    { icon: <TrendingUp size={16} />, label: 'Percentage / CGPA', value: '78.5%' },
  ];
  const preferences = [
    { icon: <Globe2 size={20} />, label: 'Preferred Countries', value: 'Canada, UK, Australia', sub: '+2 More' },
    { icon: <Landmark size={20} />, label: 'Preferred Universities', value: `${Math.max(savedCount, 5)}`, sub: 'Shortlisted' },
    { icon: <BookOpen size={20} />, label: 'Interested Courses', value: 'MBA, MIM, Data Science', sub: '+1 More' },
    { icon: <CalendarCheck size={20} />, label: 'Intake', value: 'Fall 2025, Spring 2026', sub: '' },
  ];
  const summary = [
    { icon: <FileText size={19} />, label: 'Applications', value: '3', tag: 'In Progress', tone: 'bg-blue-50 text-blue-700' },
    { icon: <Mail size={19} />, label: 'Offers Received', value: '2', tag: 'View Offers', tone: 'bg-emerald-50 text-emerald-700' },
    { icon: <ClipboardList size={19} />, label: 'Visa Applications', value: '1', tag: 'In Progress', tone: 'bg-blue-50 text-blue-700' },
    { icon: <Medal size={19} />, label: 'Scholarships', value: '1', tag: 'Applied', tone: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f2f5f7] text-slate-900">
      <header className="relative shrink-0 overflow-hidden bg-[#031f43] px-5 pb-5 pt-4 text-white">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_72%_24%,rgba(42,211,119,.22),transparent_30%),radial-gradient(circle_at_84%_48%,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:auto,6px_6px]" />
        <div className="relative flex items-center justify-between">
          <button onClick={() => setTab('home')} aria-label="Back to home" className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><ArrowLeft size={20} /></button>
          <h1 className="text-[17px] font-bold tracking-tight">Student Profile</h1>
          <button onClick={() => setSheet('notifications')} aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-full bg-white/10"><Bell size={19} /><span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#0d9f4a] text-[9px] font-bold">4</span></button>
        </div>
        <div className="relative mt-4 flex items-start gap-3.5">
          <div className="relative shrink-0">
            <div className="h-[86px] w-[86px] overflow-hidden rounded-full border-[3px] border-[#31bf69] bg-white p-1 shadow-xl"><img src={avatarUrl} alt={name} className="h-full w-full rounded-full object-cover" /></div>
            <button onClick={() => setSheet('settings')} aria-label="Change profile photo" className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-[#031f43] bg-[#0d9f4a] text-white"><Camera size={15} /></button>
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-center gap-1.5"><h2 className="truncate text-[18px] font-extrabold">{name}</h2><CircleCheck size={18} className="shrink-0 fill-[#11a84f] text-white" /></div>
            <span className="mt-1 inline-flex rounded-md bg-[#138a48] px-2 py-1 text-[10px] font-bold tracking-wide">GTO123456</span>
            <div className="mt-2 space-y-1.5 text-[11px] text-white/75"><p className="flex items-center gap-2 truncate"><Mail size={14} className="shrink-0" />{email}</p><p className="flex items-center gap-2"><Phone size={14} className="shrink-0" />+91 {mobile}</p><p className="flex items-center gap-2"><Globe2 size={14} className="shrink-0" />New Delhi, India</p></div>
          </div>
          <div className="mt-1 hidden min-[360px]:block w-[108px] rounded-xl border border-white/15 bg-white/[.07] p-2.5"><p className="text-[9px] text-white/65">Profile Status</p><p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#37d875]"><ShieldCheck size={14} />Verified</p><div className="my-2 h-px bg-white/15" /><p className="text-[9px] text-white/65">Account Strength</p><p className="mt-1 text-[11px] font-bold text-[#37d875]">Excellent</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full w-full rounded-full bg-[#32c968]" /></div></div>
        </div>
        <button onClick={() => setSheet('settings')} className="relative mt-4 w-full rounded-lg bg-[#0e9b49] py-2.5 text-[12px] font-bold shadow-lg shadow-black/20">Edit Profile</button>
      </header>

      <nav className="shrink-0 overflow-x-auto border-b border-slate-200 bg-white px-2 py-2 [scrollbar-width:none]"><div className="flex min-w-max items-center gap-1">{[
        { id: 'overview' as const, label: 'Overview', icon: <UserRound size={16} /> }, { id: 'applications' as const, label: 'Applications', icon: <FileText size={16} /> }, { id: 'documents' as const, label: 'Documents', icon: <FolderOpen size={16} /> }, { id: 'activity' as const, label: 'Activity', icon: <Activity size={16} /> }, { id: 'preferences' as const, label: 'Preferences', icon: <SlidersHorizontal size={16} /> },
      ].map(item => <button key={item.id} onClick={() => openSection(item.id)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold transition-colors ${activeTab === item.id ? 'bg-[#0d9f4a] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>{item.icon}{item.label}</button>)}</div></nav>

      <main className="flex-1 overflow-y-auto px-3 pb-6 pt-3 [scrollbar-width:none]">
        {activeTab === 'overview' && <>
        <div className="grid grid-cols-[1.55fr_1fr] gap-3">
          <section className="rounded-2xl bg-white p-3.5 shadow-[0_5px_18px_rgba(15,23,42,.07)]"><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2 text-[#082d57]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf8ef] text-[#0d9f4a]"><GraduationCap size={17} /></span><h3 className="text-[13px] font-extrabold">Academic Information</h3></div><button onClick={() => setSheet('settings')} className="text-[10px] font-bold text-[#0d9f4a]">View All</button></div><div className="mt-3 space-y-3">{academicDetails.map(detail => <div key={detail.label} className="flex gap-2.5"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#f0f8f3] text-[#0d9f4a]">{detail.icon}</span><div className="min-w-0"><p className="text-[9px] font-medium text-slate-400">{detail.label}</p><p className="mt-0.5 text-[11px] font-bold leading-tight text-slate-700">{detail.value}</p></div></div>)}</div></section>
          <section className="flex flex-col items-center rounded-2xl bg-[#042755] p-3 text-center text-white shadow-[0_5px_18px_rgba(15,23,42,.14)]"><h3 className="w-full text-left text-[12px] font-bold">Profile Completion</h3><div className="mt-3 grid h-[91px] w-[91px] place-items-center rounded-full" style={{ background: 'conic-gradient(#22c55e 0deg 306deg, #153c68 306deg 360deg)' }}><div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#042755]"><div><p className="text-[27px] font-extrabold leading-none">85<span className="text-[14px]">%</span></p><p className="mt-1 text-[8px] text-white/70">Complete</p></div></div></div><p className="mt-3 text-[9px] text-white/75">Great job! Almost there.</p><button onClick={() => setActiveTab('documents')} className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-white/25 py-2 text-[10px] font-bold">Complete Now <ChevronRight size={14} /></button></section>
        </div>

        <section className="mt-3 rounded-2xl bg-white p-3.5 shadow-[0_5px_18px_rgba(15,23,42,.07)]"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[#082d57]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf8ef] text-[#0d9f4a]"><Globe2 size={17} /></span><h3 className="text-[13px] font-extrabold">Study Abroad Preferences</h3></div><button onClick={() => setSheet('settings')} className="rounded-md border border-[#0d9f4a] px-2 py-1 text-[9px] font-bold text-[#0d9f4a]">Edit Preferences</button></div><div className="mt-4 grid grid-cols-4 divide-x divide-slate-100">{preferences.map(preference => <div key={preference.label} className="min-w-0 px-1.5 text-center first:pl-0 last:pr-0"><span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-[#eef8f1] text-[#0d9f4a]">{preference.icon}</span><p className="mt-2 text-[8px] font-semibold text-slate-500">{preference.label}</p><p className="mt-1 text-[10px] font-extrabold leading-tight text-slate-700">{preference.value}</p>{preference.sub && <p className="mt-1 text-[8px] font-bold text-[#0d9f4a]">{preference.sub}</p>}</div>)}</div></section>

        <section className="mt-3 rounded-2xl bg-white p-3.5 shadow-[0_5px_18px_rgba(15,23,42,.07)]"><div className="flex items-center gap-2 text-[#082d57]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf8ef] text-[#0d9f4a]"><Activity size={17} /></span><h3 className="text-[13px] font-extrabold">Quick Summary</h3></div><div className="mt-3 grid grid-cols-4 gap-1.5">{summary.map(item => <button key={item.label} onClick={() => item.label === 'Applications' ? setActiveTab('applications') : setSheet('saved')} className="rounded-xl border border-slate-100 bg-slate-50/60 px-1 py-2 text-center"><span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-[#eef8f1] text-[#0d9f4a]">{item.icon}</span><p className="mt-1 text-[19px] font-extrabold leading-none text-[#082d57]">{item.value}</p><p className="mt-1 text-[8px] font-semibold leading-tight text-slate-500">{item.label}</p><span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[7px] font-bold ${item.tone}`}>{item.tag}</span></button>)}</div></section>

        <section className="mt-3 flex items-center gap-3 overflow-hidden rounded-2xl bg-[#042755] p-3.5 text-white shadow-[0_5px_18px_rgba(15,23,42,.13)]"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-[#42df80]"><Plane size={25} /></div><div className="min-w-0 flex-1"><p className="text-[12px] font-extrabold">Your Dream, Our Guidance <Sparkles size={13} className="inline text-[#f3c64d]" /></p><p className="mt-1 text-[9px] leading-snug text-white/70">Complete your profile, upload documents and receive tailored recommendations.</p></div><button onClick={() => setTab('universities')} className="shrink-0 rounded-lg bg-[#0d9f4a] px-2.5 py-2 text-[9px] font-bold">Explore <ChevronRight size={12} className="inline" /></button></section>
        <div className="mt-3 grid grid-cols-2 gap-2 pb-2"><button onClick={() => setSheet('help')} className="flex items-center justify-center gap-1.5 rounded-xl bg-white py-3 text-[11px] font-bold text-[#082d57] shadow-sm"><MessageCircle size={15} className="text-[#0d9f4a]" />Need help?</button><button onClick={onLogout} className="flex items-center justify-center gap-1.5 rounded-xl bg-white py-3 text-[11px] font-bold text-red-500 shadow-sm"><LogOut size={15} />Logout</button></div>
        </>}

        {activeTab === 'applications' && <section className="rounded-2xl bg-white p-3.5 shadow-[0_5px_18px_rgba(15,23,42,.07)]"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[#082d57]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf8ef] text-[#0d9f4a]"><ClipboardList size={17} /></span><div><h3 className="text-[14px] font-extrabold">My Applications</h3><p className="text-[9px] font-medium text-slate-400">3 applications in progress</p></div></div><span className="rounded-full bg-[#eaf8ef] px-2 py-1 text-[9px] font-bold text-[#0d9f4a]">Active</span></div><div className="mt-4 space-y-2.5">{[{ name: 'University of Toronto', course: 'MSc Computer Science', status: 'Offer received', color: 'bg-[#dcfce7] text-[#15803d]' }, { name: 'University of Melbourne', course: 'Master of Business Analytics', status: 'Documents review', color: 'bg-[#eef4ff] text-[#2563eb]' }, { name: 'University College London', course: 'MSc Data Science', status: 'Application submitted', color: 'bg-[#fff7e6] text-[#b45309]' }].map(app => <div key={app.name} className="rounded-xl border border-slate-100 p-3"><button onClick={() => setExpandedApplication(expandedApplication === app.name ? null : app.name)} className="flex w-full items-center gap-3 text-left"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef8f1] text-[#0d9f4a]"><Landmark size={19} /></span><span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-extrabold text-[#082d57]">{app.name}</span><span className="mt-0.5 block truncate text-[10px] text-slate-500">{app.course}</span></span><ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${expandedApplication === app.name ? 'rotate-180' : ''}`} /></button><span className={`mt-2 inline-block rounded-full px-2 py-1 text-[9px] font-bold ${app.color}`}>{app.status}</span>{expandedApplication === app.name && <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-[10px] leading-relaxed text-slate-600"><p><strong className="text-[#082d57]">Next step:</strong> Your counsellor will contact you with the latest update.</p><button onClick={() => toast.info(`${app.name} details are shown here in your profile.`)} className="mt-2 font-bold text-[#0d9f4a]">View application update</button></div>}</div>)}</div></section>}

        {activeTab === 'documents' && <section className="rounded-2xl bg-white p-3.5 shadow-[0_5px_18px_rgba(15,23,42,.07)]"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[#082d57]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf8ef] text-[#0d9f4a]"><FolderOpen size={17} /></span><div><h3 className="text-[14px] font-extrabold">My Documents</h3><p className="text-[9px] font-medium text-slate-400">Keep your application ready</p></div></div><span className="text-[10px] font-bold text-[#0d9f4a]">4 of 6 ready</span></div><div className="mt-4 space-y-2.5">{[{ name: 'Passport', note: 'Verified', ready: true }, { name: 'Academic transcripts', note: 'Verified', ready: true }, { name: 'IELTS / PTE score report', note: 'Upload required', ready: false }, { name: 'Statement of purpose', note: 'Draft saved', ready: false }].map(doc => <div key={doc.name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eef8f1] text-[#0d9f4a]"><FileText size={17} /></span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-extrabold text-[#082d57]">{doc.name}</p><p className={`mt-0.5 text-[9px] font-bold ${doc.ready ? 'text-[#0d9f4a]' : 'text-amber-600'}`}>{doc.ready ? <><CircleCheck size={10} className="mr-1 inline" />{doc.note}</> : doc.note}</p></div>{!doc.ready && <button onClick={() => uploadInputRef.current?.click()} className="rounded-lg bg-[#eaf8ef] px-2 py-1.5 text-[9px] font-bold text-[#0d9f4a]">Upload</button>}</div>)}</div><input ref={uploadInputRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setUploadedFile(file.name); toast.success(`${file.name} selected for upload.`); } }} /><button onClick={() => uploadInputRef.current?.click()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d9f4a] py-3 text-[11px] font-bold text-white"><FileText size={15} />Upload a document</button>{uploadedFile && <p className="mt-2 text-center text-[9px] font-medium text-[#0d9f4a]">Selected: {uploadedFile}</p>}</section>}

        {activeTab === 'activity' && <section className="rounded-2xl bg-white p-3.5 shadow-[0_5px_18px_rgba(15,23,42,.07)]"><div className="flex items-center gap-2 text-[#082d57]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf8ef] text-[#0d9f4a]"><Activity size={17} /></span><h3 className="text-[14px] font-extrabold">Recent Activity</h3></div><div className="mt-4 space-y-4 border-l-2 border-[#d9f4e2] pl-4">{['Offer letter received from University of Toronto', 'Passport document verified', 'Counselling appointment confirmed'].map((activity, index) => <div key={activity} className="relative"><span className="absolute -left-[21px] top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#0d9f4a]" /><p className="text-[11px] font-bold text-[#082d57]">{activity}</p><p className="mt-1 text-[9px] text-slate-400">{index === 0 ? 'Today' : `${index + 1} days ago`}</p></div>)}</div></section>}

        {activeTab === 'preferences' && <section className="rounded-2xl bg-white p-3.5 shadow-[0_5px_18px_rgba(15,23,42,.07)]"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[#082d57]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf8ef] text-[#0d9f4a]"><Globe2 size={17} /></span><h3 className="text-[14px] font-extrabold">Study Preferences</h3></div><button onClick={() => setSheet('settings')} className="rounded-lg border border-[#0d9f4a] px-2.5 py-1.5 text-[9px] font-bold text-[#0d9f4a]">Edit</button></div><div className="mt-4 grid grid-cols-2 gap-2.5">{preferences.map(preference => <div key={preference.label} className="rounded-xl bg-slate-50 p-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eef8f1] text-[#0d9f4a]">{preference.icon}</span><p className="mt-2 text-[9px] font-medium text-slate-400">{preference.label}</p><p className="mt-1 text-[11px] font-extrabold leading-tight text-slate-700">{preference.value}</p></div>)}</div></section>}
      </main>
    </div>
  );
}

/* ── Main Profile Tab ─────────────────────────────────────────── */
export default function ProfileTab({ setTab, savedIds, onToggleSaved }: { setTab: (t: Tab) => void; savedIds: Set<number>; onToggleSaved: (id: number) => void }) {
  const { data: me } = useGetMe();
  const logout = useLogout();
  const [, setLocation] = useLocation();
  const [sheet, setSheet] = React.useState<Sheet>(null);
  const savedUniversities = React.useMemo(() => UNIVERSITIES.filter((university) => savedIds.has(university.id)), [savedIds]);

  const name  = me?.name  ?? 'Ananya Sharma';
  const email = me?.email ?? 'ananya.sharma@email.com';
  const mobile = me?.mobile ?? '98765 43210';
  const initial = name[0]?.toUpperCase() ?? 'S';

  const handleMenu = (action: string) => {
    if (action === 'saved')        return setSheet('saved');
    if (action === 'applications') return setTab('applications');
    if (action === 'appointments') return setSheet('appointments');
    if (action === 'notifications')return setSheet('notifications');
    if (action === 'refer')        return setSheet('refer');
    if (action === 'settings')     return setSheet('settings');
    if (action === 'help')         return setSheet('help');
  };

  const finishLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('globetrek-saved-university-ids');
    toast.success('You have been logged out');
    setLocation('/auth');
  };

  const handleLogout = () => {
    const token = localStorage.getItem('auth_token');
    if (!token || token === 'globetrek-demo-session') {
      finishLogout();
      return;
    }
    logout.mutate(undefined, {
      onSuccess: finishLogout,
      onError: finishLogout,
    });
  };

  return (
    <>
      <ProfileDashboard
        name={name}
        email={email}
        mobile={mobile}
        savedCount={savedUniversities.length}
        setTab={setTab}
        setSheet={setSheet}
        setLocation={setLocation}
        onLogout={handleLogout}
      />
      <SavedUniversitiesSheet open={sheet === 'saved'} onClose={() => setSheet(null)} universities={savedUniversities} onRemove={onToggleSaved} onBrowse={() => { setSheet(null); setTab('universities'); }} />
      <AppointmentsSheet open={sheet === 'appointments'} onClose={() => setSheet(null)} />
      <NotificationsSheet open={sheet === 'notifications'} onClose={() => setSheet(null)} />
      <ReferEarnSheet open={sheet === 'refer'} onClose={() => setSheet(null)} />
      <SettingsSheet open={sheet === 'settings'} onClose={() => setSheet(null)} name={name} email={email} />
      <HelpSheet open={sheet === 'help'} onClose={() => setSheet(null)} />
    </>
  );

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="bg-[#062a53] px-5 pt-12 pb-6 flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold text-[#062a53]">{initial}</span>
        </div>
        <div className="text-center">
          <h2 className="text-[18px] font-bold text-white">{name}</h2>
          {email && <p className="text-[12px] text-[#a7d4b8] mt-0.5">{email}</p>}
          {me?.mobile && <p className="text-[12px] text-[#a7d4b8] mt-0.5">+91 {me?.mobile}</p>}
        </div>
        <button
          onClick={() => setSheet('settings')}
          className="flex items-center gap-2 bg-white/10 text-white text-[12px] font-semibold px-4 py-2 rounded-full"
        >
          <Edit2 size={12} />
          Edit Profile
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {MENU.map((item, i) => (
            <button
              key={item.label}
              onClick={() => handleMenu(item.action)}
              className={`w-full flex items-center gap-3.5 px-4 py-4 text-left transition-colors hover:bg-slate-50 ${i < MENU.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                {item.icon}
              </div>
              <span className="flex-1 text-[14px] font-semibold text-slate-800">{item.label}</span>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          ))}
        </div>

        {/* My Documents */}
        <button
          onClick={() => setLocation('/documents')}
          className="mt-3 w-full flex items-center gap-3.5 px-4 py-4 bg-white rounded-2xl shadow-sm text-left"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#fef3c7]">
            <FolderOpen size={18} className="text-[#d97706]" />
          </div>
          <span className="flex-1 text-[14px] font-semibold text-slate-800">My Documents</span>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-3 w-full flex items-center justify-center gap-2 py-4 bg-white rounded-2xl shadow-sm text-red-500 text-[14px] font-bold"
        >
          <LogOut size={16} />
          Logout
        </button>

        <p className="text-center text-[11px] text-slate-300 mt-5 mb-2">GlobeTrek Overseas v2.0 · Education Consultancy</p>
      </div>

      {/* Sheets */}
      <SavedUniversitiesSheet open={sheet === 'saved'} onClose={() => setSheet(null)} universities={savedUniversities} onRemove={onToggleSaved} onBrowse={() => { setSheet(null); setTab('universities'); }} />
      <AppointmentsSheet  open={sheet === 'appointments'}  onClose={() => setSheet(null)} />
      <NotificationsSheet open={sheet === 'notifications'} onClose={() => setSheet(null)} />
      <ReferEarnSheet     open={sheet === 'refer'}         onClose={() => setSheet(null)} />
      <SettingsSheet      open={sheet === 'settings'}      onClose={() => setSheet(null)} name={name} email={email} />
      <HelpSheet          open={sheet === 'help'}          onClose={() => setSheet(null)} />
    </div>
  );
}
