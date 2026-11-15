import { lazy, useState } from 'react';
import { DeferredSection } from './components/DeferredSection';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { useTheme } from './hooks/useTheme';
import { AreaOption, WaitlistType } from './types';

const loadProductPreview = () => import('./components/ProductPreview');
const loadCategories = () => import('./components/Categories');
const loadHowItWorks = () => import('./components/HowItWorks');
const loadWhyChop = () => import('./components/WhyChop');
const loadBuiltInIjebuOde = () => import('./components/BuiltInIjebuOde');
const loadStudentsInIjagun = () => import('./components/StudentsInIjagun');
const loadForVendors = () => import('./components/ForVendors');
const loadWaitlistForm = () => import('./components/WaitlistForm');
const loadWaitlistCounter = () => import('./components/WaitlistCounter');
const loadFaq = () => import('./components/Faq');
const loadFinalCta = () => import('./components/FinalCta');
const loadFooter = () => import('./components/Footer');

const ProductPreview = lazy(() => loadProductPreview().then((module) => ({ default: module.ProductPreview })));
const Categories = lazy(() => loadCategories().then((module) => ({ default: module.Categories })));
const HowItWorks = lazy(() => loadHowItWorks().then((module) => ({ default: module.HowItWorks })));
const WhyChop = lazy(() => loadWhyChop().then((module) => ({ default: module.WhyChop })));
const BuiltInIjebuOde = lazy(() =>
  loadBuiltInIjebuOde().then((module) => ({ default: module.BuiltInIjebuOde }))
);
const StudentsInIjagun = lazy(() =>
  loadStudentsInIjagun().then((module) => ({ default: module.StudentsInIjagun }))
);
const ForVendors = lazy(() => loadForVendors().then((module) => ({ default: module.ForVendors })));
const WaitlistForm = lazy(() => loadWaitlistForm().then((module) => ({ default: module.WaitlistForm })));
const WaitlistCounter = lazy(() =>
  loadWaitlistCounter().then((module) => ({ default: module.WaitlistCounter }))
);
const Faq = lazy(() => loadFaq().then((module) => ({ default: module.Faq })));
const FinalCta = lazy(() => loadFinalCta().then((module) => ({ default: module.FinalCta })));
const Footer = lazy(() => loadFooter().then((module) => ({ default: module.Footer })));

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [waitlistMode, setWaitlistMode] = useState<WaitlistType>(WaitlistType.Customer);
  const [selectedArea, setSelectedArea] = useState<AreaOption>(AreaOption.IjebuOde);

  const scrollToWaitlist = (mode?: WaitlistType, area?: AreaOption) => {
    void loadWaitlistForm();
    if (mode) {
      setWaitlistMode(mode);
    }
    if (area) {
      setSelectedArea(area);
    }
    const target = document.getElementById('waitlist');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToVendors = () => {
    setWaitlistMode(WaitlistType.Vendor);
    const target = document.getElementById('for-vendors');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E8] dark:bg-[#0E0D0B] text-[#0E0D0B] dark:text-[#F7F1E8] transition-colors duration-200">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onJoinWaitlist={() => scrollToWaitlist(WaitlistType.Customer)}
      />

      <main>
        <Hero
          onJoinCustomer={() => scrollToWaitlist(WaitlistType.Customer)}
          onJoinVendor={scrollToVendors}
        />
        <DeferredSection id="preview" tone="preview" reservedHeights={[873, 873, 1404, 1484, 960]}>
          <ProductPreview />
        </DeferredSection>
        <DeferredSection id="categories" tone="cream" reservedHeights={[3429, 3320, 1432, 1102, 1030]}>
          <Categories />
        </DeferredSection>
        <DeferredSection id="how-it-works" tone="cream" reservedHeights={[1180, 1180, 961, 793, 780]}>
          <HowItWorks />
        </DeferredSection>
        <DeferredSection id="why-chop" tone="sand" reservedHeights={[1238, 1184, 875, 742, 729]}>
          <WhyChop />
        </DeferredSection>
        <DeferredSection id="ijebu-ode" tone="cream" reservedHeights={[962, 962, 673, 745, 761]}>
          <BuiltInIjebuOde />
        </DeferredSection>
        <DeferredSection
          id="students-ijagun"
          tone="sand"
          reservedHeights={[1396, 1369, 987, 884, 871]}
        >
          <StudentsInIjagun
            onJoinWaitlist={() => scrollToWaitlist(WaitlistType.Customer, AreaOption.Ijagun)}
          />
        </DeferredSection>
        <DeferredSection id="for-vendors" tone="vendors" reservedHeights={[2320, 2298, 1101, 901, 853]}>
          <ForVendors onApplyVendor={() => scrollToWaitlist(WaitlistType.Vendor)} />
        </DeferredSection>
        <DeferredSection id="waitlist" tone="sand" reservedHeights={[1959, 1932, 1521, 1076, 1076]}>
          <WaitlistForm
            mode={waitlistMode}
            onModeChange={setWaitlistMode}
            area={selectedArea}
            onAreaChange={setSelectedArea}
          />
        </DeferredSection>
        <DeferredSection
          id="waitlist-progress"
          tone="counter"
          reservedHeights={[355, 355, 402, 443, 451]}
        >
          <WaitlistCounter />
        </DeferredSection>
        <DeferredSection id="faq" tone="cream" reservedHeights={[1004, 949, 907, 945, 1009]}>
          <Faq />
        </DeferredSection>
        <DeferredSection id="final-cta" tone="orange" reservedHeights={[465, 465, 374, 449, 457]}>
          <FinalCta
            onJoinCustomer={() => scrollToWaitlist(WaitlistType.Customer)}
            onJoinVendor={() => scrollToWaitlist(WaitlistType.Vendor)}
          />
        </DeferredSection>
      </main>

      <DeferredSection id="footer" tone="footer" reservedHeights={[1091, 1063, 629, 571, 514]}>
        <Footer />
      </DeferredSection>
    </div>
  );
}
