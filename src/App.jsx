import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AISupport from './pages/AISupport';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

// Lazy load secondary pages for better performance
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AccessibilityStatement = lazy(() => import('./pages/AccessibilityStatement'));

// Lazy load shop pages
const ShopPage = lazy(() => import('./pages/ShopPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Lazy load resource pages
const TelemedicinePage = lazy(() => import('./pages/TelemedicinePage'));
const ResourcesHub = lazy(() => import('./pages/ResourcesHub'));
const PillarPage = lazy(() => import('./pages/PillarPage'));
const ResourceDetail = lazy(() => import('./pages/ResourceDetail'));

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
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ai-support" element={<AISupport />} />
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
      </Suspense>
    </CartProvider>
  );
};

export default App;