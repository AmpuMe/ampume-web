import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, ChevronRight, ArrowUpRight } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import WaitlistModal from '../components/WaitlistModal';
import { useSubscribe } from '../hooks/useSubscribe';
import heroImage from '../assets/new-hero-3.webp';
import marketplaceImage from '../assets/shop.webp';
import peopleImage from '../assets/people.webp';
import personImage from '../assets/person.webp';
import familyImage from '../assets/family.webp';
import friendsImage from '../assets/friends.webp';
import friends2Image from '../assets/friends-2.webp';
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
  const { subscribe, loading, success, error } = useSubscribe();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await subscribe(formData);
  };

  useEffect(() => {
    // Prevent browser from restoring scroll position automatically
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Hash scrolling logic - only run if hash is present AND it's not the initial load or refresh that causes unwanted jumping
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Use a slight delay to ensure the page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
        // If no hash, ensure we are at top
         window.scrollTo(0, 0);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'AI Support', href: '/ai-support' },
    { name: 'Marketplace', href: '#marketplace' },
    { name: 'Telehealth', href: '#telehealth' },
    { name: 'Resources', href: '#resources' },
  ];

  const handleNavClick = (href) => {
    if (href.startsWith('/')) {
      navigate(href);
    } else {
      scrollToSection(href.replace('#', ''));
    }
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
        description="AmpuMe is the all-in-one platform for life after limb loss. Discover our Marketplace, Telehealth services, Resources, and AI Support."
      />
      <WaitlistModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      
      {/* Navigation - Hunter Style: Full width, clean, top aligned */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white text-black shadow-sm py-6' : 'bg-transparent text-white py-6'}`}>
        <div className="px-6 md:px-12 grid grid-cols-12 items-center h-full gap-4">
          {/* Logo - Left Aligned */}
          <div className="col-span-3">
            <a href="#" className="text-xl md:text-2xl font-semibold tracking-tight uppercase z-50">
              AmpuMe.
            </a>
          </div>
          
          {/* Desktop Links - Grid Aligned */}
          <div className="hidden lg:flex col-span-6 justify-center gap-6 xl:gap-12">
            {navLinks.map(link => (
              <button key={link.name} onClick={() => handleNavClick(link.href)} className="text-sm font-medium hover:opacity-70 transition-opacity">
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Actions - Right Aligned */}
          <div className="hidden lg:flex col-span-3 justify-end items-center">
            <button 
              onClick={() => setModalOpen(true)}
              className={`px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-colors ${scrolled ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              Join the Waitlist
            </button>
          </div>

          {/* Mobile Toggle */}
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
              <hr className="border-gray-100 my-4"/>
              <button onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }} className="text-left">Login</button>
              <button onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }} className="text-left">Contact</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Swiss Grid Approach */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover object-[85%_center] md:object-center" />
          {/* Gradient for text legibility on left, keeping subject clear on right */}
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
                onClick={() => setModalOpen(true)}
                className="bg-white text-black px-10 py-4 rounded-full font-medium text-sm hover:bg-brand-offwhite transition-colors whitespace-nowrap"
              >
                Join the Waitlist
              </button>
              <p className="text-lg font-light text-white/80 max-w-sm leading-relaxed">
                We're building a single place to find products, resources, providers, and support.
              </p>
            </div>
          </FadeIn>
        </div>

      </section>

      {/* Intro Section - "One Place" - Swiss Split Layout */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white border-b border-gray-100">
        <div className="grid grid-cols-12 gap-8 md:gap-16">
          <FadeIn className="col-span-12 md:col-span-5">
            <h2 className="text-4xl md:text-5xl font-normal leading-tight sticky top-32">
              We think there should be one place that brings it all together.
            </h2>
          </FadeIn>
          <FadeIn className="col-span-12 md:col-span-6 md:col-start-7">
            <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed mb-8 md:mb-12">
              Navigating limb loss is fragmented. Products are scattered, information is buried, and finding a specialist takes hours. We're changing that by creating a single source of truth for you and your support system.
            </p>
            <button onClick={() => scrollToSection('platform')} className="inline-flex items-center text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-70 transition-opacity text-left">
              Our Solution
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Platform Grid - Hunter Style: "Brand Portfolio" */}
      <section id="platform" className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-16">
            <h3 className="text-2xl font-medium">The Platform</h3>
            <span className="hidden md:block text-sm text-gray-400">Everything you need</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* AI Support - Position 1 - LIVE */}
            <FadeIn id="ai-support" onClick={() => navigate('/ai-support')} delay={0} className="group relative h-[450px] md:h-[600px] overflow-hidden cursor-pointer scroll-mt-32">
              <img src={friendsImage} loading="lazy" alt="AI Support" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500"></div>
              <div className="absolute top-8 left-8 z-10 flex gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1">Ask</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                <h4 className="text-3xl font-medium mb-3">AI Support</h4>
                <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
                   <p className="text-sm text-white/90 leading-relaxed mb-4">
                    24/7 answers you can trust. Trained on verified medical data.
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-colors">Start Chatting <ArrowRight size={14} /></span>
                </div>
              </div>
            </FadeIn>

            {/* Marketplace - Position 2 */}
            <FadeIn id="marketplace" onClick={() => setModalOpen(true)} delay={0.1} className="group relative h-[500px] md:h-[600px] overflow-hidden cursor-pointer scroll-mt-32">
              <img src={marketplaceImage} loading="lazy" alt="Marketplace" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500"></div>
              <div className="absolute top-8 left-8 z-10 flex gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1">Shop</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                <h4 className="text-3xl font-medium mb-3">Marketplace</h4>
                <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
                   <p className="text-sm text-white/90 leading-relaxed mb-4">
                    Essentials like liners, sleeves, and skincare. Verified by the community.
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1">Coming Soon</span>
                </div>
              </div>
            </FadeIn>

            {/* Telehealth - Position 3 */}
            <FadeIn id="telehealth" onClick={() => setModalOpen(true)} delay={0.2} className="group relative h-[500px] md:h-[600px] overflow-hidden cursor-pointer scroll-mt-32">
              <img src={cardPhoto} loading="lazy" alt="Telehealth" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500"></div>
              <div className="absolute top-8 left-8 z-10 flex gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1">Care</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                <h4 className="text-3xl font-medium mb-3">Telehealth</h4>
                <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
                   <p className="text-sm text-white/90 leading-relaxed mb-4">
                    Book prosthetists and therapists who specialize in limb loss.
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1">Coming Soon</span>
                </div>
              </div>
            </FadeIn>

            {/* Resources - Position 4 */}
            <FadeIn id="resources" onClick={() => setModalOpen(true)} delay={0.3} className="group relative h-[500px] md:h-[600px] overflow-hidden cursor-pointer scroll-mt-32">
              <img src={peopleImage} loading="lazy" alt="Resources" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500"></div>
              <div className="absolute top-8 left-8 z-10 flex gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1">Learn</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                <h4 className="text-3xl font-medium mb-3">Resources</h4>
                <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
                   <p className="text-sm text-white/90 leading-relaxed mb-4">
                    Recovery timelines, product comparisons, and guides.
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1">Coming Soon</span>
                </div>
              </div>
            </FadeIn>
        </div>
      </div>
      </section>

      {/* Who This Is For - Swiss 3-Col Layout with Dividers */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
        <FadeIn>
          <div className="grid grid-cols-12 gap-6 mb-12 md:mb-20 border-b border-gray-100 pb-8">
            <div className="col-span-12 md:col-span-6">
              <h2 className="text-4xl md:text-5xl font-normal leading-tight">
                Designed for <br /> everyone involved.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100">
            {[
              { title: "People with Limb Loss", desc: "Tools for daily life, recovery tracking, and community connection.", img: personImage },
              { title: "Family Members", desc: "Guides on how to help, terminology, and emotional support resources.", img: familyImage },
              { title: "Friends & Supporters", desc: "Understanding the journey and learning how to show up meaningfully.", img: friends2Image }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white p-6 md:p-8">
                <div className="overflow-hidden mb-6 aspect-[5/4]">
                  <img src={item.img} loading="lazy" alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 md:grayscale md:group-hover:grayscale-0" />
                </div>
                <h3 className="text-2xl font-medium mb-4">{item.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Waitlist / CTA - Clean Minimalist Style */}
      <section id="waitlist" className="py-20 md:py-32 px-6 md:px-12 bg-gray-50 text-black border-t border-gray-100">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-6">
             <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-8">
              Join us from <br /> the start.
            </h2>
            <p className="text-xl text-gray-500 font-light max-w-md leading-relaxed">
              We're building the future of limb loss care. Sign up for early access and updates.
            </p>
          </div>
          
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 mt-12 lg:mt-0">
            {success ? (
              <div className="bg-white p-8 md:p-12 border border-gray-100 text-center">
                <h3 className="text-2xl font-medium mb-4">You're on the list!</h3>
                <p className="text-gray-500">We'll let you know as soon as we launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 md:p-12 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-widest mb-4">First Name</label>
                    <input 
                      id="firstName"
                      type="text" 
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane" 
                      className="w-full bg-transparent border-b border-gray-200 py-4 text-left text-xl placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-widest mb-4">Last Name</label>
                    <input 
                      id="lastName"
                      type="text" 
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe" 
                      className="w-full bg-transparent border-b border-gray-200 py-4 text-left text-xl placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest mb-4">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com" 
                    className="w-full bg-transparent border-b border-gray-200 py-4 text-left text-xl placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors w-full md:w-auto disabled:opacity-50"
                  >
                    {loading ? 'Joining...' : 'Join Waitlist'}
                  </button>
                   <p className="text-xs text-gray-500">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;