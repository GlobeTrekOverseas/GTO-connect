import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, ChevronRight, X, ArrowLeft, Building2,
  CheckCircle2, Loader2, Send, MapPin, SlidersHorizontal, ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetApplications, useCreateApplication } from '@workspace/api-client-react';
import { UNIVERSITIES, F, type University } from './data';
import type { Tab } from '../home';

interface Props {
  setTab: (t: Tab) => void;
  savedIds: Set<number>;
  onToggleSaved: (id: number) => void;
}

/* ── University Detail Sheet ─────────────────────────────────────── */
const campusImageRequests = new Map<string, Promise<string | null>>();

function fallbackCampusImage(uni: University, width = 900, height = 560) {
  return `https://picsum.photos/seed/gto-campus-${uni.id}/${width}/${height}`;
}

function campusSearchName(name: string) {
  const aliases: Record<string, string> = {
    'University of California, LA': 'University of California Los Angeles',
    'National Univ. of Singapore': 'National University of Singapore',
    'Technical University of Munich': 'Technical University Munich',
  };
  return aliases[name] ?? name;
}

function getCampusImage(name: string) {
  const cacheKey = name.trim().toLowerCase();
  const existing = campusImageRequests.get(cacheKey);
  if (existing) return existing;

  const params = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', generator: 'search',
    // File namespace searches the Wikimedia Commons image library rather than
    // using a university's Wikipedia logo or crest as the card photo.
    gsrsearch: `${campusSearchName(name)} campus`, gsrnamespace: '6', gsrlimit: '5',
    prop: 'imageinfo', iiprop: 'url', iiurlwidth: '900',
  });
  const request = fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`)
    .then(async response => {
      if (!response.ok) return null;
      const payload = await response.json() as {
        query?: {
          pages?: Record<string, {
            index?: number;
            imageinfo?: Array<{ thumburl?: string; url?: string }>;
          }>;
        };
      };
      const pages = Object.values(payload.query?.pages ?? {})
        .sort((a, b) => (a.index ?? Number.MAX_SAFE_INTEGER) - (b.index ?? Number.MAX_SAFE_INTEGER));
      const image = pages
        .map(page => page.imageinfo?.[0]?.thumburl ?? page.imageinfo?.[0]?.url ?? null)
        .find(url => url && !/\.svg(?:\?|$)/i.test(url));
      return image ?? null;
    })
    .catch(() => null);

  campusImageRequests.set(cacheKey, request);
  return request;
}

function UniversityPhoto({
  uni,
  className,
  resolveCampus = false,
  eager = false,
  thumbnail = false,
}: {
  uni: University;
  className?: string;
  resolveCampus?: boolean;
  eager?: boolean;
  thumbnail?: boolean;
}) {
  const fallback = fallbackCampusImage(uni, thumbnail ? 280 : 900, thumbnail ? 180 : 560);
  const [imageSource, setImageSource] = React.useState(fallback);
  const [imageFailed, setImageFailed] = React.useState(false);

  React.useEffect(() => {
    if (!resolveCampus) return;

    let cancelled = false;
    setImageSource(fallback);
    setImageFailed(false);

    getCampusImage(uni.name).then(image => {
      if (!cancelled && image) setImageSource(image);
    });

    return () => {
      cancelled = true;
    };
  }, [uni.id, uni.name, resolveCampus, fallback]);

  return (
    <div className="h-full w-full bg-[#e7f0f8]">
      {imageFailed ? (
        <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#06254d,#0a7140)]"><Building2 size={28} className="text-white/85" /></div>
      ) : (
        <img
          src={imageSource}
          alt={uni.name}
          loading={eager ? 'eager' : 'lazy'}
          className={className ?? 'h-full w-full object-cover'}
          onError={() => {
            if (imageSource !== fallback) setImageSource(fallback);
            else setImageFailed(true);
          }}
        />
      )}
    </div>
  );
}

function UniversityDetail({ uni, onClose, onApply, isApplied, isApplying, isSaved, onToggleSaved }: {
  uni: University;
  onClose: () => void;
  onApply: () => void;
  isApplied: boolean;
  isApplying: boolean;
  isSaved: boolean;
  onToggleSaved: () => void;
}) {
  const [detailTab, setDetailTab] = React.useState<'overview' | 'courses' | 'requirements' | 'scholarship'>('overview');

  return (
    <div className="gto-university-detail-frame absolute inset-0 z-50 h-full w-full overflow-hidden bg-white">
      <motion.div
      className="absolute inset-0 bg-white flex flex-col"
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
    >
      {/* Hero Image */}
      <div className="relative h-52 flex-shrink-0">
        <UniversityPhoto uni={uni} resolveCampus eager className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <button
          onClick={onClose}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow"
        >
          <ArrowLeft size={18} className="text-slate-800" />
        </button>
        <button onClick={onToggleSaved} aria-label={isSaved ? 'Remove from saved universities' : 'Save university'} className="absolute top-12 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow">
          <Heart size={18} className={isSaved ? 'text-red-500' : 'text-slate-700'} fill={isSaved ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h2 className="text-[17px] font-bold text-slate-900 leading-snug">{uni.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <img src={F(uni.countryCode)} alt={uni.country} className="w-5 h-3.5 object-cover rounded-sm" />
              <span className="text-[12px] text-slate-500">{uni.country}</span>
              <span className="text-[11px] font-bold text-[#087b41] bg-[#edf8f1] px-2 py-0.5 rounded-full">{uni.rank}</span>
            </div>
          </div>
        </div>

        {/* Detail Tabs */}
        <div className="flex gap-0 mt-3 bg-slate-100 rounded-xl p-0.5">
          {(['overview', 'courses', 'requirements', 'scholarship'] as const).map(t => (
            <button
              key={t}
              onClick={() => setDetailTab(t)}
              className={`flex-1 py-1.5 rounded-[10px] text-[10px] font-bold capitalize transition-all ${detailTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              {t === 'requirements' ? 'Require.' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {detailTab === 'overview' && (
          <div className="flex flex-col gap-3">
            {[
              { label: 'Established',       value: uni.established ? String(uni.established) : 'Not mentioned' },
              { label: 'Type',              value: uni.type },
              { label: 'Tuition Fees',      value: uni.tuition || 'Not mentioned' },
              { label: 'IELTS Requirement', value: uni.ielts },
              { label: 'Intake',            value: uni.intake || 'Contact university for intake dates' },
              { label: 'Courses Offered',   value: uni.courses || 'Contact university for available courses' },
              ...(uni.address ? [{ label: 'Campus Location', value: uni.address }] : []),
              ...(uni.campuses ? [{ label: 'Campus', value: uni.campuses }] : []),
            ].map(row => (
              <div key={row.label} className="flex justify-between items-start py-2.5 border-b border-slate-100">
                <span className="text-[12px] text-slate-500 w-36">{row.label}</span>
                <span className="text-[12px] font-semibold text-slate-800 flex-1 text-right">{row.value}</span>
              </div>
            ))}
          {uni.website && (
            <a
              href={uni.website}
              target='_blank'
              rel='noreferrer'
              className='mt-1 flex items-center justify-between rounded-2xl border border-[#b6dfc7] bg-[#edf8f1] px-4 py-3 text-[#087b41]'
            >
              <span className='text-[12px] font-bold'>Official university website</span>
              <ExternalLink size={16} />
            </a>
          )}
          </div>
        )}
        {detailTab === 'courses' && (
          <div className="flex flex-col gap-2">
            {(uni.courses && uni.courses.includes(',') ? uni.courses.split(',').map(course => course.trim()).filter(Boolean) : ['Explore available programs', 'Contact the university for course options']).map(c => (
              <div key={c} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                <span className="text-[13px] font-semibold text-slate-800">{c}</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            ))}
          </div>
        )}
        {detailTab === 'requirements' && (
          <div className="flex flex-col gap-3">
            {[
              { label: 'Academic',  value: 'Eligibility is assessed by the university for each course.' },
              { label: 'English',   value: uni.ielts },
              { label: 'Documents', value: 'Transcripts, 2 Reference Letters, SOP, CV' },
              { label: 'Next step',  value: 'Use Apply Now to send your interest to a GlobeTrek counsellor.' },
            ].map(r => (
              <div key={r.label} className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{r.label}</p>
                <p className="text-[13px] text-slate-800 mt-1">{r.value}</p>
              </div>
            ))}
          </div>
        )}
        {detailTab === 'scholarship' && (
          <div className="flex flex-col gap-3">
            {[
              { name: 'Merit Excellence Award', amount: 'Up to 50% tuition waiver', deadline: 'March 31' },
              { name: 'International Student Grant', amount: '$5,000 – $15,000', deadline: 'April 15' },
              { name: 'STEM Leadership Scholarship', amount: 'Full tuition + living', deadline: 'January 31' },
            ].map(s => (
              <div key={s.name} className="p-4 bg-[#edf8f1] rounded-2xl border border-[#b6dfc7]">
                <p className="text-[13px] font-bold text-[#062a53]">{s.name}</p>
                <p className="text-[12px] text-[#087b41] font-semibold mt-0.5">{s.amount}</p>
                <p className="text-[11px] text-slate-500 mt-1">Deadline: {s.deadline}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex gap-3 border-t border-slate-100 bg-white">
        <button
          onClick={onApply}
          disabled={isApplied || isApplying}
          className={`flex-1 py-3.5 rounded-2xl text-[14px] font-bold flex items-center justify-center gap-2 ${
            isApplied ? 'bg-[#edf8f1] text-[#087b41]' : 'bg-[#087b41] text-white shadow-lg shadow-[#087b41]/25'
          }`}
        >
          {isApplying ? <Loader2 size={16} className="animate-spin" /> : isApplied ? <CheckCircle2 size={16} /> : <Send size={16} />}
          {isApplying ? 'Applying…' : isApplied ? 'Applied ✓' : 'Apply Now'}
        </button>
        <button onClick={onToggleSaved} className="flex-1 py-3.5 rounded-2xl text-[14px] font-bold border-2 border-[#087b41] text-[#087b41] flex items-center justify-center gap-2">
          <Heart size={16} fill={isSaved ? '#ef4444' : 'none'} className={isSaved ? 'text-red-500' : undefined} />
          {isSaved ? 'Saved' : 'Save University'}
        </button>
      </div>
      </motion.div>
    </div>
  );
}

/* ── Main Tab ────────────────────────────────────────────────────── */
export default function UniversitiesTab({ setTab, savedIds, onToggleSaved }: Props) {
  const [search, setSearch]     = React.useState('');
  const [countryFilter, setCountryFilter] = React.useState('');
  const [applying, setApplying] = React.useState<Set<number>>(new Set());
  const [appliedIds, setAppliedIds] = React.useState<Set<number>>(new Set());
  const [detail, setDetail]     = React.useState<University | null>(null);
  const createApplication       = useCreateApplication();
  const { data: existingApps }  = useGetApplications();
  const existingApplications = Array.isArray(existingApps) ? existingApps : [];
  const filters = [
    { label: 'All', code: '', country: '' },
    ...Array.from(new Map(UNIVERSITIES.map(university => [university.country, university.countryCode])).entries())
      .map(([country, code]) => ({ label: country, code, country })),
  ];

  React.useEffect(() => {
    if (existingApplications.length) {
      const names = new Set(existingApplications.filter(a => a.status !== 'rejected').map(a => a.universityName));
      setAppliedIds(new Set(UNIVERSITIES.filter(u => names.has(u.name)).map(u => u.id)));
    }
  }, [existingApplications]);

  const filtered = UNIVERSITIES.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.country.toLowerCase().includes(search.toLowerCase());
    const matchCountry = !countryFilter || u.country === countryFilter;
    return matchSearch && matchCountry;
  });

  const toggleLike = (id: number) => {
    const was = savedIds.has(id);
    onToggleSaved(id);
    toast.success(was ? 'Removed from saved universities' : 'Saved to your universities ❤️');
  };

  const handleApply = (u: University) => {
    if (applying.has(u.id) || appliedIds.has(u.id)) return;
    setApplying(prev => new Set([...prev, u.id]));
    createApplication.mutate(
      { universityName: u.name, country: u.country },
      {
        onSuccess: () => {
          setApplying(prev => { const s = new Set(prev); s.delete(u.id); return s; });
          setAppliedIds(prev => new Set([...prev, u.id]));
          toast.success(`Applied to ${u.name}! 🎉`);
          setTimeout(() => setTab('applications'), 1400);
        },
        onError: (err: any) => {
          setApplying(prev => { const s = new Set(prev); s.delete(u.id); return s; });
          const msg = err?.data?.error ?? err.message ?? '';
          if (msg.includes('already have an active application')) {
            setAppliedIds(prev => new Set([...prev, u.id]));
            toast.info('Already applied to this university');
          } else toast.error('Failed to apply. Please try again.');
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#062a53] px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-[20px] font-bold text-white">Find Your Dream</h1>
            <h1 className="text-[20px] font-bold text-white">University</h1>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <SlidersHorizontal size={17} className="text-white" />
          </button>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 mt-3">
          <Search size={16} className="text-slate-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search universities..."
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
          />
          {search && <button onClick={() => setSearch('')}><X size={14} className="text-slate-400" /></button>}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-white border-b border-slate-100">
        {filters.map(f => {
          const active = f.country === countryFilter;
          return (
            <button
              key={f.label}
              onClick={() => setCountryFilter(f.country)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold border transition-all ${
                active ? 'bg-[#062a53] text-white border-[#062a53]' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {f.code && <img src={F(f.code)} alt={f.label} className="w-4 h-3 object-cover rounded-sm flex-shrink-0" />}
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="px-4 py-2 bg-transparent">
        <p className="text-[12px] text-slate-500">{filtered.length} universities found</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 bg-transparent flex flex-col gap-3 pt-2">
        {filtered.map(u => {
          const isLiked    = savedIds.has(u.id);
          const isApplied  = appliedIds.has(u.id);
          const isApplying = applying.has(u.id);
          return (
            <div
              key={u.id}
              className="flex-none bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <button className="w-full text-left" onClick={() => setDetail(u)}>
                <div className="flex items-center gap-3 p-4">
                  {/* Flag thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                    <UniversityPhoto
                      uni={u}
                      resolveCampus={u.id <= 16}
                      eager={u.id <= 16}
                      thumbnail
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-900 leading-tight">{u.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <img src={F(u.countryCode)} alt={u.country} className="w-4 h-2.5 object-cover rounded-sm" />
                      <span className="text-[11px] text-slate-500">{u.country}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold text-[#087b41] bg-[#edf8f1] px-2 py-0.5 rounded-full">{u.rank}</span>
                      <span className="text-[10px] text-slate-400">{u.tuition}</span>
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); toggleLike(u.id); }}
                    className="flex-shrink-0 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Heart size={20} className={isLiked ? 'text-red-500' : 'text-slate-300'} fill={isLiked ? '#ef4444' : 'none'} />
                  </button>
                </div>
              </button>

              {/* Apply / Applied badge */}
              {isApplied && (
                <div className="px-4 pb-3">
                  <div className="flex items-center gap-1.5 bg-[#edf8f1] rounded-xl px-3 py-2">
                    <CheckCircle2 size={13} className="text-[#087b41]" />
                    <span className="text-[11px] font-bold text-[#087b41]">Application Submitted</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="text-5xl">🔍</div>
            <p className="text-slate-500 text-[14px] text-center">No universities found<br />for your search</p>
            <button onClick={() => { setSearch(''); setCountryFilter(''); }} className="text-[#087b41] text-[13px] font-semibold">Clear filters</button>
          </div>
        )}
      </div>

      {/* Shortlist FAB */}
      {savedIds.size > 0 && (
        <div className="absolute bottom-16 left-0 right-0 px-4 py-2">
          <button
            onClick={() => { toast.info(String(savedIds.size) + ' ' + (savedIds.size === 1 ? 'university' : 'universities') + ' saved — opening your list'); setTab('profile'); }}
            className="w-full py-3.5 rounded-2xl bg-[#062a53] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-xl shadow-black/20"
          >
            <Heart size={15} fill="white" className="text-white" />
            {savedIds.size} Saved
          </button>
        </div>
      )}

      {/* Detail Sheet */}
      <AnimatePresence>
        {detail && (
          <UniversityDetail
            uni={detail}
            onClose={() => setDetail(null)}
            onApply={() => handleApply(detail)}
            isApplied={appliedIds.has(detail.id)}
            isApplying={applying.has(detail.id)}
            isSaved={savedIds.has(detail.id)}
            onToggleSaved={() => toggleLike(detail.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
