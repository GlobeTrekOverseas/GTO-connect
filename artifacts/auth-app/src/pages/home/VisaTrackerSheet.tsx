import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';

const VISA_STEPS = [
  { label: 'Documents Submitted',   date: '20 May 2024',  done: true  },
  { label: 'University Application', date: '25 May 2024',  done: true  },
  { label: 'Offer Letter Received',  date: '10 Jun 2024',  done: true  },
  { label: 'CAS / COE Received',     date: '18 Jun 2024',  done: true  },
  { label: 'Visa Application Filed', date: '25 Jun 2024',  done: true  },
  { label: 'Visa Approved',          date: 'Pending',       done: false },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function VisaTrackerSheet({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 bg-white flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            {/* Header */}
            <div className="bg-[#062a53] px-5 pt-12 pb-5 flex-shrink-0">
              <div className="flex items-center gap-3 mb-1">
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <ArrowLeft size={18} className="text-white" />
                </button>
                <div>
                  <h1 className="text-[20px] font-bold text-white">Visa Tracker</h1>
                  <p className="text-[12px] text-[#a7d4b8]">Track your visa application progress</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              {/* Status badge */}
              <div className="bg-[#fef3c7] border border-[#fde68a] rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
                <Clock size={18} className="text-[#d97706] flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-bold text-[#92400e]">In Progress</p>
                  <p className="text-[11px] text-[#b45309] mt-0.5">Your visa application is being processed. We'll update you soon!</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative flex flex-col gap-0">
                {VISA_STEPS.map((step, i) => (
                  <div key={step.label} className="flex gap-4">
                    {/* Left: icon + line */}
                    <div className="flex flex-col items-center flex-shrink-0 w-8">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${step.done ? 'bg-[#087b41]' : 'bg-slate-200'}`}>
                        {step.done
                          ? <CheckCircle2 size={16} className="text-white" />
                          : <Clock size={14} className="text-slate-400" />
                        }
                      </div>
                      {i < VISA_STEPS.length - 1 && (
                        <div className={`w-0.5 flex-1 my-1 ${step.done ? 'bg-[#087b41]' : 'bg-slate-200'}`} style={{ minHeight: 32 }} />
                      )}
                    </div>

                    {/* Right: content */}
                    <div className={`flex-1 pb-6 ${i === VISA_STEPS.length - 1 ? 'pb-0' : ''}`}>
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={`p-4 rounded-2xl border ${step.done ? 'bg-[#edf8f1] border-[#b6dfc7]' : 'bg-slate-50 border-slate-200'}`}
                      >
                        <p className={`text-[13px] font-bold ${step.done ? 'text-[#1a5c35]' : 'text-slate-500'}`}>{step.label}</p>
                        <p className={`text-[11px] mt-0.5 ${step.done ? 'text-[#087b41]' : 'text-slate-400'}`}>
                          {step.done ? `✓ Completed · ${step.date}` : `⏳ ${step.date}`}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact CTA */}
              <div className="mt-6 bg-[#062a53] rounded-2xl p-4 text-center">
                <p className="text-white font-bold text-[14px]">Need help with your visa?</p>
                <p className="text-[#a7d4b8] text-[12px] mt-1">Our visa specialists are here to help</p>
                <button className="mt-3 bg-white text-[#062a53] text-[13px] font-bold px-6 py-2.5 rounded-xl">
                  Chat with Visa Expert
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
