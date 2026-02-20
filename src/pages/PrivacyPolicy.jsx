import React from 'react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans pt-32">
      <SEO title="Privacy Policy" url="https://ampume-landing-v3.vercel.app/privacy-policy" />
      <SimpleNavbar />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="mb-4 text-gray-500">Last Updated: December 2025</p>
        <div className="prose max-w-none">
            <p className="mb-4">At AmpuMe, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your information when you use our website and subscribe to our newsletter.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4">We currently only collect information that you voluntarily provide to us, such as your name and email address when you subscribe to our newsletter.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use your information to communicate with you about our launch, updates, and relevant news regarding AmpuMe.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Security</h2>
            <p className="mb-4">We implement reasonable security measures to protect your personal information.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
