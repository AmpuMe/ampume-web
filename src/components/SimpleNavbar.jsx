import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const SimpleNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white text-black shadow-sm py-6">
        <div className="px-6 md:px-12 grid grid-cols-12 items-center h-full gap-4">
          <div className="col-span-3">
            <Link to="/" className="text-xl md:text-2xl font-semibold tracking-tight uppercase z-50">
              AmpuMe.
            </Link>
          </div>

          <div className="hidden lg:flex col-span-6 justify-center gap-12">
            <Link to="/" className="text-sm font-medium hover:opacity-70 transition-opacity">Home</Link>
            <Link to="/shop" className="text-sm font-medium hover:opacity-70 transition-opacity">Shop</Link>
            <Link to="/resources" className="text-sm font-medium hover:opacity-70 transition-opacity">Resources</Link>
            <Link to="/ai-support" className="text-sm font-medium hover:opacity-70 transition-opacity">AI Support</Link>
          </div>

          <div className="hidden lg:flex col-span-3 justify-end items-center">
             <Link
               to="/contact"
               className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors"
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
              <span className="text-2xl font-bold uppercase">AmpuMe.</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6 text-xl font-medium">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
              <Link to="/resources" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
              <Link to="/ai-support" onClick={() => setMobileMenuOpen(false)}>AI Support</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SimpleNavbar;
