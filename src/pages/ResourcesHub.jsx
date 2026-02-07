import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import PillarCard from '../components/PillarCard';
import { fetchPillars } from '../lib/sanity';

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
        description="Curated resources for life after limb loss. Browse guides on health, prosthetics, daily living, community support, and more."
        url="https://ampume.com/resources"
      />

      <SimpleNavbar />

      <main className="pt-32 pb-20 px-6 md:px-12">
        {/* Hero */}
        <FadeIn className="max-w-3xl mb-16 md:mb-20">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Resource Library
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Knowledge for every step
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Curated guides, videos, and trusted resources organized by topic.
            Whether you're newly adjusting or years into your journey, find what matters to you.
          </p>
        </FadeIn>

        {/* Pillar Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
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
      </main>

      <Footer />
    </div>
  );
}
