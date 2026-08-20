import { setAuthTokenGetter } from "@workspace/api-client-react";

setAuthTokenGetter(() => localStorage.getItem("auth_token"));

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { Home } from 'lucide-react';
import OnboardingPage from '@/pages/onboarding';
import AuthPage from '@/pages/auth';
import CountriesPage from '@/pages/countries';
import DocumentsPage from '@/pages/documents';
import HomePage from '@/pages/home';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function UnknownRouteRedirect() {
  const [, setLocation] = useLocation();

  // A copied address can occasionally include formatting characters.  Return
  // visitors to the welcome flow instead of leaving them on a blank 404 page.
  useEffect(() => setLocation('/'), [setLocation]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={OnboardingPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/countries" component={CountriesPage} />
      <Route path="/documents" component={DocumentsPage} />
      <Route path="/home" component={HomePage} />
      <Route component={UnknownRouteRedirect} />
    </Switch>
  );
}

function HomeReturnButton() {
  const [location, setLocation] = useLocation();
  const hiddenRoutes = ['/', '/onboarding', '/auth', '/home'];

  if (hiddenRoutes.includes(location)) return null;

  return (
    <button
      type="button"
      onClick={() => {
        // HomePage remains mounted while moving between its internal tabs, so
        // reset its local tab state as well as routing to /home.
        window.dispatchEvent(new Event('globetrek:return-home'));
        setLocation('/home');
      }}
      aria-label="Return to home"
      className="gto-home-return fixed right-3 top-3 z-[100] flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/40 bg-[#06254d] px-3 text-[12px] font-bold text-white shadow-lg shadow-[#06254d]/30 transition-transform active:scale-95"
    >
      <Home size={19} />
      <span>Home</span>
    </button>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
        <HomeReturnButton />
      </WouterRouter>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

export default App;
