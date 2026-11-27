import React, { useState } from 'react';
import { X, Eye, EyeOff, MapPin, ArrowRight, ShieldCheck, Store, Lock, KeyRound, Check } from 'lucide-react';
import { useStore } from '../../lib/store';
import { LocationArea } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    closeAuthModal,
    loginCustomer,
    registerCustomer,
    selectedLocation,
    setActiveView,
  } = useStore();

  // Mode: customer signin, customer signup, forgot password, or vendor portal link
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(authModalTab);

  // Sync mode when modal opens or tab changes
  React.useEffect(() => {
    setMode(authModalTab);
  }, [authModalTab]);

  // Sign In state
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPw, setShowSignInPw] = useState(false);

  // Create Account state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLocation, setPreferredLocation] = useState<LocationArea>(
    selectedLocation === 'ijagun' ? 'ijagun' : 'ijebu-ode'
  );
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCreatePw, setShowCreatePw] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Forgot Password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeAuthModal();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signInIdentifier.trim()) {
      setError('Please provide your registered email address or phone number.');
      return;
    }
    try {
      setIsLoading(true);
      await loginCustomer(signInIdentifier.trim(), signInPassword || undefined);
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError('Please provide at least a contact phone number or email.');
      return;
    }
    if (phone.trim() && phone.trim().length < 10) {
      setError('Please enter a valid Nigerian phone number (10–11 digits).');
      return;
    }
    if (createPassword && confirmPassword && createPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please acknowledge CHOP Terms of Service and Privacy Policy to create an account.');
      return;
    }
    try {
      setIsLoading(true);
      await registerCustomer({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        preferredLocation,
        password: createPassword || undefined,
      });
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Account registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setError('Please enter the email or phone number associated with your account.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSuccess(true);
    }, 600);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#E6E2DA] text-sm text-[#191919] placeholder-[#77736C] focus:outline-none focus:border-[#141414] focus:ring-2 focus:ring-[#141414]/10 transition-all';

  const labelClass = 'block text-xs font-bold text-[#141414] mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Customer Authentication"
      onClick={handleBackdropClick}
    >
      {/* Frosted Glass Container with high-contrast accessible fallback */}
      <div className="bg-[#F7F6F2]/95 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">

        {/* ── Glass Top Header ── */}
        <div className="bg-white/80 backdrop-blur-md px-6 pt-5 pb-4 border-b border-[#E6E2DA]">
          <div className="flex items-start justify-between mb-4">
            <div>
              {/* Brand mark */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#141414] flex items-center justify-center shadow-xs shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                    <path d="M5 12C5 16.4183 8.58172 20 13 20C17.4183 20 21 16.4183 21 12H5Z" fill="#F7F6F2" />
                    <path d="M10 7C9.5 8 10 9 10.5 10" stroke="#C45B3A" strokeWidth="1.75" strokeLinecap="round" />
                    <path d="M14 6C13.5 7.5 14.5 8.5 15 9.5" stroke="#C45B3A" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-display text-lg font-black text-[#141414] leading-none">
                  CHOP<span className="text-[#C45B3A]">.</span>
                </span>
              </div>
              <h2 className="font-display text-xl font-black text-[#141414]">
                {mode === 'signin' && 'Welcome Back'}
                {mode === 'signup' && 'Create Your Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-xs text-[#77736C] mt-0.5">
                {mode === 'signin' && 'Sign in to access your orders and saved locations.'}
                {mode === 'signup' && 'Join CHOP to discover authentic kitchens in Ijebu.'}
                {mode === 'forgot' && 'Enter your phone or email to receive reset instructions.'}
              </p>
            </div>

            <button
              type="button"
              onClick={closeAuthModal}
              className="p-1.5 rounded-full text-[#77736C] hover:text-[#191919] hover:bg-[#F0EEE8] transition-colors shrink-0 active:scale-95"
              aria-label="Close authentication modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="flex gap-1 p-1 bg-[#F0EEE8] rounded-xl border border-[#E6E2DA]/80">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-[#141414] shadow-xs'
                    : 'text-[#77736C] hover:text-[#191919]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-[#141414] shadow-xs'
                    : 'text-[#77736C] hover:text-[#191919]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* ── Scrollable Form Body ── */}
        <div className="p-6 overflow-y-auto space-y-4">

          {/* Error Banner */}
          {error && (
            <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold animate-in fade-in duration-150">
              {error}
            </div>
          )}

          {/* ── Sign In ── */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className={labelClass} htmlFor="signin-id">
                  Email or Phone Number
                </label>
                <input
                  id="signin-id"
                  type="text"
                  autoComplete="username"
                  required
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  placeholder="e.g. 08012345678 or name@email.com"
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#141414]" htmlFor="signin-pw">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); }}
                    className="text-[11px] font-semibold text-[#C45B3A] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="signin-pw"
                    type={showSignInPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPw(!showSignInPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77736C] hover:text-[#191919]"
                    aria-label={showSignInPw ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showSignInPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#141414] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Signing In…' : 'Sign In to CHOP'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ── Registration ── */}
          {mode === 'signup' && (
            <form onSubmit={handleCreateAccount} className="space-y-3.5">
              <div>
                <label className={labelClass} htmlFor="signup-name">
                  Full Name <span className="text-[#C45B3A]">*</span>
                </label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Bukola Adesanya"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} htmlFor="signup-email">
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="signup-phone">
                    Phone Number <span className="text-[#C45B3A]">*</span>
                  </label>
                  <input
                    id="signup-phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="080 000 0000"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Preferred Hub Selector */}
              <div>
                <label className={labelClass}>
                  Primary Service Area
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['ijebu-ode', 'ijagun'] as LocationArea[]).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setPreferredLocation(loc)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        preferredLocation === loc
                          ? 'bg-[#141414] text-white border-[#141414] shadow-xs'
                          : 'bg-white text-[#191919] border-[#E6E2DA] hover:border-[#141414]/30'
                      }`}
                    >
                      <MapPin className="w-3 h-3 inline mr-1 text-[#C45B3A]" />
                      {loc === 'ijebu-ode' ? 'Ijebu Ode' : 'Ijagun'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} htmlFor="signup-pw">
                    Password
                  </label>
                  <input
                    id="signup-pw"
                    type={showCreatePw ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Create a password"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="signup-confirm-pw">
                    Confirm Password
                  </label>
                  <input
                    id="signup-confirm-pw"
                    type={showCreatePw ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Terms & Conditions Acceptance Checkbox */}
              <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none text-xs text-[#77736C]">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#E6E2DA] text-[#C45B3A] focus:ring-[#C45B3A]"
                />
                <span>
                  I agree to CHOP&apos;s Terms of Service and Privacy Policy for Ijebu Ode &amp; Ijagun.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#C45B3A] text-white text-xs sm:text-sm font-semibold hover:bg-[#b34e30] transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Registering…' : 'Create My Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ── Forgot Password ── */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotSuccess ? (
                <div className="p-4 rounded-2xl bg-white border border-[#E6E2DA] text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-[#141414]">Password Reset Sent</h4>
                  <p className="text-xs text-[#77736C]">
                    If an account exists for <strong className="text-[#191919]">{forgotIdentifier}</strong>, instructions have been sent via SMS/Email.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setForgotSuccess(false); setError(''); }}
                    className="mt-2 text-xs font-bold text-[#C45B3A] hover:underline"
                  >
                    Return to Sign In &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3.5">
                  <div>
                    <label className={labelClass} htmlFor="forgot-id">
                      Your Email or Phone Number
                    </label>
                    <input
                      id="forgot-id"
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. 08012345678"
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black transition-all"
                  >
                    {isLoading ? 'Checking…' : 'Send Reset Link'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setError(''); }}
                    className="w-full text-center text-xs text-[#77736C] hover:text-[#191919] pt-1"
                  >
                    &larr; Back to Sign In
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── Separate Vendor Onboarding & Sign-In Route ── */}
          <div className="pt-4 border-t border-[#E6E2DA]/80 flex items-center justify-between text-xs">
            <span className="text-[#77736C]">Own a restaurant, bukka or grill?</span>
            <button
              type="button"
              onClick={() => {
                closeAuthModal();
                setActiveView('for-vendors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-bold text-[#141414] hover:text-[#C45B3A] flex items-center gap-1 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#C45B3A]" />
              <span>Vendor Portal &rarr;</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
