import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 md:px-12 border-t border-white/10">
      <div className="grid grid-cols-12 gap-8 mb-24">
        <div className="col-span-12 md:col-span-3">
          <Link to="/" className="text-2xl font-bold uppercase tracking-tight mb-8 block">AmpuMe.</Link>
          <div className="text-sm text-gray-400 space-y-2">
            <p>The all-in-one platform for</p>
            <p>life after limb loss.</p>
          </div>
        </div>
        
        <div className="col-span-6 md:col-span-2 md:col-start-10">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-8 text-gray-400">Platform</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/shop" className="hover:text-white transition-colors text-gray-300">AmpuMe Store</Link></li>
            <li><Link to="/resources" className="hover:text-white transition-colors text-gray-300">Knowledge Base</Link></li>
            <li><Link to="/ai-support" className="hover:text-white transition-colors text-gray-300">AI Support</Link></li>
            <li><Link to="/telemedicine" className="hover:text-white transition-colors text-gray-300">Telemedicine</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors text-gray-300">Contact</Link></li>
          </ul>
        </div>

      </div>
      
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <p>&copy; 2025 AmpuMe, Inc. All Rights Reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/accessibility-statement" className="hover:text-white transition-colors">Accessibility Statement</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
