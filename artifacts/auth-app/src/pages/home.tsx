import * as React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Home, Plus, FileText, MessageCircle, User, Loader2 } from 'lucide-react';
import { useGetMe } from '@workspace/api-client-react';

import HomeTab          from './home/HomeTab';
import UniversitiesTab  from './home/UniversitiesTab';
import ApplicationsTab  from './home/ApplicationsTab';
import ChatTab          from './home/ChatTab';
import ProfileTab       from './home/ProfileTab';
import VisaTrackerSheet from './home/VisaTrackerSheet';
import MockTestsSheet   from './home/MockTestsSheet';
import type { Tab }     from './home/types';

const SAVED_UNIVERSITIES_STORAGE = 'globetrek-saved-university-ids';

export type { Tab };

const NAV: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'home',         icon: <Home size={22} />,          label: 'Home'         },
  { id: 'applications', icon: <FileText size={22} />,      label: 'Applications' },
  { id: 'universities', icon: <Plus size={31} strokeWidth={2.5} />, label: 'Explore' },
  { id: 'chat',         icon: <MessageCircle size={22} />, label: 'Messages'     },
  { id: 'profile',      icon: <User size={22} />,          label: 'Profile'      },
];

export default function HomePage() {
  const [, setLocation]  = useLocation();
  const [tab, setTab]    = React.useState<Tab>(() => {
    const requested = new URLSearchParams(window.location.search).get('tab');
    return requested === 'universities' || requested === 'applications' || requested === 'chat' || requested === 'profile'
      ? requested
      : 'home';
  });
  const [showVisa, setShowVisa]       = React.useState(false);
  const [showMockTests, setShowMockTests] = React.useState(false);
  const [savedUniversityIds, setSavedUniversityIds] = React.useState<Set<number>>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SAVED_UNIVERSITIES_STORAGE) || '[]');
      return new Set(Array.isArray(stored) ? stored.filter((id): id is number => Number.isInteger(id)) : []);
    } catch { return new Set(); }
  });

  React.useEffect(() => {
    localStorage.setItem(SAVED_UNIVERSITIES_STORAGE, JSON.stringify([...savedUniversityIds]));
  }, [savedUniversityIds]);

  React.useEffect(() => {
    const currentTabPath = tab === 'home' ? '/home' : '/home?tab=' + tab;
    window.history.replaceState(window.history.state, '', currentTabPath);
  }, [tab]);

  React.useEffect(() => {
    const returnHome = () => setTab('home');
    window.addEventListener('globetrek:return-home', returnHome);
    return () => window.removeEventListener('globetrek:return-home', returnHome);
  }, []);

  const toggleSavedUniversity = React.useCallback((id: number) => {
    setSavedUniversityIds((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const authToken = localStorage.getItem('auth_token');
  const isDemoSession = authToken === 'globetrek-demo-session';
  const isLocalSession = Boolean(authToken?.startsWith('globetrek-local-'));
  const localUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('globetrek_current_user') || 'null') as { name?: string } | null; }
    catch { return null; }
  }, [authToken]);
  const { data: me, isLoading, isError } = useGetMe({
    query: {
      queryKey: ['/api/auth/me'],
      enabled: Boolean(authToken) && !isDemoSession && !isLocalSession,
    },
  });

  React.useEffect(() => {
    if (!authToken || (isError && !isDemoSession && !isLocalSession)) {
      localStorage.removeItem('auth_token');
      setLocation('/auth');
    }
  }, [authToken, isError, isDemoSession, isLocalSession, setLocation]);

  if (!authToken) {
    return <div className="h-[100dvh] bg-transparent" />;
  }

  if (isLoading && !isDemoSession && !isLocalSession) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-transparent">
        <Loader2 size={32} className="animate-spin text-[#087b41]" />
      </div>
    );
  }

  const name = isDemoSession ? 'Ananya' : (isLocalSession ? (localUser?.name?.split(' ')[0] ?? 'There') : (me?.name?.split(' ')[0] ?? 'There'));

  return (
    /* Root: exact viewport height, flex column, no overflow */
    <div className="h-[100dvh] flex flex-col max-w-[430px] mx-auto bg-[#f5f7f8] gto-app-shell overflow-hidden">

      {/* ── Tab content (fills remaining space, each tab manages its own scroll) */}
      <div className="flex-1 min-h-0 relative overflow-visible">
        {tab === 'home' && <div className="absolute inset-0"><HomeTab name={name} setTab={setTab} onVisaTracker={() => setShowVisa(true)} onMockTests={() => setShowMockTests(true)} /></div>}
        {tab === 'universities' && <div className="absolute inset-0"><UniversitiesTab setTab={setTab} savedIds={savedUniversityIds} onToggleSaved={toggleSavedUniversity} /></div>}
        {tab === 'applications' && <div className="absolute inset-0"><ApplicationsTab setTab={setTab} /></div>}
        {tab === 'chat' && <div className="absolute inset-0"><ChatTab /></div>}
        {tab === 'profile' && <div className="absolute inset-0"><ProfileTab setTab={setTab} savedIds={savedUniversityIds} onToggleSaved={toggleSavedUniversity} /></div>}
      </div>

      {/* ── Bottom nav (fixed-height flex child) */}
      <div className="relative z-20 h-[72px] flex-shrink-0 bg-white border-t border-slate-200 shadow-[0_-5px_18px_rgba(6,37,77,0.10)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-full">
          {NAV.map(item => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
              >
                {active && item.id !== 'universities' && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-[#087b41]"
                  />
                )}
                <div className={`transition-colors ${item.id === 'universities' ? '-mt-8 grid h-14 w-14 place-items-center rounded-full border-4 border-[#f5f7f8] bg-[#159447] text-white shadow-[0_6px_15px_rgba(8,123,65,.34)]' : active ? 'text-[#087b41]' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-[#087b41]' : 'text-slate-400'} ${item.id === 'universities' ? '-mt-0.5' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Overlay sheets */}
      <VisaTrackerSheet open={showVisa}      onClose={() => setShowVisa(false)} />
      <MockTestsSheet   open={showMockTests} onClose={() => setShowMockTests(false)} />
    </div>
  );
}
