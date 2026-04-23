import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, MessageSquare, Send, Play, FileText, ArrowUpRight, Bot, User } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import NewsletterModal from '../components/NewsletterModal';
import heroImage from '../assets/new-hero-3.webp';
import marketplaceImage from '../assets/shop.webp';
import peopleImage from '../assets/people-v2.webp';
import friendsImage from '../assets/friends.webp';
import cardPhoto from '../assets/support.webp';
import telehealthImage from '../assets/telehealth-v2.webp';
import categoryLiners from '../assets/shop/category-liners.webp';
import categorySleeves from '../assets/shop/category-sleeves-v2.webp';
import categorySocks from '../assets/shop/category-socks-v13.webp';

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
    { name: 'AmpuMe Store', href: '/shop' },
    { name: 'Knowledge Base', href: '/resources' },
    { name: 'Ask AmpuMe', href: '/ai-support' },
    { name: 'Telemedicine', href: '/telemedicine' },
  ];

  const handleNavClick = (href) => {
    navigate(href);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-white text-brand-black font-sans">
      <SEO
        title="Home"
        description="AmpuMe is the all-in-one platform for life with limb loss. Explore prosthetic essentials, expert guidance, AI support, and a growing community."
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
              className={`px-6 pt-[14px] pb-[12px] rounded-full font-bold text-xs uppercase tracking-widest leading-none transition-colors inline-flex items-center justify-center ${scrolled ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200'}`}
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
              <span className="text-xl font-semibold tracking-tight uppercase">AmpuMe.</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6 text-xl font-medium">
              {navLinks.map(link => (
                <button key={link.name} onClick={() => { setMobileMenuOpen(false); handleNavClick(link.href); }} className="text-left">
                  {link.name}
                </button>
              ))}
              <button onClick={() => { setMobileMenuOpen(false); handleNavClick('/contact'); }} className="text-left">
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover object-[86%_center] md:object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
        </div>

        <div className="relative z-10 h-full px-6 md:px-12 grid grid-cols-12 items-end pb-24 text-white">
          <FadeIn className="col-span-12 md:col-span-8 lg:col-span-7">
            <h1 className="text-4xl sm:text-5xl md:text-7xl min-[1070px]:text-8xl 2xl:text-[6.5rem] font-medium leading-[1.1] md:leading-[0.9] tracking-tight mb-8">
              The all-in-one platform <span className="text-brand-white opacity-90">for life with limb&nbsp;loss.</span>
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

      {/* Mission / Intro */}
      <section className="pt-16 md:pt-24 pb-2 md:pb-4 px-6 md:px-12 bg-white">
        <FadeIn>
          <h3 className="text-3xl md:text-4xl font-medium tracking-tight max-w-3xl">Everything you need—built around real life with limb loss.</h3>
          <p className="text-base md:text-lg text-gray-500 mt-4 max-w-2xl">Explore trusted products, expert guidance, and personalized support—all in one place.</p>
        </FadeIn>
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
                <span className="text-[11px] font-bold uppercase tracking-widest bg-white text-black px-3 pt-[7px] pb-[5px] leading-none">Ask</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                <h4 className="text-3xl font-medium mb-3">Ask AmpuMe</h4>
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
                  <span className="text-[11px] font-bold uppercase tracking-widest bg-white text-black px-3 pt-[7px] pb-[5px] leading-none">Store</span>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                  <h4 className="text-3xl font-medium mb-3">AmpuMe Store</h4>
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
                <span className="text-[11px] font-bold uppercase tracking-widest bg-white text-black px-3 pt-[7px] pb-[5px] leading-none">Learn and Connect</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                <h4 className="text-3xl font-medium mb-3">Knowledge Base</h4>
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
              <img src={telehealthImage} loading="lazy" alt="Telehealth" className="w-full h-full object-cover object-[70%_center] md:object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500"></div>
              <div className="absolute top-8 left-8 z-10 flex gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest bg-white text-black px-3 pt-[7px] pb-[5px] leading-none">Care</span>
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

      {/* ── Proof of Platform: Shop ─────────────────────────────── */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-brand-offwhite">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-16">
            <div>
              <h3 className="text-2xl font-medium">AmpuMe Store</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-lg hidden md:block">Liners, sleeves, socks, and care products — thoughtfully selected for fit, function, and durability.</p>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Browse Store <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag: 'Liners', name: 'Prosthetic Liners', desc: 'Prosthetic liners designed for comfort, protection, and secure fit.', href: '/shop/liners', img: categoryLiners, pos: 'object-center' },
              { tag: 'Sleeves', name: 'Prosthetic Sleeves', desc: 'Prosthetic sleeves designed to maintain suspension and keep your prosthesis secure and comfortable.', href: '/shop/sleeves', img: categorySleeves, pos: 'object-[60%_center]' },
              { tag: 'Socks', name: 'Prosthetic Socks', desc: 'Manage socket fit and daily limb volume changes with prosthetic socks designed for comfort and control.', href: '/shop/socks', img: categorySocks, pos: 'object-center' },
            ].map((product, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Link to={product.href} className="group relative block h-[350px] md:h-[500px] overflow-hidden cursor-pointer">
                  <img src={product.img} alt={product.name} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${product.pos || 'object-center'}`} />
                  <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500" />
                  <span className="absolute top-8 left-8 z-10 text-[11px] font-bold uppercase tracking-widest bg-white text-black px-3 pt-[7px] pb-[5px] leading-none">
                    {product.tag}
                  </span>
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                    <h4 className="text-3xl font-medium mb-3">{product.name}</h4>
                    <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
                      <p className="text-sm text-white/90 leading-relaxed mb-4">{product.desc}</p>
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-colors">
                        Shop Now <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <div className="mt-8 md:hidden text-center">
            <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Browse Store <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Proof of Platform: Resources ──────────────────────── */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-16">
            <div>
              <h3 className="text-2xl font-medium">Knowledge Base</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-lg hidden md:block">Articles, videos, and guides covering prosthetic care, recovery, insurance, and everyday life.</p>
            </div>
            <Link to="/resources" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Explore Knowledge Base <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { pillar: 'Prosthetic Care', title: 'A Daily Prosthetic Care Routine That Actually Works', desc: 'Build a practical daily routine for liner cleaning, skin inspection, and socket maintenance.', img: '/images/articles/care-routine-cover.webp', href: '/resources/prosthetic-care/daily-prosthetic-care-routine', date: 'Mar 18, 2026' },
              { pillar: 'Everyday Life', title: 'Your First 30 Days After Amputation', desc: 'What to expect and how to adapt during the critical first month with a new prosthesis.', img: '/images/articles/first-30-days-cover.webp', href: '/resources/performance-and-recovery/first-30-days-after-amputation', date: 'Mar 18, 2026' },
              { pillar: 'Health & Performance', title: 'Adaptive Fitness with Amy Bream', desc: 'Strength training, workout routines, and life as an adaptive athlete.', img: '/images/articles/gait-training-cover.webp', href: '/resources/performance-and-recovery/adaptive-fitness-amy-bream', date: 'Apr 2, 2026' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Link to={item.href} className="group flex flex-col bg-white overflow-hidden hover:shadow-md transition-shadow duration-300 h-full">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={item.img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{item.pillar}</span>
                      <span className="text-[11px] text-gray-400">{item.date}</span>
                    </div>
                    <h4 className="text-lg font-medium leading-snug mb-2 group-hover:text-gray-500 transition-colors">{item.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <div className="mt-8 md:hidden text-center">
            <Link to="/resources" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Explore Knowledge Base <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Proof of Platform: AI Support ──────────────────────── */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-brand-offwhite">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-16">
            <div>
              <h3 className="text-2xl font-medium">Ask AmpuMe</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-lg hidden md:block">Ask questions about prosthetics, care, and daily life — and get clear answers instantly.</p>
            </div>
            <Link to="/ai-support" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Ask AmpuMe <ArrowRight size={14} />
            </Link>
          </div>
          <FadeIn>
            <div className="bg-white border border-black/5">
              {/* Assistant header */}
              <div className="px-6 md:px-10 py-5 border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-gold/15 flex items-center justify-center">
                    <Bot size={16} className="text-brand-gold" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">AmpuMe Assistant</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">Available 24/7</span>
                    </div>
                  </div>
                </div>
                <MessageSquare size={16} className="text-gray-400 hidden md:block" />
              </div>

              {/* Input mock */}
              <div className="px-6 md:px-10 pt-8 md:pt-10 pb-6">
                <button
                  onClick={() => navigate('/ai-support')}
                  className="w-full flex items-center gap-3 border border-black/10 bg-brand-offwhite/50 hover:border-black/25 transition-colors group px-5 py-4 text-left"
                >
                  <span className="flex-1 text-sm text-gray-500">Ask anything about limb loss, prosthetics, or daily life…</span>
                  <div className="w-9 h-9 bg-brand-gold flex items-center justify-center group-hover:bg-black transition-colors flex-shrink-0">
                    <Send size={14} className="text-black group-hover:text-white" strokeWidth={2} />
                  </div>
                </button>
              </div>

              {/* Suggested prompts */}
              <div className="px-6 md:px-10 pb-8 md:pb-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Try asking</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'What should I do if my residual limb volume is fluctuating?',
                    'How often will my insurance cover a new socket?',
                    'How do I cope with the emotional side of limb loss?',
                    'How often should I replace my liner?',
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => navigate('/ai-support', { state: { prompt } })}
                      className="group flex items-start justify-between gap-4 text-left border border-black/5 px-5 py-4 hover:bg-brand-offwhite/60 hover:border-black/15 transition-colors"
                    >
                      <span className="text-sm text-gray-800 leading-relaxed">{prompt}</span>
                      <ArrowUpRight size={16} className="text-gray-400 group-hover:text-black transition-colors mt-0.5 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
