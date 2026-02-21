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
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

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

  // Force-hide the CustomGPT widget on pages where it shouldn't show (it can persist after unmount)
  useEffect(() => {
    if (!showChatWidget) {
      const hide = () => {
        const el = document.getElementById('customgpt_chat_widget');
        if (el) el.style.display = 'none';
        document.querySelectorAll('body > iframe').forEach(f => {
          if (f.src && f.src.includes('customgpt')) f.style.display = 'none';
        });
      };
      hide();
      // Re-check after a delay in case the widget loads late
      const t = setTimeout(hide, 2000);
      return () => clearTimeout(t);
    } else {
      const el = document.getElementById('customgpt_chat_widget');
      if (el) el.style.display = '';
      document.querySelectorAll('body > iframe').forEach(f => {
        if (f.src && f.src.includes('customgpt')) f.style.display = '';
      });
    }
  }, [showChatWidget]);

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