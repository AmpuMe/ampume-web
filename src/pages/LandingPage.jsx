import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, MessageSquare, Send, Play, FileText, ArrowUpRight, Bot, User } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import NewsletterModal from '../components/NewsletterModal';
import heroImage from '../assets/new-hero-3.webp';
import marketplaceImage from '../assets/shop.webp';
import peopleImage from '../assets/people.webp';
import friendsImage from '../assets/friends.webp';
import cardPhoto from '../assets/support.webp';
import telehealthImage from '../assets/telehealth.webp';
import categoryLiners from '../assets/shop/category-liners.webp';
import categorySleeves from '../assets/shop/category-sleeves.webp';
import categorySocks from '../assets/shop/category-socks.webp';

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
                <span className="text-[11px] font-bold uppercase tracking-widest bg-white text-black px-3 pt-[7px] pb-[5px] leading-none">Ask</span>
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
                  <span className="text-[11px] font-bold uppercase tracking-widest bg-white text-black px-3 pt-[7px] pb-[5px] leading-none">Shop</span>
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
                <span className="text-[11px] font-bold uppercase tracking-widest bg-white text-black px-3 pt-[7px] pb-[5px] leading-none">Learn and Connect</span>
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
              <img src={telehealthImage} loading="lazy" alt="Telehealth" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
      <section className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-16">
            <div>
              <h3 className="text-2xl font-medium">Prosthetic Essentials</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-lg hidden md:block">Liners, sleeves, socks, and care products — thoughtfully selected for fit, function, and durability.</p>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Browse Shop <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag: 'Liners', name: 'Prosthetic Liners', desc: 'Adaptive gel for comfort and secure suspension.', href: '/shop/liners', img: categoryLiners },
              { tag: 'Sleeves', name: 'Suspension Sleeves', desc: 'Maintain a secure seal for below-knee systems.', href: '/shop/sleeves', img: categorySleeves },
              { tag: 'Socks', name: 'Prosthetic Socks', desc: 'Manage limb volume with breathable knit construction.', href: '/shop/socks', img: categorySocks },
            ].map((product, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Link to={product.href} className="group relative block h-[500px] md:h-[600px] overflow-hidden cursor-pointer">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
              Browse Shop <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Proof of Platform: Resources ──────────────────────── */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-brand-offwhite">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-16">
            <div>
              <h3 className="text-2xl font-medium">Expert Guidance</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-lg hidden md:block">Articles, videos, and guides covering prosthetic care, recovery, insurance, and everyday life.</p>
            </div>
            <Link to="/resources" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Explore Resources <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { pillar: 'Prosthetic Care', title: 'A Daily Prosthetic Care Routine That Actually Works', desc: 'Build a practical daily routine for liner cleaning, skin inspection, and socket maintenance.', img: '/images/articles/care-routine-cover.webp', href: '/resources' },
              { pillar: 'Everyday Life', title: 'Your First 30 Days with a Prosthesis', desc: 'What to expect and how to adapt during the critical first month with a new prosthesis.', img: '/images/articles/first-30-days-cover.webp', href: '/resources' },
              { pillar: 'Performance & Recovery', title: 'Gait Training Exercises for Lower Limb Amputees', desc: 'Balance, weight shifting, and walking patterns for rehabilitation and ongoing fitness.', img: '/images/articles/gait-training-cover.webp', href: '/resources' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Link to={item.href} className="group relative block h-[500px] md:h-[600px] overflow-hidden cursor-pointer">
                  <img src={item.img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500" />
                  <span className="absolute top-8 left-8 z-10 text-[11px] font-bold uppercase tracking-widest bg-white text-black px-3 pt-[7px] pb-[5px] leading-none">
                    {item.pillar}
                  </span>
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                    <h4 className="text-3xl font-medium mb-3">{item.title}</h4>
                    <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
                      <p className="text-sm text-white/90 leading-relaxed mb-4">{item.desc}</p>
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-colors">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <div className="mt-8 md:hidden text-center">
            <Link to="/resources" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Explore Resources <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Proof of Platform: AI Support ──────────────────────── */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-16">
            <div>
              <h3 className="text-2xl font-medium">Ask Anything</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-lg hidden md:block">Ask questions about prosthetics, care, and daily life — and get clear answers instantly.</p>
            </div>
            <Link to="/ai-support" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              Try AI Support <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chat mockup card — same dimensions as tile cards */}
            <FadeIn>
              <Link to="/ai-support" className="group relative block h-[500px] md:h-[600px] bg-black overflow-hidden cursor-pointer">
                <span className="absolute top-8 left-8 z-10 text-[11px] font-bold uppercase tracking-widest bg-white text-black px-3 pt-[7px] pb-[5px] leading-none">
                  AI Support
                </span>
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <div className="mt-14 space-y-4">
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-white/10 text-white rounded-2xl rounded-tr-sm px-4 py-2.5">
                        <p className="text-sm">How often should I replace my liner?</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-white/10 text-white/90 rounded-2xl rounded-tl-sm px-4 py-2.5">
                        <p className="text-sm leading-relaxed">Most prosthetic liners should be replaced every <strong className="text-white">6 to 12 months</strong>, depending on usage, activity level, and material wear. Signs it's time include visible gel breakdown, reduced cushioning, or changes in socket fit.</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                    <div className="flex-1 text-sm text-white/30">Ask a question...</div>
                    <Send className="w-4 h-4 text-white/30" />
                  </div>
                </div>
              </Link>
            </FadeIn>
            {/* Prompts + description card */}
            <FadeIn delay={0.1}>
              <div className="h-[500px] md:h-[600px] bg-brand-offwhite p-6 md:p-8 flex flex-col justify-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6 block">Available 24/7</span>
                <h4 className="text-3xl font-medium mb-4">Clear answers, instantly.</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-8">
                  Our AI assistant is trained on expert prosthetic resources to help you with questions about recovery, daily care, insurance coverage, and more.
                </p>
                <div className="space-y-3 mb-8">
                  {['How often should I replace my liner?', 'Why is my residual limb irritated?', 'What does Medicare cover for prosthetics?'].map((prompt, i) => (
                    <Link key={i} to="/ai-support" className="group flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors">
                      <span className="w-6 h-6 rounded-full bg-white group-hover:bg-black group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {prompt}
                    </Link>
                  ))}
                </div>
                <Link to="/ai-support" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
                  Try AI Support <ArrowRight size={14} />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
