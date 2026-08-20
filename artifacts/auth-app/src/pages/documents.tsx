import * as React from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, Upload, X, ExternalLink, Sparkles, Plus,
  FileText, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import AiDocScanner from '@/components/AiDocScanner';

type DocStatus = 'uploaded' | 'pending' | 'reviewing';

interface Doc {
  id: string;
  label: string;
  status: DocStatus;
  file?: File;
  note?: string;
}

const INITIAL_DOCS: Doc[] = [
  { id: 'passport',    label: 'Passport',             status: 'pending', note: 'Valid for 6+ months' },
  { id: 'mark10',      label: '10th Marksheet',        status: 'pending' },
  { id: 'mark12',      label: '12th Marksheet',        status: 'pending' },
  { id: 'bachelor',    label: "Bachelor's Marksheet",  status: 'pending' },
  { id: 'ielts',       label: 'IELTS Score Report',    status: 'pending', note: 'Or PTE / TOEFL' },
  { id: 'sop',         label: 'SOP',                   status: 'pending', note: 'Statement of Purpose' },
  { id: 'lor',         label: 'LOR',                   status: 'pending', note: 'Letter of Recommendation' },
  { id: 'resume',      label: 'Resume / CV',           status: 'pending' },
];

const STATUS_CONFIG = {
  uploaded:  { icon: <CheckCircle2 size={18} className="text-[#087b41]" />, color: '#087b41', bg: '#edf8f1', label: 'Uploaded'  },
  reviewing: { icon: <Clock size={18} className="text-[#d97706]" />,        color: '#d97706', bg: '#fef3c7', label: 'Reviewing' },
  pending:   { icon: <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300" />, color: '#94a3b8', bg: '#f1f5f9', label: 'Pending'  },
};

/* ── DigiLocker Modal ─────────────────────────────────────────── */
function DigiLockerModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 flex flex-col gap-5 shadow-2xl"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
          <X size={15} className="text-slate-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1A5276] flex items-center justify-center">
            <FileText size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-slate-900">DigiLocker</h2>
            <p className="text-[12px] text-slate-500">Govt. of India — Digital Documents</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-[13px] font-bold text-amber-800">Coming Soon</p>
          <p className="text-[12px] text-amber-700 mt-1 leading-relaxed">
            Once enabled, import Aadhaar, Marksheets, Degrees and other official documents directly — no manual uploads needed.
          </p>
        </div>
        <a href="https://digilocker.gov.in" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-semibold">
          <ExternalLink size={14} /> Visit DigiLocker
        </a>
        <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-[#087b41] text-white font-bold text-[14px]">Got it</button>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function DocumentsPage() {
  const [, setLocation] = useLocation();
  const [docs, setDocs]           = React.useState<Doc[]>(INITIAL_DOCS);
  const [showDigiLocker, setShowDigiLocker] = React.useState(false);
  const [showAiScanner, setShowAiScanner]   = React.useState(false);
  const fileRefs = React.useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'uploaded', file } : d));
    toast.success(`${INITIAL_DOCS.find(d => d.id === id)?.label} uploaded ✓`);
  };

  const handleContinue = () => {
    const pending = docs.filter(d => d.status === 'pending');
    if (pending.length > 0) {
      toast.error(`Please upload: ${pending.map(d => d.label).join(', ')}`);
      return;
    }
    setLocation('/countries');
  };

  const uploadedCount = docs.filter(d => d.status === 'uploaded').length;
  const pct = Math.round((uploadedCount / docs.length) * 100);

  return (
    <>
      <div className="min-h-[100dvh] flex flex-col max-w-[430px] mx-auto bg-[#f5f7f8] gto-app-shell">
        {/* Header */}
        <div className="bg-[#062a53] px-5 pt-12 pb-5 flex-shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => setLocation(localStorage.getItem('auth_token') ? '/home' : '/auth')} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-white">My Documents</h1>
              <p className="text-[12px] text-[#a7d4b8]">Upload required documents</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] text-[#a7d4b8]">{uploadedCount} of {docs.length} uploaded</span>
              <span className="text-[12px] font-bold text-white">{pct}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#4ade80] rounded-full"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {/* AI Scanner button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAiScanner(true)}
            className="flex items-center gap-3 w-full p-3.5 rounded-2xl border-2 border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[13px] font-bold text-violet-900">Scan with AI</p>
              <p className="text-[11px] text-violet-500">Upload any doc — AI reads & verifies it</p>
            </div>
            <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1">
              <Sparkles size={9} /> New
            </span>
          </motion.button>

          {/* DigiLocker button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowDigiLocker(true)}
            className="flex items-center gap-3 w-full p-3.5 rounded-2xl border border-dashed border-[#1A5276]/30 bg-[#e8f0f7]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1A5276] flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[13px] font-bold text-[#1A5276]">Connect via DigiLocker</p>
              <p className="text-[11px] text-[#1A5276]/60">Import govt. documents instantly</p>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex-shrink-0">Soon</span>
          </motion.button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400 font-medium">or upload manually</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Document list */}
          <div className="flex flex-col gap-2.5">
            {docs.map((doc) => {
              const cfg = STATUS_CONFIG[doc.status];
              const isUploaded = doc.status === 'uploaded';
              return (
                <motion.div
                  key={doc.id}
                  layout
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    {/* Status dot */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: cfg.bg }}
                    >
                      {cfg.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-900">{doc.label}</p>
                      {doc.note && !isUploaded && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{doc.note}</p>
                      )}
                      {isUploaded && doc.file && (
                        <p className="text-[11px] text-[#087b41] mt-0.5">{doc.file.name}</p>
                      )}
                    </div>

                    {/* Action button */}
                    {isUploaded ? (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[11px] font-bold text-[#087b41] bg-[#edf8f1] px-2.5 py-1 rounded-full">Uploaded</span>
                        <button
                          onClick={() => setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'pending', file: undefined } : d))}
                          className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center"
                        >
                          <X size={13} className="text-slate-400" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileRefs.current[doc.id]?.click()}
                        className="flex items-center gap-1.5 bg-[#087b41] text-white text-[12px] font-bold px-3 py-2 rounded-xl flex-shrink-0"
                      >
                        <Upload size={12} />
                        Upload
                      </button>
                    )}
                    <input
                      ref={el => { fileRefs.current[doc.id] = el; }}
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={e => handleFileChange(doc.id, e)}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Upload New Document */}
          <button className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[#087b41]/30 rounded-2xl text-[#087b41] font-semibold text-[13px]">
            <Plus size={16} />
            Upload New Document
          </button>

          {/* Continue / Skip */}
          <div className="flex flex-col gap-2 pt-2 pb-6">
            <button
              onClick={handleContinue}
              className="w-full py-4 bg-[#087b41] text-white rounded-2xl text-[14px] font-bold shadow-lg shadow-[#087b41]/25"
            >
              Continue →
            </button>
            <button
              onClick={() => setLocation('/countries')}
              className="w-full py-3 text-slate-400 text-[13px] font-medium"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDigiLocker && <DigiLockerModal onClose={() => setShowDigiLocker(false)} />}
      </AnimatePresence>
      <AiDocScanner open={showAiScanner} onClose={() => setShowAiScanner(false)} />
    </>
  );
}
