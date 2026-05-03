import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AISupport from './pages/AISupport';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

// All page components are imported eagerly. We previously lazy-loaded most
// of these, but React.lazy() falls back to the Suspense placeholder during
// SSR (renderToString), which made every prerendered route ship without its
// SEO tags or body content. Eager imports give us proper static rendering
// at the cost of a slightly larger initial JS bundle — a net win because
// the prerendered HTML now serves crawlers instantly.
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AccessibilityStatement from './pages/AccessibilityStatement';
import ShopPage from './pages/ShopPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import ContactPage from './pages/ContactPage';
import TelemedicinePage from './pages/TelemedicinePage';
import ResourcesHub from './pages/ResourcesHub';
import PillarPage from './pages/PillarPage';
import ResourceDetail from './pages/ResourceDetail';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Instant jump — CSS scroll-behavior: smooth would otherwise animate
      // from wherever the user left off (looks like a bottom-to-top scroll).
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <CartProvider>
      <ScrollToTop />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ask-ampume" element={<AISupport />} />
        {/* Legacy: client-side fallback in case a request slips past the
            Vercel-level 301 redirect (vercel.json). */}
        <Route path="/ai-support" element={<Navigate to="/ask-ampume" replace />} />
        <Route path="/telemedicine" element={<TelemedicinePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/liners" element={<CategoryPage />} />
        <Route path="/shop/socks" element={<CategoryPage />} />
        <Route path="/shop/sleeves" element={<CategoryPage />} />
        <Route path="/shop/accessories" element={<CategoryPage />} />
        <Route path="/shop/:handle" element={<ProductPage />} />
        <Route path="/resources" element={<ResourcesHub />} />
        <Route path="/resources/:pillarSlug" element={<PillarPage />} />
        <Route path="/resources/:pillarSlug/:resourceSlug" element={<ResourceDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
      </Routes>
    </CartProvider>
  );
};

export default App;
