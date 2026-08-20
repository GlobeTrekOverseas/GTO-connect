import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Upload, Sparkles, CheckCircle2, AlertTriangle,
  XCircle, Camera, RefreshCw, FileSearch
} from 'lucide-react';
import { toast } from 'sonner';
import { useScanDocument } from '@workspace/api-client-react';

interface ScanField {
  label: string;
  value: string;
  status?: 'ok' | 'warning' | 'error';
}

interface ScanResult {
  documentType: string;
  fields: ScanField[];
  verdict: 'ready' | 'needs_attention' | 'not_suitable';
  verdictMessage: string;
  tips: string[];
}

const VERDICT_CONFIG = {
  ready: {
    icon: <CheckCircle2 size={22} className="text-emerald-600" />,
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700',
    label: 'Ready',
  },
  needs_attention: {
    icon: <AlertTriangle size={22} className="text-amber-600" />,
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-700',
    label: 'Needs Attention',
  },
  not_suitable: {
    icon: <XCircle size={22} className="text-red-600" />,
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-700',
    label: 'Not Suitable',
  },
};

const STATUS_ICON = {
  ok: <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />,
  warning: <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />,
  error: <XCircle size={14} className="text-red-500 flex-shrink-0" />,
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // strip data URL prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AiDocScanner({ open, onClose }: Props) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [result, setResult] = React.useState<ScanResult | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scanMutation = useScanDocument();

  const reset = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
    scanMutation.reset();
  };

  const handleClose = () => { reset(); onClose(); };

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WEBP)');
      return;
    }
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleScan = async () => {
    if (!file) return;
    try {
      const imageBase64 = await fileToBase64(file);
      scanMutation.mutate(
        { data: { imageBase64, mimeType: file.type } },
        {
          onSuccess: (data) => setResult(data as ScanResult),
          onError: () => toast.error('Scan failed. Please try again.'),
        }
      );
    } catch {
      toast.error('Could not read file');
    }
  };

  const verdict = result ? VERDICT_CONFIG[result.verdict] : null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[92dvh] flex flex-col"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            {/* Handle */}
            <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900">AI Document Scanner</h3>
                  <p className="text-[11px] text-slate-400">Powered by GPT Vision</p>
                </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

              {/* Upload zone */}
              {!preview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed border-violet-200 bg-violet-50/50 rounded-3xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:bg-violet-50 active:bg-violet-100 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                    <FileSearch size={30} className="text-violet-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] font-bold text-slate-800">Upload a Document</p>
                    <p className="text-[12px] text-slate-400 mt-1">Passport, Marksheet, IELTS, Bank Statement…</p>
                    <p className="text-[11px] text-slate-300 mt-1">Tap to browse or drag & drop</p>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {['JPG', 'PNG', 'WEBP'].map(ext => (
                      <span key={ext} className="px-2 py-0.5 bg-white rounded-md text-[10px] font-bold text-slate-400 border border-slate-200">{ext}</span>
                    ))}
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-100">
                  <img src={preview} alt="Document preview" className="w-full max-h-48 object-contain bg-slate-50" />
                  <button
                    onClick={reset}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Camera shortcut */}
              {!preview && (
                <button
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.setAttribute('capture', 'environment');
                      inputRef.current.click();
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-[13px] hover:bg-slate-50"
                >
                  <Camera size={16} className="text-slate-400" />
                  Take a Photo
                </button>
              )}

              {/* Scan button */}
              {file && !result && (
                <button
                  onClick={handleScan}
                  disabled={scanMutation.isPending}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[15px] shadow-lg shadow-violet-500/30 disabled:opacity-70"
                >
                  {scanMutation.isPending ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Scanning with AI…
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Scan Document
                    </>
                  )}
                </button>
              )}

              {/* Loading skeleton */}
              {scanMutation.isPending && (
                <div className="flex flex-col gap-3 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                  <div className="h-4 bg-slate-100 rounded-full w-full" />
                  <div className="h-4 bg-slate-100 rounded-full w-4/5" />
                  <div className="h-4 bg-slate-100 rounded-full w-3/5" />
                </div>
              )}

              {/* Result */}
              {result && verdict && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* Doc type + verdict */}
                  <div className={`flex items-start gap-3 p-4 rounded-2xl border ${verdict.bg}`}>
                    {verdict.icon}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-bold text-slate-900">{result.documentType}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${verdict.badge}`}>
                          {verdict.label}
                        </span>
                      </div>
                      <p className={`text-[12px] mt-1 leading-relaxed ${verdict.text}`}>{result.verdictMessage}</p>
                    </div>
                  </div>

                  {/* Extracted fields */}
                  {result.fields.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Extracted Information</p>
                      <div className="flex flex-col gap-1.5">
                        {result.fields.map((f, i) => (
                          <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-100">
                            {STATUS_ICON[f.status ?? 'ok']}
                            <span className="text-[12px] text-slate-500 w-28 flex-shrink-0">{f.label}</span>
                            <span className="text-[13px] font-semibold text-slate-800 flex-1 text-right">{f.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {result.tips.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Recommendations</p>
                      <div className="flex flex-col gap-1.5">
                        {result.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2.5 px-4 py-2.5 bg-slate-50 rounded-xl">
                            <span className="text-[14px] flex-shrink-0 mt-0.5">💡</span>
                            <span className="text-[12px] text-slate-600 leading-relaxed">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scan another */}
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border border-violet-200 text-violet-600 font-bold text-[14px] hover:bg-violet-50"
                  >
                    <RefreshCw size={15} />
                    Scan Another Document
                  </button>
                </motion.div>
              )}

              <div className="h-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
