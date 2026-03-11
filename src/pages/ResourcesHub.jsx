import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import PillarCard from '../components/PillarCard';
import { fetchPillars } from '../lib/sanity';
import heroImage from '../assets/resources-hero.png';

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

export default function ResourcesHub() {
  const [pillars, setPillars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPillars = async () => {
      try {
        const result = await fetchPillars();
        setPillars(result || []);
      } catch (err) {
        console.error('Error loading pillars:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPillars();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title="Resources | AmpuMe"
        description="Structured resources across performance, prosthetic care, insurance, and everyday life — designed to help you move forward with confidence."
        url="https://ampume.com/resources"
      />

      <SimpleNavbar />

      <main className="pt-32 pb-20">
        {/* Hero — split layout */}
        <section className="px-6 md:px-12 mb-16 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Resource Library
              </p>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
                Trusted guidance for life with limb loss.
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                Structured resources across performance, prosthetic care, insurance, and everyday life — designed to help you move forward with confidence.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <img
                src={heroImage}
                alt="Two amputees sharing knowledge and support"
                className="w-full rounded-lg object-cover aspect-[4/3]"
              />
            </FadeIn>
          </div>
        </section>

        {/* Pillar Grid */}
        <section className="px-6 md:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-8 animate-pulse">
                  <div className="w-10 h-10 bg-gray-100 rounded-full mb-4" />
                  <div className="h-5 bg-gray-100 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Unable to load resources. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pillars.map((pillar, index) => (
                <PillarCard key={pillar._id} pillar={pillar} index={index} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
