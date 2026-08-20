import * as React from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

const DEMO_EMAIL = 'demo@gtoconnect.com';
const DEMO_PASSWORD = 'Demo@1234';

type LocalAccount = { name: string; email: string; mobile?: string; password: string };
type AuthPayload = { token?: string; message?: string; user?: { name?: string; email?: string; mobile?: string } };

function readLocalAccounts(): LocalAccount[] {
  try {
    const saved = JSON.parse(localStorage.getItem('globetrek_local_accounts') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [partnerMode, setPartnerMode] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSignUp, setShowSignUp] = React.useState(false);
  const [signUpName, setSignUpName] = React.useState('');
  const [signUpEmail, setSignUpEmail] = React.useState('');
  const [signUpPassword, setSignUpPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const startSession = (token: string, message: string) => {
    localStorage.setItem('auth_token', token);
    toast.success(message);
    setLocation('/home');
  };

  const rememberCurrentUser = (user: AuthPayload['user']) => {
    if (!user) return;
    localStorage.setItem('globetrek_current_user', JSON.stringify({
      name: user.name || 'Student',
      email: user.email || '',
      mobile: user.mobile || '',
    }));
  };

  const useDemoAccount = () => {
    setIdentifier(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setPartnerMode(false);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = identifier.trim().toLowerCase();
    if (!email || !password) {
      toast.error('Enter your email and password.');
      return;
    }

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem('globetrek_current_user', JSON.stringify({ name: 'Demo Student', email: DEMO_EMAIL, mobile: '' }));
      startSession('globetrek-demo-session', 'Welcome to GTO Connect!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember, partner: partnerMode }),
      });
      const payload = await response.json().catch(() => ({})) as AuthPayload;
      if (response.ok && payload.token) {
        rememberCurrentUser(payload.user);
        startSession(payload.token, 'Welcome back!');
        return;
      }

      // Existing accounts created by older browser-only versions remain usable.
      const localAccount = readLocalAccounts().find((account) => account.email === email && account.password === password);
      if (localAccount) {
        localStorage.setItem('globetrek_current_user', JSON.stringify({ name: localAccount.name, email: localAccount.email, mobile: localAccount.mobile || '' }));
        startSession('globetrek-local-' + Date.now(), 'Welcome to GTO Connect!');
        return;
      }

      throw new Error(payload.message || 'Invalid email or password');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = signUpName.trim();
    const email = signUpEmail.trim().toLowerCase();

    if (!name || !email || !signUpPassword || !confirmPassword) {
      toast.error('Complete all sign up fields.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Enter a valid email address.');
      return;
    }
    if (signUpPassword.length < 6) {
      toast.error('Use a password with at least 6 characters.');
      return;
    }
    if (signUpPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: signUpPassword }),
      });
      const payload = await response.json().catch(() => ({})) as AuthPayload;
      if (!response.ok || !payload.token) throw new Error(payload.message || 'Unable to create your account');
      rememberCurrentUser(payload.user || { name, email });
      setShowSignUp(false);
      startSession(payload.token, 'Your GTO Connect account is ready!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="gto-auth-reference-shell relative mx-auto h-[100dvh] w-full max-w-[430px] overflow-hidden bg-[#062a53]">
      <img
        src="/auth/gto-connect-login.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full select-none object-fill"
      />

      <form onSubmit={submit} className="gto-login-reference-form" aria-label="GTO Connect login">
        <button
          type="button"
          aria-label="Team Login"
          aria-pressed={!partnerMode}
          onClick={() => setPartnerMode(false)}
          className="absolute left-[12%] top-[42.2%] h-[4.7%] w-[38%] rounded-xl focus:outline-none focus:ring-2 focus:ring-white/80"
        ><span className="sr-only">Team Login</span></button>
        <button
          type="button"
          aria-label="Partner Login"
          aria-pressed={partnerMode}
          onClick={() => { setPartnerMode(true); toast.info('Partner login selected'); }}
          className="absolute right-[12%] top-[42.2%] h-[4.7%] w-[38%] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087b41]"
        ><span className="sr-only">Partner Login</span></button>

        <label className="sr-only" htmlFor="gto-login-email">Email</label>
        <input
          id="gto-login-email"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          className="absolute left-[13%] top-[49.1%] h-[5.3%] w-[74%] rounded-2xl bg-transparent px-[12%] text-[14px] font-medium text-[#062a53] outline-none focus:ring-2 focus:ring-[#087b41]/45"
        />

        <label className="sr-only" htmlFor="gto-login-password">Password</label>
        <input
          id="gto-login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          className="absolute left-[13%] top-[55.2%] h-[5.3%] w-[74%] rounded-2xl bg-transparent px-[12%] text-[14px] font-medium text-[#062a53] outline-none focus:ring-2 focus:ring-[#087b41]/45"
        />

        <label className="absolute left-[12%] top-[61.7%] flex h-[3.3%] w-[34%] cursor-pointer items-center">
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-5 w-5 accent-[#087b41] opacity-0" />
          <span className="sr-only">Remember me</span>
        </label>
        <button type="button" onClick={() => toast.info('Password recovery will be available soon.')} className="absolute right-[12%] top-[61.7%] h-[3.3%] w-[30%] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087b41]/45"><span className="sr-only">Forgot Password?</span></button>

        <button type="submit" disabled={isSubmitting} aria-label={isSubmitting ? 'Logging in' : 'Login'} className="absolute left-[13%] top-[65.1%] h-[5.6%] w-[74%] rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/80 disabled:cursor-wait"><span className="sr-only">{isSubmitting ? 'Logging in' : 'Login'}</span></button>

        <button type="button" aria-label="Continue with Google" onClick={() => toast.info('Google sign-in will be available soon.')} className="absolute left-[13%] top-[74.8%] h-[5.1%] w-[74%] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#087b41]/45"><span className="sr-only">Continue with Google</span></button>
      </form>

      <div className="gto-login-extras" aria-label="Account testing and sign up">
        <button type="button" className="gto-demo-account" onClick={useDemoAccount}>Demo Account</button>
        <button type="button" className="gto-signup-action" onClick={() => setShowSignUp(true)}>Sign Up</button>
      </div>

      {showSignUp && (
        <div className="gto-signup-modal" role="dialog" aria-modal="true" aria-labelledby="gto-signup-title">
          <form className="gto-signup-card" onSubmit={createAccount}>
            <div className="gto-signup-header">
              <div>
                <p className="gto-signup-eyebrow">GTO CONNECT</p>
                <h2 id="gto-signup-title">Create your account</h2>
              </div>
              <button type="button" aria-label="Close sign up" onClick={() => setShowSignUp(false)}>×</button>
            </div>
            <p>Start exploring your study-abroad journey.</p>
            <label>Full name<input value={signUpName} onChange={(event) => setSignUpName(event.target.value)} autoComplete="name" /></label>
            <label>Email address<input type="email" value={signUpEmail} onChange={(event) => setSignUpEmail(event.target.value)} autoComplete="email" /></label>
            <label>Create password<input type="password" value={signUpPassword} onChange={(event) => setSignUpPassword(event.target.value)} autoComplete="new-password" /></label>
            <label>Confirm password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></label>
            <button type="submit" className="gto-create-account">Create Account</button>
          </form>
        </div>
      )}
    </main>
  );
}
