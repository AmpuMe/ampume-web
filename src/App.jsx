import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AISupport from './pages/AISupport';
import ChatWidget from './components/ChatWidget';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

// Lazy load secondary pages for better performance
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AccessibilityStatement = lazy(() => import('./pages/AccessibilityStatement'));

// Lazy load shop pages
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));

// Lazy load resource pages
const ResourcesHub = lazy(() => import('./pages/ResourcesHub'));
const PillarPage = lazy(() => import('./pages/PillarPage'));
const ResourceDetail = lazy(() => import('./pages/ResourceDetail'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

const App = () => {
  const location = useLocation();
  const showChatWidget = location.pathname !== '/ai-support' && !location.pathname.startsWith('/shop');

  return (
    <CartProvider>
      <ScrollToTop />
      {showChatWidget && <ChatWidget />}
      <CartDrawer />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ai-support" element={<AISupport />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:handle" element={<ProductPage />} />
          <Route path="/resources" element={<ResourcesHub />} />
          <Route path="/resources/:pillarSlug" element={<PillarPage />} />
          <Route path="/resources/:pillarSlug/:resourceSlug" element={<ResourceDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
        </Routes>
      </Suspense>
    </CartProvider>
  );
};

export default App;