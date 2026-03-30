import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, MessageSquare, Send } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import NewsletterModal from '../components/NewsletterModal';
import heroImage from '../assets/new-hero-3.webp';
import marketplaceImage from '../assets/shop.webp';
import peopleImage from '../assets/people.webp';
import friendsImage from '../assets/friends.webp';
import cardPhoto from '../assets/support.webp';

const FadeIn = ({ children, delay = 0, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Resources', href: '/resources' },
    { name: 'AI Support', href: '/ai-support' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavClick = (href) => {
    navigate(href);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-white text-brand-black font-sans">
      <SEO
        title="Home"
        description="AmpuMe is the all-in-one platform for life after limb loss. Explore prosthetic essentials, expert guidance, AI support, and a growing community."
      />
      <NewsletterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white text-black shadow-sm py-6' : 'bg-transparent text-white py-6'}`}>
        <div className="px-6 md:px-12 grid grid-cols-12 items-center h-full gap-4">
          <div className="col-span-3">
            <a href="#" className="text-xl md:text-2xl font-semibold tracking-tight uppercase z-50">
              AmpuMe.
            </a>
          </div>

          <div className="hidden lg:flex col-span-6 justify-center gap-6 xl:gap-12">
            {navLinks.map(link => (
              <button key={link.name} onClick={() => handleNavClick(link.href)} className="text-sm font-medium hover:opacity-70 transition-opacity">
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex col-span-3 justify-end items-center">
            <button
              onClick={() => handleNavClick('/contact')}
              className={`px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-colors ${scrolled ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              Contact
            </button>
          </div>

          <div className="lg:hidden col-span-9 flex justify-end">
            <button className="p-1 z-50" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-white text-black p-6 flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-bold uppercase">AmpuMe.</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6 text-xl font-medium">
              {navLinks.map(link => (
                <button key={link.name} onClick={() => { setMobileMenuOpen(false); handleNavClick(link.href); }} className="text-left">
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover object-[85%_center] md:object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
        </div>

        <div className="relative z-10 h-full px-6 md:px-12 grid grid-cols-12 items-end pb-24 text-white">
          <FadeIn className="col-span-12 md:col-span-8 lg:col-span-7">
            <h1 className="text-4xl sm:text-5xl md:text-7xl min-[1070px]:text-8xl 2xl:text-[6.5rem] font-medium leading-[1.1] md:leading-[0.9] tracking-tight mb-8">
              The all-in-one platform <span className="text-brand-white opacity-90">for life after limb&nbsp;loss.</span>
            </h1>
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mt-12">
              <button
                onClick={() => scrollToSection('platform')}
                className="bg-white text-black px-10 py-4 rounded-full font-medium text-sm hover:bg-brand-offwhite transition-colors whitespace-nowrap"
              >
                Explore AmpuMe
              </button>
              <p className="text-lg font-light text-white/80 max-w-sm leading-relaxed">
                Explore practical resources, expert guidance, prosthetic essentials, and a growing community — all in one place.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Platform Grid */}
      <section id="platform" className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-16">
            <h3 className="text-2xl font-medium">The Platform</h3>
            <span className="hidden md:block text-sm text-gray-400">Everything you need</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Ask — Position 1 */}
            <FadeIn id="ai-support" onClick={() => navigate('/ai-support')} delay={0} className="group relative h-[500px] md:h-[600px] overflow-hidden cursor-pointer scroll-mt-32">
              <img src={friendsImage} loading="lazy" alt="AI Support" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500"></div>
              <div className="absolute top-8 left-8 z-10 flex gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1">Ask</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                <h4 className="text-3xl font-medium mb-3">Ask Anything</h4>
                <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
                  <p className="text-sm text-white/90 leading-relaxed mb-4">
                    Trusted answers about prosthetics, care, and daily life — powered by AI trained on expert resources.
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-colors">Ask <ArrowRight size={14} /></span>
                </div>
              </div>
            </FadeIn>

            {/* Shop — Position 2 */}
            <Link to="/shop">
              <FadeIn id="marketplace" delay={0.1} className="group relative h-[500px] md:h-[600px] overflow-hidden cursor-pointer scroll-mt-32">
                <img src={marketplaceImage} loading="lazy" alt="Shop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500"></div>
                <div className="absolute top-8 left-8 z-10 flex gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1">Shop</span>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                  <h4 className="text-3xl font-medium mb-3">Shop Prosthetic Essentials</h4>
                  <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
                    <p className="text-sm text-white/90 leading-relaxed mb-4">
                      Liners, sleeves, socks, and everyday prosthetic essentials — delivered directly to you.
                    </p>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1">Shop <ArrowRight size={14} /></span>
                  </div>
                </div>
              </FadeIn>
            </Link>

            {/* Learn & Connect — Position 3 */}
            <FadeIn id="resources" delay={0.2} className="group relative h-[500px] md:h-[600px] overflow-hidden cursor-pointer scroll-mt-32" onClick={() => navigate('/resources')}>
              <img src={peopleImage} loading="lazy" alt="Resources" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500"></div>
              <div className="absolute top-8 left-8 z-10 flex gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1">Learn and Connect</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                <h4 className="text-3xl font-medium mb-3">Knowledge Hub</h4>
                <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
                  <p className="text-sm text-white/90 leading-relaxed mb-4">
                    Articles, expert guidance, and community resources for life with limb loss.
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-colors">Explore <ArrowRight size={14} /></span>
                </div>
              </div>
            </FadeIn>

            {/* Telehealth — Position 4 */}
            <FadeIn id="telehealth" onClick={() => setModalOpen(true)} delay={0.3} className="group relative h-[500px] md:h-[600px] overflow-hidden cursor-pointer scroll-mt-32">
              <img src={cardPhoto} loading="lazy" alt="Telehealth" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500"></div>
              <div className="absolute top-8 left-8 z-10 flex gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1">Care</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                <h4 className="text-3xl font-medium mb-3">Telehealth</h4>
                <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
                  <p className="text-sm text-white/90 leading-relaxed mb-4">
                    Connect with doctors, prosthetists, and therapists who specialize in limb loss.
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1">Join Waitlist <ArrowRight size={14} /></span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Proof of Platform — Shop Preview */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white border-t border-gray-100">
        <FadeIn className="max-w-6xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">Shop</span>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <h3 className="text-3xl md:text-4xl font-light tracking-tight">Prosthetic Essentials</h3>
            <Link to="/shop" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Browse Shop <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Alpha Classic Cushion Liner', desc: 'Trusted liner with adaptive gel for comfortable, secure fit.', href: '/shop/liners' },
              { name: 'ProFlex Suspension Sleeve', desc: 'Reliable suspension for below-knee prosthetic systems.', href: '/shop/sleeves' },
              { name: 'Knit-Rite Prosthetic Socks', desc: 'Manage limb volume changes with breathable knit construction.', href: '/shop/socks' },
            ].map((product, i) => (
              <Link key={i} to={product.href} className="group border border-gray-100 rounded-lg p-6 hover:border-gray-300 transition-all">
                <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-300 text-sm">Product Image</span>
                </div>
                <h4 className="text-base font-medium mb-2 group-hover:text-gray-600 transition-colors">{product.name}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{product.desc}</p>
              </Link>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Proof of Platform — Resources Preview */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-brand-offwhite">
        <FadeIn className="max-w-6xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">Resources</span>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <h3 className="text-3xl md:text-4xl font-light tracking-tight">Expert Guidance</h3>
            <Link to="/resources" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Explore Resources <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { pillar: 'Performance & Recovery', title: 'Strength, gait, balance, and injury prevention resources.' },
              { pillar: 'Prosthetic Care', title: 'Fit, liners, skin health, and maintenance guides.' },
              { pillar: 'Insurance & Coverage', title: 'Benefits, approvals, and financial guidance.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-lg p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">{item.pillar}</span>
                <p className="text-sm text-gray-600 leading-relaxed">{item.title}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Proof of Platform — AI Support Preview */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white border-t border-gray-100">
        <FadeIn className="max-w-6xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">AI Support</span>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-3">Ask Anything</h3>
              <p className="text-gray-500 max-w-lg">Ask questions about prosthetics, care, and daily life — and get clear answers instantly.</p>
            </div>
            <Link to="/ai-support" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Try AI Support <ArrowRight size={14} />
            </Link>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden max-w-2xl">
            {/* Chat mockup header */}
            <div className="bg-black text-white px-6 py-4 flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-medium">AmpuMe AI Support</span>
            </div>
            {/* Sample conversation */}
            <div className="p-6 space-y-4">
              <div className="flex justify-end">
                <div className="bg-black text-white rounded-2xl rounded-br-md px-4 py-3 max-w-xs">
                  <p className="text-sm">How often should I replace my liner?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-sm">
                  <p className="text-sm text-gray-700">Most prosthetic liners should be replaced every 6-12 months depending on usage, activity level, and material wear. Signs it's time include...</p>
                </div>
              </div>
            </div>
            {/* Prompt suggestions */}
            <div className="px-6 pb-6 flex flex-wrap gap-2">
              {['Why is my residual limb irritated?', 'What does Medicare cover?', 'Tips for phantom limb pain'].map((prompt, i) => (
                <Link key={i} to="/ai-support" className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:border-gray-400 transition-colors">
                  {prompt}
                </Link>
              ))}
            </div>
            {/* Input mockup */}
            <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3">
              <input type="text" disabled placeholder="Ask a question..." className="flex-1 text-sm text-gray-400 bg-transparent outline-none" />
              <Send className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
