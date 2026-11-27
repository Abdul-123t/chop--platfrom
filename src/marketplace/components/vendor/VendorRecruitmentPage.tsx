import React, { useState } from 'react';
import {
  Store,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { LocationArea } from '../../types';
import { SERVICE_LOCATIONS, VENDOR_TYPES } from '../../lib/constants';

export const VendorRecruitmentPage: React.FC = () => {
  const {
    submitVendorApplication,
    checkApplicationStatus,
    vendorApplications,
    setActiveView,
    selectedLocation,
  } = useStore();

  // Form Fields
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Restaurant');
  const [locationArea, setLocationArea] = useState<LocationArea>(
    selectedLocation === 'ijagun' ? 'ijagun' : 'ijebu-ode'
  );
  const [specificAddress, setSpecificAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [foodCategoriesInput, setFoodCategoriesInput] = useState('');
  const [fulfillmentOptions, setFulfillmentOptions] = useState<'pickup' | 'delivery' | 'both'>('both');
  const [openingHours, setOpeningHours] = useState('8:00 AM - 9:00 PM');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successApp, setSuccessApp] = useState<{ id: string; referenceNumber: string; businessName: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Status check tab
  const [checkPhoneOrEmail, setCheckPhoneOrEmail] = useState('');
  const [foundApplication, setFoundApplication] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!businessName.trim() || !ownerName.trim()) {
      setErrorMessage('Please provide both business and owner names.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMessage('Please provide a valid Nigerian contact phone number.');
      return;
    }
    if (!specificAddress.trim() || !landmark.trim()) {
      setErrorMessage('Please provide your exact business address and a recognisable landmark.');
      return;
    }

    try {
      setIsSubmitting(true);
      const app = await submitVendorApplication({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        businessCategory,
        locationArea,
        specificAddress: specificAddress.trim(),
        landmark: landmark.trim(),
        description: description.trim() || `Specialist ${businessCategory} based in ${SERVICE_LOCATIONS[locationArea].name}.`,
        foodCategories: foodCategoriesInput
          ? foodCategoriesInput.split(',').map(s => s.trim()).filter(Boolean)
          : [businessCategory],
        fulfillmentOptions,
        openingHours: openingHours.trim(),
      });

      setSuccessApp({
        id: app.id,
        referenceNumber: app.referenceNumber,
        businessName: app.businessName,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = checkPhoneOrEmail.trim();
    if (!query) return;
    if (query.replace(/\D/g, '').length < 10) {
      setFoundApplication('not_found');
      return;
    }
    try {
      const result = await checkApplicationStatus(query);
      if (!result) {
        setFoundApplication('not_found');
        return;
      }
      const local = vendorApplications.find((app) => app.referenceNumber === result.reference);
      setFoundApplication({
        id: result.reference,
        referenceNumber: result.reference,
        businessName: result.businessName,
        status: result.status,
        createdAt: result.submittedAt,
        locationArea: local?.locationArea,
        businessCategory: local?.businessCategory ?? 'Food business',
        specificAddress: local?.specificAddress ?? 'your business address',
        accountReady: result.accountReady,
      });
    } catch {
      setFoundApplication('not_found');
    }
  };

  return (
    <div className="bg-[#F7F6F2] min-h-screen pb-20">
      
      {/* Hero Banner */}
      <section className="pt-12 pb-16 border-b border-[#E6E2DA] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C45B3A]/10 text-[#C45B3A] text-xs font-bold">
              <Store className="w-3.5 h-3.5" />
              <span>Founding Kitchen Cohort &bull; Ijebu Ode & Ijagun</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-black text-[#141414] tracking-tight leading-tight">
              Your food deserves a <br />
              <span className="text-[#C45B3A]">bigger audience.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#77736C] leading-relaxed">
              Bring your kitchen, restaurant or food business to CHOP and connect with customers across Ijebu Ode and Ijagun.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#vendor-form"
                className="py-3 px-6 rounded-full bg-[#141414] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Become a Founding Vendor</span>
                <ArrowRight className="w-4 h-4 text-[#C45B3A]" />
              </a>

              <a
                href="#status-tracker"
                className="py-3 px-6 rounded-full bg-[#F0EEE8] text-[#191919] text-xs sm:text-sm font-semibold hover:bg-[#E6E2DA] transition-all"
              >
                Check Application Status
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Genuine Benefits Section */}
      <section className="py-16 border-b border-[#E6E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C45B3A]">
              Why Partner With CHOP
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#141414] mt-1">
              Engineered for local food businesses
            </h2>
            <p className="text-xs sm:text-sm text-[#77736C] mt-2">
              We do not impose predatory fees or artificial algorithms. Our mission is celebrating genuine Ijebu cuisine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-[#E6E2DA] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F0EEE8] text-[#C45B3A] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#141414]">
                Reach Students & Residents
              </h3>
              <p className="text-xs sm:text-sm text-[#77736C] leading-relaxed">
                Connect directly with university students across TASUED / Ijagun hostels and town residents across Ijebu Ode.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E6E2DA] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F0EEE8] text-[#141414] flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#141414]">
                Full Order Control
              </h3>
              <p className="text-xs sm:text-sm text-[#77736C] leading-relaxed">
                Accept, prepare, or pause your store whenever your kitchen gets busy. You control your prep times, prices, and availability.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E6E2DA] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F0EEE8] text-[#C45B3A] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#141414]">
                Verified Digital Storefront
              </h3>
              <p className="text-xs sm:text-sm text-[#77736C] leading-relaxed">
                Receive a dedicated, mobile-friendly digital menu link to share with customers via WhatsApp, Instagram, and local flyers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Structured Application Form */}
      <section id="vendor-form" className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl border border-[#E6E2DA] p-6 sm:p-10 shadow-sm space-y-6">
            
            <div className="pb-4 border-b border-[#E6E2DA]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C45B3A]">
                Founding Vendor Onboarding
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#141414] mt-1">
                Vendor Application Form
              </h2>
              <p className="text-xs sm:text-sm text-[#77736C] mt-1">
                Fill in your accurate business details. Applications are reviewed manually by CHOP operations.
              </p>
            </div>

            {successApp ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#141414]">
                  Application Received!
                </h3>
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#F7F6F2] border border-[#E6E2DA] space-y-2 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C] block">
                    Official Reference Number
                  </span>
                  <div className="font-mono text-base font-extrabold text-[#141414] bg-white px-3 py-1.5 rounded-xl border border-[#E6E2DA] inline-block">
                    {successApp.referenceNumber}
                  </div>
                  <p className="text-[#77736C] pt-1">
                    Save this reference number to check your verification status at any time. Our operations team will reach out for physical kitchen inspection in Ijebu Ode / Ijagun.
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSuccessApp(null);
                      setBusinessName('');
                      setSpecificAddress('');
                    }}
                    className="py-2.5 px-5 rounded-full bg-[#F0EEE8] text-xs font-semibold text-[#191919]"
                  >
                    Submit Another Application
                  </button>
                  <button
                    onClick={() => setActiveView('vendor-workspace')}
                    className="py-2.5 px-5 rounded-full bg-[#141414] text-white text-xs font-semibold hover:bg-black"
                  >
                    Preview Vendor Workspace &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Business Name & Owner Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Business / Kitchen Name <span className="text-[#C45B3A]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Mama Caro Bukka or Ijagun Grills"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none focus:border-[#141414]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Owner / Manager Full Name <span className="text-[#C45B3A]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Caroline Olusola"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      WhatsApp / Phone Contact <span className="text-[#C45B3A]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="080 1234 5678"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none focus:border-[#141414]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Business Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kitchen@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                </div>

                {/* Business Category & Service Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Business Type
                    </label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none"
                    >
                      {VENDOR_TYPES.map((vt) => (
                        <option key={vt.id} value={vt.name}>
                          {vt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Official Service Location <span className="text-[#C45B3A]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLocationArea('ijebu-ode')}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                          locationArea === 'ijebu-ode'
                            ? 'bg-[#141414] text-white border-[#141414]'
                            : 'bg-[#F7F6F2] text-[#191919] border-[#E6E2DA]'
                        }`}
                      >
                        Ijebu Ode
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocationArea('ijagun')}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                          locationArea === 'ijagun'
                            ? 'bg-[#141414] text-white border-[#141414]'
                            : 'bg-[#F7F6F2] text-[#191919] border-[#E6E2DA]'
                        }`}
                      >
                        Ijagun
                      </button>
                    </div>
                  </div>
                </div>

                {/* Specific Address & Landmark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Physical Kitchen Address <span className="text-[#C45B3A]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={specificAddress}
                      onChange={(e) => setSpecificAddress(e.target.value)}
                      placeholder="e.g. 24 Folagbade Street or New Road"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none focus:border-[#141414]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Recognisable Landmark <span className="text-[#C45B3A]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near TASUED Express Gate or Bovas"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                </div>

                {/* Fulfillment & Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Available Fulfillment
                    </label>
                    <select
                      value={fulfillmentOptions}
                      onChange={(e) => setFulfillmentOptions(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none"
                    >
                      <option value="both">Both Delivery & Pickup</option>
                      <option value="delivery">Delivery Only</option>
                      <option value="pickup">Pickup Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Typical Operating Hours
                    </label>
                    <input
                      type="text"
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                      placeholder="e.g. 8:00 AM - 10:00 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                </div>

                {/* Food Categories & Specialties */}
                <div>
                  <label className="block text-xs font-semibold text-[#191919] mb-1">
                    Speciality Dishes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={foodCategoriesInput}
                    onChange={(e) => setFoodCategoriesInput(e.target.value)}
                    placeholder="e.g. Pounded Yam, Smoky Party Jollof, Peppered Asun, Plantain"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none focus:border-[#141414]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#191919] mb-1">
                    Brief Kitchen Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us what makes your food special..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none focus:border-[#141414]"
                  />
                </div>

                <p className="text-[11px] text-[#77736C]">
                  By submitting, you agree that CHOP can contact you on WhatsApp or email about your application.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#141414] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <span>Submit Application for Review &rarr;</span>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* Application Status Checker */}
          <div id="status-tracker" className="mt-12 bg-white rounded-3xl border border-[#E6E2DA] p-6 sm:p-8 space-y-4">
            <h3 className="font-display text-lg font-bold text-[#141414]">
              Track Application Status
            </h3>
            <p className="text-xs text-[#77736C]">
              Already submitted an application? Enter the WhatsApp number you applied with to check your verification progress.
            </p>

            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <input
                type="text"
                value={checkPhoneOrEmail}
                onChange={(e) => setCheckPhoneOrEmail(e.target.value)}
                placeholder="WhatsApp number, e.g. 0801 234 5678"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none"
              />
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black"
              >
                Track Status
              </button>
            </form>

            {foundApplication === 'not_found' && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                No application found for that number. Use the same WhatsApp number you applied with.
              </p>
            )}

            {foundApplication && foundApplication !== 'not_found' && (
              <div className="p-5 rounded-2xl bg-[#F7F6F2] border border-[#E6E2DA] space-y-3 text-xs">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-[#77736C] block">
                      Ref: {foundApplication.referenceNumber || foundApplication.id}
                    </span>
                    <h4 className="font-display font-bold text-base text-[#141414] mt-0.5">
                      {foundApplication.businessName}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    foundApplication.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : foundApplication.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : foundApplication.status === 'needs_info'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-[#F0EEE8] text-[#141414]'
                  }`}>
                    {foundApplication.status.replace(/_/g, ' ')}
                  </span>
                </div>
                
                <p className="text-[#77736C]">
                  {foundApplication.locationArea ? `Hub: ${SERVICE_LOCATIONS[foundApplication.locationArea as LocationArea]?.name} \u2022 ` : ''}Type: {foundApplication.businessCategory} &bull; Submitted: {new Date(foundApplication.createdAt).toLocaleDateString()}
                </p>

                {foundApplication.status === 'approved' && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    <p className="font-bold">Congratulations! Your kitchen application is approved.</p>
                    <p className="mt-0.5">
                      {foundApplication.accountReady
                        ? 'Your vendor account is ready. Use the setup link we sent you, then sign in to set up your menu and go live.'
                        : 'We will send your setup link on WhatsApp or email shortly. After that you can sign in to set up your menu.'}
                    </p>
                    <button
                      onClick={() => setActiveView('vendor-workspace')}
                      className="mt-2 py-1.5 px-3 rounded-lg bg-emerald-700 text-white font-semibold text-[11px] hover:bg-emerald-800"
                    >
                      Open vendor portal &rarr;
                    </button>
                  </div>
                )}

                {foundApplication.status === 'pending' && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    <p className="font-bold">Application Pending Physical Verification</p>
                    <p className="mt-0.5">A CHOP partner onboarding specialist is reviewing your kitchen address ({foundApplication.specificAddress}) and will contact you via WhatsApp.</p>
                  </div>
                )}

                {foundApplication.adminFeedback && (
                  <div className="text-xs text-[#191919] bg-white p-3 rounded-xl border border-[#E6E2DA] space-y-1">
                    <span className="font-bold text-[#77736C] block">Operations Feedback:</span>
                    <p>{foundApplication.adminFeedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
