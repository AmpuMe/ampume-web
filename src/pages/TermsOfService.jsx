import React from 'react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans pt-32">
      <SEO title="Terms of Service" url="https://ampume-landing-v3.vercel.app/terms-of-service" />
      <SimpleNavbar />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="mb-4 text-gray-500">Last Updated: December 2025</p>
        <div className="prose max-w-none">
            <p className="mb-4">Welcome to AmpuMe. By accessing our website and subscribing to our newsletter, you agree to be bound by these Terms of Service.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Use of Service</h2>
            <p className="mb-4">You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Intellectual Property</h2>
            <p className="mb-4">The content on this website, including text, graphics, logos, and images, is the property of AmpuMe and is protected by copyright laws.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Disclaimer</h2>
            <p className="mb-4">The materials on AmpuMe's website are provided on an 'as is' basis. AmpuMe makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitations</h2>
            <p className="mb-4">In no event shall AmpuMe or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AmpuMe's website.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
