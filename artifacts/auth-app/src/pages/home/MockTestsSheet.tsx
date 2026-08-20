import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const SECTIONS = [
  { label: 'Listening', score: 8.0, color: '#087b41', bg: '#edf8f1' },
  { label: 'Reading',   score: 7.5, color: '#1e40af', bg: '#eff6ff' },
  { label: 'Writing',   score: 6.5, color: '#d97706', bg: '#fef3c7' },
  { label: 'Speaking',  score: 7.0, color: '#7c3aed', bg: '#f5f3ff' },
];

const RECENT_TESTS = [
  { name: 'IELTS Full Test 02', band: 7.0, date: '18 Jun 2024', type: 'IELTS' },
  { name: 'IELTS Full Test 01', band: 6.5, date: '02 Jun 2024', type: 'IELTS' },
  { name: 'PTE Academic Mock 1', band: 72,  date: '28 May 2024', type: 'PTE'   },
];

/* Circular progress SVG */
function CircleProgress({ pct, band }: { pct: number; band: number }) {
  const r = 52, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none"
          stroke="#087b41" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center z-10">
        <p className="text-[11px] text-slate-500 font-medium">Overall</p>
        <p className="text-[28px] font-bold text-slate-900 leading-none">{band}</p>
        <p className="text-[11px] text-[#087b41] font-semibold">Band</p>
      </div>
    </div>
  );
}

interface Props { open: boolean; onClose: () => void }

export default function MockTestsSheet({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = React.useState<'ielts' | 'pte' | 'practice'>('ielts');

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/50 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="fixed inset-0 z-50 bg-white flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            {/* Header */}
            <div className="bg-[#062a53] px-5 pt-12 pb-0 flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowLeft size={18} className="text-white" />
                </button>
                <div>
                  <h1 className="text-[20px] font-bold text-white">Mock Tests</h1>
                  <p className="text-[12px] text-[#a7d4b8]">Practice & track your progress</p>
                </div>
              </div>
              {/* Tabs */}
              <div className="flex gap-0 bg-white/10 rounded-xl p-0.5 mb-1">
                {(['ielts', 'pte', 'practice'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-2 rounded-[10px] text-[13px] font-bold uppercase transition-all ${activeTab === t ? 'bg-white text-[#062a53]' : 'text-white/70'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5 bg-transparent">

              {/* Progress Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center gap-4">
                <p className="text-[14px] font-bold text-slate-900">Overall Progress</p>
                <CircleProgress pct={75} band={7.5} />
                <p className="text-[12px] text-slate-500 text-center">
                  {activeTab === 'ielts' ? 'IELTS Band 7.5 · Target: 8.0' : activeTab === 'pte' ? 'PTE Score 72 · Target: 79' : 'Practice Score: 78%'}
                </p>
                <button className="w-full py-3.5 bg-[#062a53] text-white rounded-2xl text-[14px] font-bold">
                  Take a Test
                </button>
              </div>

              {/* Sectional Scores */}
              <div>
                <p className="text-[13px] font-bold text-slate-700 mb-3">Sectional Scores</p>
                <div className="grid grid-cols-2 gap-3">
                  {SECTIONS.map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2" style={{ borderTop: `3px solid ${s.color}` }}>
                      <p className="text-[12px] font-semibold text-slate-500">{s.label}</p>
                      <p className="text-[26px] font-bold" style={{ color: s.color }}>{s.score}</p>
                      <div className="h-1.5 rounded-full" style={{ background: s.bg }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: s.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(s.score / 9) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Tests */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[13px] font-bold text-slate-700">Recent Tests</p>
                  <button className="text-[12px] text-[#087b41] font-semibold">View All Tests</button>
                </div>
                <div className="flex flex-col gap-2.5">
                  {RECENT_TESTS.filter(t => activeTab === 'practice' || t.type.toLowerCase() === activeTab).map(t => (
                    <div key={t.name} className="bg-white rounded-2xl px-4 py-3.5 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#edf8f1] flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-bold text-[#087b41]">{t.type}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-slate-800">{t.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[15px] font-bold text-[#087b41]">{t.type === 'PTE' ? t.band : `Band ${t.band}`}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                  ))}
                  {RECENT_TESTS.filter(t => activeTab === 'practice' || t.type.toLowerCase() === activeTab).length === 0 && (
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                      <p className="text-4xl mb-2">📖</p>
                      <p className="text-[14px] font-bold text-slate-800">No tests taken yet</p>
                      <p className="text-[12px] text-slate-400 mt-1">Take your first practice test to see results here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
