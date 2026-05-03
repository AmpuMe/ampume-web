import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const SimpleNavbar = ({ transparent = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  const isTransparent = transparent && !scrolled;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 py-6 ${isTransparent ? 'bg-transparent text-white' : 'bg-white text-black shadow-sm'}`}>
        <div className="px-6 md:px-12 grid grid-cols-12 items-center h-full gap-4">
          <div className="col-span-3">
            <Link to="/" className="text-xl md:text-2xl font-semibold tracking-tight uppercase z-50">
              AmpuMe.
            </Link>
          </div>

          <div className="hidden lg:flex col-span-6 justify-center gap-6 xl:gap-12">
            <Link to="/shop" className="text-sm font-medium hover:opacity-70 transition-opacity">AmpuMe Store</Link>
            <Link to="/resources" className="text-sm font-medium hover:opacity-70 transition-opacity">Knowledge Base</Link>
            <Link to="/ask-ampume" className="text-sm font-medium hover:opacity-70 transition-opacity">Ask AmpuMe</Link>
            <Link to="/telemedicine" className="text-sm font-medium hover:opacity-70 transition-opacity">Telemedicine</Link>
          </div>

          <div className="hidden lg:flex col-span-3 justify-end items-center">
             <Link
               to="/contact"
               className={`px-6 pt-[14px] pb-[12px] rounded-full font-bold text-xs uppercase tracking-widest leading-none transition-colors inline-flex items-center justify-center ${isTransparent ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
             >
              Contact
            </Link>
          </div>

          <div className="lg:hidden col-span-9 flex justify-end">
            <button className="p-1 z-50" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-white text-black p-6 flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xl font-semibold tracking-tight uppercase">AmpuMe.</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6 text-xl font-medium">
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>AmpuMe Store</Link>
              <Link to="/resources" onClick={() => setMobileMenuOpen(false)}>Knowledge Base</Link>
              <Link to="/ask-ampume" onClick={() => setMobileMenuOpen(false)}>Ask AmpuMe</Link>
              <Link to="/telemedicine" onClick={() => setMobileMenuOpen(false)}>Telemedicine</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SimpleNavbar;
