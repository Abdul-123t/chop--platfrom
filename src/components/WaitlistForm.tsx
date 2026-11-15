import { FormEvent, useEffect, useRef, useState } from 'react';
import { Check, Copy, Loader2, Share2 } from 'lucide-react';
import { WAITLIST_ENDPOINT } from '../services/api/env';
import { CHOP_CONFIG, CUSTOMER_CRAVINGS, FOOD_CATEGORIES } from '../config';
import { useReveal } from '../hooks/useReveal';
import { AreaOption, DeliveryPreference, StudentOption, WaitlistPayload, WaitlistType } from '../types';
import { COUNTRY_CODES, normalizeWhatsAppNumber, validateWhatsAppNumber } from '../utils/phone';

interface WaitlistFormProps {
  mode: WaitlistType;
  onModeChange: (mode: WaitlistType) => void;
  area: AreaOption;
  onAreaChange: (area: AreaOption) => void;
}

const STUDENT_OPTIONS: StudentOption[] = [
  'Yes, at TASUED',
  'Yes, somewhere else',
  'No',
];

interface FormErrors {
  fullName?: string;
  whatsapp?: string;
  email?: string;
  businessName?: string;
  foodCategory?: string;
  contactConsent?: string;
  submit?: string;
}

const BURST_PARTICLES = [
  { tx: '-54px', ty: '-34px', size: 'w-2 h-2', delay: '120ms' },
  { tx: '56px', ty: '-30px', size: 'w-2.5 h-2.5', delay: '140ms' },
  { tx: '-40px', ty: '44px', size: 'w-2 h-2', delay: '160ms' },
  { tx: '48px', ty: '42px', size: 'w-2 h-2', delay: '150ms' },
  { tx: '0px', ty: '-60px', size: 'w-2.5 h-2.5', delay: '110ms' },
  { tx: '-64px', ty: '4px', size: 'w-1.5 h-1.5', delay: '180ms' },
  { tx: '64px', ty: '8px', size: 'w-1.5 h-1.5', delay: '170ms' },
  { tx: '18px', ty: '56px', size: 'w-2 h-2', delay: '190ms' },
];

export function WaitlistForm({ mode, onModeChange, area, onAreaChange }: WaitlistFormProps) {
  const { ref, isVisible } = useReveal<HTMLElement>();

  // Common fields
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState<string>('+234');
  const [whatsappInput, setWhatsappInput] = useState('');
  const [email, setEmail] = useState('');

  // Customer fields
  const [student, setStudent] = useState<StudentOption | ''>('');
  const [cravings, setCravings] = useState<string[]>([]);

  // Vendor fields
  const [businessName, setBusinessName] = useState('');
  const [foodCategory, setFoodCategory] = useState<string>(FOOD_CATEGORIES[0].label);
  const [otherCategory, setOtherCategory] = useState('');
  const [delivers, setDelivers] = useState<DeliveryPreference>(DeliveryPreference.Yes);
  const [landmark, setLandmark] = useState('');
  const [operatingLocations, setOperatingLocations] = useState<string[]>([]);
  const [operatingModel, setOperatingModel] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [socialMediaLink, setSocialMediaLink] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [contactConsent, setContactConsent] = useState(false);

  // Honeypot field
  const [website, setWebsite] = useState('');

  // Validation & Submission state
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const submissionInProgress = useRef(false);
  const previousMode = useRef(mode);

  const clearFieldsForMode = (nextMode: WaitlistType) => {
    if (nextMode === WaitlistType.Customer) {
      setBusinessName('');
      setFoodCategory(FOOD_CATEGORIES[0].label);
      setOtherCategory('');
      setDelivers(DeliveryPreference.Yes);
      setLandmark('');
      setOperatingLocations([]);
      setOperatingModel('');
      setBusinessDescription('');
      setSocialMediaLink('');
      setAdditionalComments('');
    } else {
      setStudent('');
      setCravings([]);
    }

    setContactConsent(false);
    setErrors({});
    setTouched({});
  };

  useEffect(() => {
    if (previousMode.current === mode) return;
    previousMode.current = mode;
    clearFieldsForMode(mode);
  }, [mode]);

  const toggleCraving = (item: string) => {
    setCravings((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const validateField = (field: keyof FormErrors, overrideValue?: string): string | undefined => {
    if (field === 'fullName') {
      const val = (overrideValue ?? fullName).trim();
      if (!val) return 'Add your full name so we know who to reach.';
      if (val.length < 2) return 'Enter at least 2 characters for your name.';
      return undefined;
    }

    if (field === 'whatsapp') {
      const val = overrideValue ?? whatsappInput;
      return validateWhatsAppNumber(val, countryCode) || undefined;
    }

    if (field === 'email') {
      const val = (overrideValue ?? email).trim();
      if (!val) return undefined;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return 'Enter a valid email address or leave this blank.';
      }
      return undefined;
    }

    if (field === 'businessName' && mode === WaitlistType.Vendor) {
      const val = (overrideValue ?? businessName).trim();
      if (!val) return 'Add your food business name.';
      return undefined;
    }

    if (field === 'foodCategory' && mode === WaitlistType.Vendor) {
      if (!foodCategory) return 'Select the category that best fits your food business.';
      return undefined;
    }

    return undefined;
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validateAll = (): boolean => {
    const nextErrors: FormErrors = {
      fullName: validateField('fullName'),
      whatsapp: validateField('whatsapp'),
      email: validateField('email'),
      businessName: mode === WaitlistType.Vendor ? validateField('businessName') : undefined,
      foodCategory: mode === WaitlistType.Vendor ? validateField('foodCategory') : undefined,
      contactConsent: contactConsent ? undefined : 'Please agree to be contacted about your submission.',
    };

    setErrors(nextErrors);
    setTouched({
      fullName: true,
      whatsapp: true,
      email: true,
      businessName: true,
      foodCategory: true,
      contactConsent: true,
    });

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submissionInProgress.current) {
      return;
    }

    if (website.trim() !== '') {
      setSubmitted(true);
      return;
    }

    if (!validateAll()) {
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: undefined }));

    const normalizedPhone = normalizeWhatsAppNumber(whatsappInput, countryCode);
    const payload: WaitlistPayload = {
      type: mode,
      fullName: fullName.trim(),
      whatsapp: normalizedPhone,
      email: email.trim(),
      area,
      contactConsent,
      student: mode === WaitlistType.Customer ? student : '',
      searches: mode === WaitlistType.Customer ? cravings : [],
      businessName: mode === WaitlistType.Vendor ? businessName.trim() : '',
      category: mode === WaitlistType.Vendor ? foodCategory : '',
      delivers: mode === WaitlistType.Vendor ? delivers : '',
      address: mode === WaitlistType.Vendor ? landmark.trim() : '',
      operatingModel: mode === WaitlistType.Vendor ? operatingModel : '',
      operatingLocations:
        mode === WaitlistType.Vendor
          ? operatingLocations.length > 0
            ? operatingLocations
            : [area]
          : [],
      businessDescription: mode === WaitlistType.Vendor ? businessDescription.trim() : '',
      otherCategory: mode === WaitlistType.Vendor ? otherCategory.trim() : '',
      foodCategories:
        mode === WaitlistType.Vendor ? [foodCategory] : [...cravings],
      fulfilmentOptions:
        mode !== WaitlistType.Vendor || delivers === DeliveryPreference.No
          ? mode === WaitlistType.Vendor
            ? ['Pickup']
            : []
          : delivers === DeliveryPreference.Sometimes
            ? ['Pickup', 'Delivery']
            : ['Delivery'],
      socialMediaLink: mode === WaitlistType.Vendor ? socialMediaLink.trim() : '',
      additionalComments: mode === WaitlistType.Vendor ? additionalComments.trim() : '',
      source: 'website',
      website: '',
    };

    let failureMessage = 'Something went wrong. Please try again in a moment.';
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result: unknown = await res.json();
      const succeeded =
        typeof result === 'object' &&
        result !== null &&
        'success' in result &&
        result.success === true;

      if (!res.ok || !succeeded) {
        if (
          typeof result === 'object' &&
          result !== null &&
          'message' in result &&
          typeof result.message === 'string'
        ) {
          failureMessage = result.message;
        }
        throw new Error('Waitlist submission was not accepted.');
      }

      setSubmitted(true);
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: failureMessage,
      }));
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText =
      'CHOP is launching soon in Ijebu Ode and Ijagun (TASUED) — one place to discover every food spot around you. Join the waitlist:';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CHOP | Every food spot. Every craving. One place.',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopiedShare(true);
      window.setTimeout(() => setCopiedShare(false), 3000);
    } catch {
      // Clipboard blocked
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setWhatsappInput('');
    setEmail('');
    setContactConsent(false);
    setStudent('');
    setCravings([]);
    setBusinessName('');
    setOtherCategory('');
    setLandmark('');
    setOperatingLocations([]);
    setOperatingModel('');
    setBusinessDescription('');
    setSocialMediaLink('');
    setAdditionalComments('');
    setErrors({});
    setTouched({});
  };

  const handleModeChange = (nextMode: WaitlistType) => {
    if (nextMode === mode) return;
    clearFieldsForMode(nextMode);
    onModeChange(nextMode);
  };

  const isVendor = mode === WaitlistType.Vendor;

  return (
    <section
      ref={ref}
      aria-labelledby="waitlist-heading"
      className="relative py-20 lg:py-[120px] overflow-hidden border-t border-[#0E0D0B]/8 dark:border-white/[0.06] bg-[#EFE7DA] dark:bg-[#0E0D0B]"
    >
      {/* Subtle noise texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 film-grain opacity-65" />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="waitlist-layout grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* Left Column: Waitlist Explainer (fades up 16px to 0 once on entry) */}
          <div
            className={`lg:col-span-5 space-y-6 lg:sticky lg:top-28 waitlist-explainer-reveal ${
              isVisible ? 'is-visible' : ''
            }`}
          >
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8772E] mb-3">
                Waitlist for Ijebu Ode and Ijagun (TASUED)
              </p>
              <h2
                id="waitlist-heading"
                className="font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#0E0D0B] dark:text-[#F7F1E8]"
              >
                Get early access.
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#0E0D0B]/85 dark:text-[#F7F1E8]/90 leading-relaxed">
              {CHOP_CONFIG.brand.why}
            </p>

            <p className="text-base text-[#574F45] dark:text-[#A89F92] leading-relaxed">
              Join the waitlist and we&apos;ll message you on WhatsApp when CHOP opens in your area.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                'First access when CHOP goes live in Ijebu Ode',
                'Priority WhatsApp updates when CHOP expands to Ijagun (TASUED)',
                'Early onboarding support for local food businesses',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#E8772E]/15 text-[#E8772E] flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-[#574F45] dark:text-[#A89F92] pt-2 border-t border-[#0E0D0B]/10 dark:border-white/[0.08]">
              We only use your details to contact you about CHOP.
            </p>
          </div>

          {/* Right Column: Waitlist Form Card with Orange Aura */}
          <div
            className={`lg:col-span-7 relative reveal-item ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '100ms' }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[#E8772E]/18 blur-[64px] animate-breathing-glow"
            />

            <div className="relative chop-card p-6 sm:p-9">
              {submitted ? (
                <div className="py-8 text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#3FA66B]/15 border border-[#3FA66B]/35 flex items-center justify-center">
                      <svg
                        viewBox="0 0 36 36"
                        className="w-8 h-8"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 18.5L15 25.5L28 11.5"
                          stroke="#3FA66B"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="animate-check-path"
                        />
                      </svg>
                    </div>

                    {BURST_PARTICLES.map((p, idx) => (
                      <span
                        key={idx}
                        aria-hidden="true"
                        className={`pointer-events-none absolute rounded-full bg-[#E8772E] animate-particle ${p.size}`}
                        style={
                          {
                            '--tx': p.tx,
                            '--ty': p.ty,
                            animationDelay: p.delay,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0E0D0B] dark:text-[#F7F1E8]">
                      You&apos;re on the list.
                    </h3>
                    <p className="text-base text-[#574F45] dark:text-[#A89F92]">
                      We&apos;ll reach you on WhatsApp when CHOP opens in Ijebu Ode.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="btn-primary-chop w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#E8772E] hover:bg-[#B9441A] active:scale-[0.98] text-[#0E0D0B] font-semibold text-sm px-6 py-3 transition-all cursor-pointer"
                    >
                      {copiedShare ? (
                        <>
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          {typeof navigator !== 'undefined' && 'share' in navigator ? (
                            <Share2 className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Copy className="w-4 h-4" aria-hidden="true" />
                          )}
                          <span>Share CHOP</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-[#0E0D0B]/15 dark:border-white/15 hover:border-[#E8772E] text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] px-6 py-3 transition-colors cursor-pointer"
                    >
                      Add another entry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Segmented Control */}
                  <div
                    role="tablist"
                    aria-label="Waitlist registration type"
                    className="relative grid grid-cols-2 p-1.5 rounded-full bg-[#0E0D0B]/8 dark:bg-white/[0.06] border border-[#0E0D0B]/8 dark:border-white/[0.06]"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-full bg-[#E8772E] shadow-sm transition-transform duration-300 ease-out"
                      style={{
                        transform: isVendor ? 'translateX(100%)' : 'translateX(0%)',
                      }}
                    />

                    <button
                      type="button"
                      role="tab"
                      aria-selected={!isVendor}
                      onClick={() => handleModeChange(WaitlistType.Customer)}
                      className={`relative z-10 rounded-full py-2.5 px-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        !isVendor
                          ? 'text-[#0E0D0B]'
                          : 'text-[#574F45] dark:text-[#A89F92] hover:text-[#0E0D0B] dark:hover:text-[#F7F1E8]'
                      }`}
                    >
                      I&apos;m a customer
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={isVendor}
                      onClick={() => handleModeChange(WaitlistType.Vendor)}
                      className={`relative z-10 rounded-full py-2.5 px-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        isVendor
                          ? 'text-[#0E0D0B]'
                          : 'text-[#574F45] dark:text-[#A89F92] hover:text-[#0E0D0B] dark:hover:text-[#F7F1E8]'
                      }`}
                    >
                      I&apos;m a food business
                    </button>
                  </div>

                  {/* Honeypot field */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="website-field">Website</label>
                    <input
                      id="website-field"
                      type="text"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="chop-full-name"
                      className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                    >
                      Full name <span className="text-[#E8772E]">*</span>
                    </label>
                    <input
                      id="chop-full-name"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (touched.fullName) {
                          setErrors((prev) => ({
                            ...prev,
                            fullName: validateField('fullName', e.target.value),
                          }));
                        }
                      }}
                      onBlur={() => handleBlur('fullName')}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'chop-full-name-error' : undefined}
                      className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] placeholder:text-[#574F45]/60 dark:placeholder:text-[#A89F92]/50 focus:border-[#E8772E] focus:outline-none"
                    />
                    {errors.fullName && (
                      <p
                        id="chop-full-name-error"
                        role="alert"
                        className="mt-1.5 text-xs font-medium text-[#DC2626] dark:text-[#F87171]"
                      >
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label
                      htmlFor="chop-whatsapp"
                      className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                    >
                      WhatsApp number <span className="text-[#E8772E]">*</span>
                    </label>
                    <div className="flex gap-2.5">
                      <label htmlFor="chop-country-code" className="sr-only">
                        Country code
                      </label>
                      <select
                        id="chop-country-code"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-3 py-3 text-sm font-medium text-[#0E0D0B] dark:text-[#F7F1E8] focus:border-[#E8772E] focus:outline-none shrink-0"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>

                      <input
                        id="chop-whatsapp"
                        name="whatsapp"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        value={whatsappInput}
                        onChange={(e) => {
                          setWhatsappInput(e.target.value);
                          if (touched.whatsapp) {
                            setErrors((prev) => ({
                              ...prev,
                              whatsapp: validateField('whatsapp', e.target.value),
                            }));
                          }
                        }}
                        onBlur={() => handleBlur('whatsapp')}
                        aria-invalid={Boolean(errors.whatsapp)}
                        aria-describedby={errors.whatsapp ? 'chop-whatsapp-error' : undefined}
                        className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] placeholder:text-[#574F45]/60 dark:placeholder:text-[#A89F92]/50 focus:border-[#E8772E] focus:outline-none"
                      />
                    </div>
                    {errors.whatsapp && (
                      <p
                        id="chop-whatsapp-error"
                        role="alert"
                        className="mt-1.5 text-xs font-medium text-[#DC2626] dark:text-[#F87171]"
                      >
                        {errors.whatsapp}
                      </p>
                    )}
                  </div>

                  {/* Email & Area Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="chop-email"
                        className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                      >
                        Email{' '}
                        <span className="text-xs font-normal text-[#574F45] dark:text-[#A89F92]">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="chop-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (touched.email) {
                            setErrors((prev) => ({
                              ...prev,
                              email: validateField('email', e.target.value),
                            }));
                          }
                        }}
                        onBlur={() => handleBlur('email')}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'chop-email-error' : undefined}
                        className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] placeholder:text-[#574F45]/60 dark:placeholder:text-[#A89F92]/50 focus:border-[#E8772E] focus:outline-none"
                      />
                      {errors.email && (
                        <p
                          id="chop-email-error"
                          role="alert"
                          className="mt-1.5 text-xs font-medium text-[#DC2626] dark:text-[#F87171]"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="chop-area"
                        className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                      >
                        Area
                      </label>
                      <select
                        id="chop-area"
                        name="area"
                        value={area}
                        onChange={(e) => onAreaChange(e.target.value as AreaOption)}
                        className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] focus:border-[#E8772E] focus:outline-none"
                      >
                        {CHOP_CONFIG.areaOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Mode-Specific Fields */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      !isVendor ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-5 pt-1">
                        {/* Customer-only: Are you a student? */}
                        <div className="space-y-2.5">
                          <span className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8]">
                            Are you a student?
                          </span>
                          <div
                            role="radiogroup"
                            aria-label="Are you a student?"
                            className="flex flex-wrap gap-2"
                          >
                            {STUDENT_OPTIONS.map((option) => {
                              const selected = student === option;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  role="radio"
                                  tabIndex={!isVendor ? 0 : -1}
                                  aria-checked={selected}
                                  onClick={() => setStudent(option)}
                                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                                    selected
                                      ? 'bg-[#E8772E] border-[#E8772E] text-[#0E0D0B] font-semibold'
                                      : 'bg-transparent border-[#0E0D0B]/15 dark:border-white/15 text-[#574F45] dark:text-[#A89F92] hover:border-[#E8772E]/60'
                                  }`}
                                >
                                  {selected && (
                                    <Check
                                      className="w-3.5 h-3.5 animate-[scaleIn_180ms_ease-out]"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <span>{option}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <span className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8]">
                            What do you usually search for?
                          </span>
                        <div className="flex flex-wrap gap-2">
                          {CUSTOMER_CRAVINGS.map((item) => {
                            const selected = cravings.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                tabIndex={!isVendor ? 0 : -1}
                                aria-pressed={selected}
                                onClick={() => toggleCraving(item)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer ${
                                  selected
                                    ? 'bg-[#E8772E] border-[#E8772E] text-[#0E0D0B] font-semibold scale-[1.03]'
                                    : 'bg-transparent border-[#0E0D0B]/15 dark:border-white/15 text-[#574F45] dark:text-[#A89F92] hover:border-[#E8772E]/60 active:scale-95'
                                }`}
                              >
                                {selected && (
                                  <Check
                                    className="w-3.5 h-3.5 animate-[scaleIn_180ms_ease-out]"
                                    aria-hidden="true"
                                  />
                                )}
                                <span>{item}</span>
                              </button>
                            );
                          })}
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isVendor ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-5 pt-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="chop-business-name"
                              className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                            >
                              Business name <span className="text-[#E8772E]">*</span>
                            </label>
                            <input
                              id="chop-business-name"
                              name="businessName"
                              type="text"
                              tabIndex={isVendor ? 0 : -1}
                              required={isVendor}
                              value={businessName}
                              onChange={(e) => {
                                setBusinessName(e.target.value);
                                if (touched.businessName) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    businessName: validateField('businessName', e.target.value),
                                  }));
                                }
                              }}
                              onBlur={() => handleBlur('businessName')}
                              aria-invalid={Boolean(errors.businessName)}
                              aria-describedby={
                                errors.businessName ? 'chop-business-name-error' : undefined
                              }
                              className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] placeholder:text-[#574F45]/60 dark:placeholder:text-[#A89F92]/50 focus:border-[#E8772E] focus:outline-none"
                            />
                            {errors.businessName && (
                              <p
                                id="chop-business-name-error"
                                role="alert"
                                className="mt-1.5 text-xs font-medium text-[#DC2626] dark:text-[#F87171]"
                              >
                                {errors.businessName}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="chop-food-category"
                              className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                            >
                              Food category
                            </label>
                            <select
                              id="chop-food-category"
                              name="foodCategory"
                              tabIndex={isVendor ? 0 : -1}
                              value={foodCategory}
                              onChange={(e) => setFoodCategory(e.target.value)}
                              className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] focus:border-[#E8772E] focus:outline-none"
                            >
                              {FOOD_CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.label}>
                                  {cat.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <span className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2">
                            Do you deliver?
                          </span>
                          <div
                            role="radiogroup"
                            aria-label="Do you deliver?"
                            className="grid grid-cols-3 gap-2 p-1 rounded-full bg-[#0E0D0B]/8 dark:bg-white/[0.06]"
                          >
                            {Object.values(DeliveryPreference).map((opt) => {
                              const active = delivers === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  role="radio"
                                  tabIndex={isVendor ? 0 : -1}
                                  aria-checked={active}
                                  onClick={() => setDelivers(opt)}
                                  className={`rounded-full py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                                    active
                                      ? 'bg-[#E8772E] text-[#0E0D0B]'
                                      : 'text-[#574F45] dark:text-[#A89F92] hover:text-[#0E0D0B] dark:hover:text-[#F7F1E8]'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="chop-landmark"
                            className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                          >
                            Business address or landmark in Ijebu Ode{' '}
                            <span className="text-xs font-normal text-[#574F45] dark:text-[#A89F92]">
                              (optional)
                            </span>
                          </label>
                          <input
                            id="chop-landmark"
                            name="landmark"
                            type="text"
                            tabIndex={isVendor ? 0 : -1}
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] placeholder:text-[#574F45]/60 dark:placeholder:text-[#A89F92]/50 focus:border-[#E8772E] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="chop-operating-model"
                            className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                          >
                            Operating model
                          </label>
                          <select
                            id="chop-operating-model"
                            name="operatingModel"
                            tabIndex={isVendor ? 0 : -1}
                            value={operatingModel}
                            onChange={(e) => setOperatingModel(e.target.value)}
                            className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] focus:border-[#E8772E] focus:outline-none"
                          >
                            <option value="">Select an operating model</option>
                            <option value="Physical location">Physical location</option>
                            <option value="Online">Online</option>
                            <option value="Both">Both</option>
                          </select>
                        </div>

                        <fieldset className="space-y-2">
                          <legend className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8]">
                            Operating locations
                          </legend>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {CHOP_CONFIG.areaOptions.map((option) => {
                              const checked =
                                operatingLocations.includes(option) ||
                                (operatingLocations.length === 0 && area === option);
                              return (
                                <label
                                  key={option}
                                  className="flex min-h-11 items-center gap-2 rounded-xl border border-[#0E0D0B]/10 dark:border-white/10 px-3 text-sm text-[#0E0D0B] dark:text-[#F7F1E8]"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    tabIndex={isVendor ? 0 : -1}
                                    onChange={() => {
                                      const current =
                                        operatingLocations.length > 0
                                          ? operatingLocations
                                          : [area];
                                      setOperatingLocations(
                                        checked
                                          ? current.filter((location) => location !== option)
                                          : [...current, option]
                                      );
                                    }}
                                    className="h-4 w-4 accent-[#E8772E]"
                                  />
                                  {option}
                                </label>
                              );
                            })}
                          </div>
                        </fieldset>

                        <div>
                          <label
                            htmlFor="chop-other-category"
                            className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                          >
                            Other category{' '}
                            <span className="text-xs font-normal text-[#574F45] dark:text-[#A89F92]">
                              (optional)
                            </span>
                          </label>
                          <input
                            id="chop-other-category"
                            name="otherCategory"
                            type="text"
                            tabIndex={isVendor ? 0 : -1}
                            value={otherCategory}
                            onChange={(e) => setOtherCategory(e.target.value)}
                            className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] focus:border-[#E8772E] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="chop-business-description"
                            className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                          >
                            Business description{' '}
                            <span className="text-xs font-normal text-[#574F45] dark:text-[#A89F92]">
                              (optional)
                            </span>
                          </label>
                          <textarea
                            id="chop-business-description"
                            name="businessDescription"
                            rows={3}
                            tabIndex={isVendor ? 0 : -1}
                            value={businessDescription}
                            onChange={(e) => setBusinessDescription(e.target.value)}
                            className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] placeholder:text-[#574F45]/60 dark:placeholder:text-[#A89F92]/50 focus:border-[#E8772E] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="chop-social-link"
                            className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                          >
                            Social media link{' '}
                            <span className="text-xs font-normal text-[#574F45] dark:text-[#A89F92]">
                              (optional)
                            </span>
                          </label>
                          <input
                            id="chop-social-link"
                            name="socialMediaLink"
                            type="url"
                            inputMode="url"
                            tabIndex={isVendor ? 0 : -1}
                            value={socialMediaLink}
                            onChange={(e) => setSocialMediaLink(e.target.value)}
                            className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] placeholder:text-[#574F45]/60 dark:placeholder:text-[#A89F92]/50 focus:border-[#E8772E] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="chop-additional-comments"
                            className="block text-sm font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] mb-2"
                          >
                            Additional comments{' '}
                            <span className="text-xs font-normal text-[#574F45] dark:text-[#A89F92]">
                              (optional)
                            </span>
                          </label>
                          <textarea
                            id="chop-additional-comments"
                            name="additionalComments"
                            rows={3}
                            tabIndex={isVendor ? 0 : -1}
                            value={additionalComments}
                            onChange={(e) => setAdditionalComments(e.target.value)}
                            className="w-full rounded-2xl border border-[#0E0D0B]/15 dark:border-white/12 bg-white/80 dark:bg-[#0E0D0B]/70 px-4 py-3 text-sm sm:text-base text-[#0E0D0B] dark:text-[#F7F1E8] placeholder:text-[#574F45]/60 dark:placeholder:text-[#A89F92]/50 focus:border-[#E8772E] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-start gap-3 text-sm text-[#0E0D0B] dark:text-[#F7F1E8]">
                      <input
                        id="chop-contact-consent"
                        name="contactConsent"
                        type="checkbox"
                        checked={contactConsent}
                        onChange={(e) => {
                          setContactConsent(e.target.checked);
                          if (touched.contactConsent) {
                            setErrors((prev) => ({
                              ...prev,
                              contactConsent: e.target.checked
                                ? undefined
                                : 'Please agree to be contacted about your submission.',
                            }));
                          }
                        }}
                        onBlur={() => {
                          setTouched((prev) => ({ ...prev, contactConsent: true }));
                          setErrors((prev) => ({
                            ...prev,
                            contactConsent: contactConsent
                              ? undefined
                              : 'Please agree to be contacted about your submission.',
                          }));
                        }}
                        aria-invalid={Boolean(errors.contactConsent)}
                        aria-describedby={errors.contactConsent ? 'chop-consent-error' : undefined}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#E8772E]"
                      />
                      <span>
                        I agree to be contacted about my registration or application.
                        <span className="text-[#E8772E]"> *</span>
                      </span>
                    </label>
                    {errors.contactConsent && (
                      <p
                        id="chop-consent-error"
                        role="alert"
                        className="mt-1.5 text-xs font-medium text-[#DC2626] dark:text-[#F87171]"
                      >
                        {errors.contactConsent}
                      </p>
                    )}
                  </div>

                  {errors.submit && (
                    <p
                      role="alert"
                      className="rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/25 px-4 py-3 text-xs sm:text-sm font-medium text-[#DC2626] dark:text-[#F87171]"
                    >
                      {errors.submit}
                    </p>
                  )}

                  <div className="space-y-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary-chop w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#E8772E] hover:bg-[#B9441A] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-[#0E0D0B] font-semibold text-base py-4 px-7 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          <span>Submitting...</span>
                        </>
                      ) : !isVendor ? (
                        'Join the waitlist'
                      ) : (
                        'Apply as a food business'
                      )}
                    </button>

                    <p className="text-xs text-center text-[#574F45] dark:text-[#A89F92]">
                      We only use your details to contact you about CHOP.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
