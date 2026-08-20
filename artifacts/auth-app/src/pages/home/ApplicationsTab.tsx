import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Bell, CheckCircle2, Clock, XCircle, ChevronRight,
  FileText, Send, Loader2, Building2, Upload,
} from 'lucide-react';
import { useGetApplications, useGetMe } from '@workspace/api-client-react';
import { useLocation } from 'wouter';
import type { Application } from '@workspace/api-client-react';
import { F } from './data';
import type { Tab } from '../home';

const STEPS = [
  { key: 'application', label: 'Application',  icon: '📋' },
  { key: 'offer',       label: 'Offer Letter',  icon: '📩' },
  { key: 'visa',        label: 'Visa Status',   icon: '🛂' },
  { key: 'payment',     label: 'Payment',       icon: '💳' },
  { key: 'documents',   label: 'Documents',     icon: '📁' },
  { key: 'counsellor',  label: 'Counsellor',    icon: '👩‍💼' },
];

const STATUS_BADGE: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  submitted:    { label: 'Submitted',    bg: '#eff6ff', text: '#1e40af', dot: '#3b82f6' },
  under_review: { label: 'Under Review', bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  accepted:     { label: 'Accepted 🎉',  bg: '#edf8f1', text: '#1a5c35', dot: '#087b41' },
  rejected:     { label: 'Rejected',     bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444' },
};

const FLAG_MAP: Record<string, string> = {
  Canada: 'ca', Australia: 'au', UK: 'gb', USA: 'us',
  Germany: 'de', Ireland: 'ie', Switzerland: 'ch', Singapore: 'sg',
  Netherlands: 'nl', 'New Zealand': 'nz',
};

function AppCard({ app }: { app: Application }) {
  const cfg = STATUS_BADGE[app.status] ?? STATUS_BADGE.submitted;
  const flag = FLAG_MAP[app.country ?? ''];
  const date = app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        {/* Country flag */}
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
          {flag
            ? <img src={F(flag)} alt={app.country ?? ''} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><Building2 size={18} className="text-slate-400" /></div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-slate-900 leading-snug">{app.universityName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {flag && <img src={F(flag)} alt="" className="w-3.5 h-2.5 object-cover rounded-sm" />}
            <span className="text-[11px] text-slate-500">{app.country}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full`} style={{ background: cfg.bg, color: cfg.text }}>
              {cfg.label}
            </span>
            {date && <span className="text-[10px] text-slate-400">{date}</span>}
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-300 flex-shrink-0 mt-1" />
      </div>

      {/* Progress timeline */}
      <div className="mt-3 flex items-center gap-1">
        {['submitted', 'under_review', 'accepted'].map((s, i) => {
          const stages = ['submitted', 'under_review', 'accepted', 'rejected'];
          const currentIdx = stages.indexOf(app.status);
          const done = i <= currentIdx && app.status !== 'rejected';
          return (
            <React.Fragment key={s}>
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${done ? 'bg-[#087b41]' : 'bg-slate-100'}`} />
              {i < 2 && <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${done ? 'bg-[#087b41]' : 'bg-slate-200'}`} />}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        {['Submitted', 'Under Review', 'Decision'].map(l => (
          <span key={l} className="text-[9px] text-slate-400">{l}</span>
        ))}
      </div>

      {app.status === 'accepted' && (
        <div className="mt-3 p-3 bg-[#edf8f1] rounded-xl">
          <p className="text-[12px] font-bold text-[#1a5c35]">🎉 Congratulations! You've been accepted.</p>
          <p className="text-[11px] text-[#087b41] mt-0.5">Please check your email for next steps.</p>
        </div>
      )}
    </motion.div>
  );
}

export default function ApplicationsTab({ setTab }: { setTab: (t: Tab) => void }) {
  const { data: me } = useGetMe();
  const { data: apps, isLoading } = useGetApplications();
  const applicationList = Array.isArray(apps) ? apps : [];
  const [, setLocation] = useLocation();
  const name = me?.name?.split(' ')[0] ?? 'Student';

  const totalApps   = applicationList.length;
  const inProgress  = applicationList.filter(a => a.status === 'under_review').length;
  const accepted    = applicationList.filter(a => a.status === 'accepted').length;

  // Compute progress %
  const completedDocs = 4; // mock
  const totalDocs = 6;
  const progress = Math.round((completedDocs / totalDocs) * 100);

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="bg-[#062a53] px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-white">My Dashboard</h1>
            <p className="text-[12px] text-[#a7d4b8] mt-0.5">Track your study abroad journey</p>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Bell size={20} className="text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 pt-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#062a53] flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">{name[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-slate-900">{me?.name ?? 'Student'}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Student ID: GT{String(me?.id ?? '024578').padStart(6, '0')}</p>
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-slate-500">Your Study Abroad Progress</span>
                <span className="text-[11px] font-bold text-[#087b41]">{progress}% Complete</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#087b41] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Journey steps */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-[14px] font-bold text-slate-900 mb-3">Journey Steps</h3>
          <div className="grid grid-cols-3 gap-2">
            {STEPS.map((step, i) => {
              const done = i < 2;
              const active = i === 2;
              return (
                <div
                  key={step.key}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl ${done ? 'bg-[#edf8f1]' : active ? 'bg-blue-50' : 'bg-slate-50'}`}
                >
                  <span className="text-xl">{step.icon}</span>
                  <span className="text-[10px] font-semibold text-center text-slate-700 leading-tight">{step.label}</span>
                  {done
                    ? <CheckCircle2 size={12} className="text-[#087b41]" />
                    : active
                    ? <Clock size={12} className="text-blue-500" />
                    : <div className="w-3 h-3 rounded-full border-2 border-slate-200" />
                  }
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Step CTA */}
        <div className="bg-[#062a53] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#a7d4b8] font-medium">Next Step</p>
            <p className="text-[14px] font-bold text-white mt-0.5">Upload your Passport Copy</p>
          </div>
          <button
            onClick={() => setLocation('/documents')}
            className="bg-white text-[#062a53] text-[12px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 flex-shrink-0"
          >
            <Upload size={13} />
            Upload Now
          </button>
        </div>

        {/* Stats */}
        {totalApps > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Applied',      val: totalApps,  bg: '#eff6ff', text: '#1e40af' },
              { label: 'In Review',    val: inProgress, bg: '#fef3c7', text: '#92400e' },
              { label: 'Accepted',     val: accepted,   bg: '#edf8f1', text: '#1a5c35' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-3 text-center shadow-sm" style={{ background: s.bg }}>
                <p className="text-[22px] font-bold" style={{ color: s.text }}>{s.val}</p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Applications list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-slate-900">My Applications</h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={24} className="animate-spin text-[#087b41]" />
            </div>
          ) : applicationList.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#edf8f1] flex items-center justify-center text-3xl">🎓</div>
              <div>
                <p className="text-[14px] font-bold text-slate-900">Start Your Journey</p>
                <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                  Browse universities and apply — your dream campus awaits!
                </p>
              </div>
              <button
                onClick={() => setTab('universities')}
                className="w-full py-3.5 bg-[#087b41] text-white rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2"
              >
                <Building2 size={15} />
                Browse Universities
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {applicationList.map(app => <AppCard key={app.id} app={app} />)}
              <button
                onClick={() => setTab('universities')}
                className="w-full py-3.5 border-2 border-dashed border-[#087b41] text-[#087b41] rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2"
              >
                + Apply to More Universities
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
