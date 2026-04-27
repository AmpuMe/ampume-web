import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Check, Mail, ArrowLeft } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const FadeIn = ({ children, delay = 0, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Formspree handles validation, spam filtering, and email delivery to Alex.
      const response = await fetch('https://formspree.io/f/mkoklola', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Surface Formspree's error message if it returned one
        let msg = 'Failed to send. Please try again.';
        try {
          const data = await response.json();
          if (data?.errors?.[0]?.message) msg = data.errors[0].message;
        } catch { /* ignore JSON parse errors */ }
        throw new Error(msg);
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title="Contact Us | AmpuMe"
        description="Get in touch with the AmpuMe team. We're here to help with product questions, special orders, and more."
        url="https://ampume.com/contact"
      />

      <SimpleNavbar />

      <main className="pt-32 pb-20 px-6 md:px-12">
        <FadeIn className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </FadeIn>

        <div className="max-w-xl">
          <FadeIn>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">
              Contact Us
            </span>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              How can we help?
            </h1>
            <p className="text-gray-600 leading-relaxed mb-8">
              Have a question about products, clinical care, or using AmpuMe? Send us a message and our team will get back to you shortly.
            </p>
          </FadeIn>

          <FadeIn delay={0.05} className="flex items-center gap-3 mb-10 p-4 border border-gray-100 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Or email us directly at</p>
              <a href="mailto:info@ampume.com" className="text-sm font-medium hover:text-gray-600 transition-colors">
                info@ampume.com
              </a>
            </div>
          </FadeIn>

          {success ? (
            <FadeIn>
              <div className="bg-brand-offwhite rounded-lg p-8 md:p-12 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Message Sent</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  We've received your message and will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 text-sm font-medium underline hover:text-gray-600 transition-colors"
                >
                  Send another message
                </button>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="e.g. Product question, Special order, Sizing help"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </FadeIn>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
