import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import ResourceCard from '../components/ResourceCard';
import InsuranceExpertForm from '../components/InsuranceExpertForm';
import { fetchPillarWithResources } from '../lib/sanity';

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

export default function PillarPage() {
  const { pillarSlug } = useParams();
  const [pillar, setPillar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPillar = async () => {
      try {
        setIsLoading(true);
        const result = await fetchPillarWithResources(pillarSlug);
        if (result) {
          setPillar(result);
        } else {
          setError('Pillar not found');
        }
      } catch (err) {
        console.error('Error loading pillar:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPillar();
  }, [pillarSlug]);

  const isInsurancePillar = pillarSlug === 'ask-an-insurance-expert';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SimpleNavbar />
        <div className="pt-32 px-6 md:px-12">
          <div className="max-w-4xl">
            <div className="h-4 bg-gray-100 animate-pulse rounded w-24 mb-6" />
            <div className="h-8 bg-gray-100 animate-pulse rounded w-2/3 mb-4" />
            <div className="h-5 bg-gray-100 animate-pulse rounded w-full mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-5 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-16 mb-3" />
                  <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pillar) {
    return (
      <div className="min-h-screen bg-white">
        <SimpleNavbar />
        <div className="pt-32 px-6 md:px-12 text-center">
          <h1 className="text-2xl font-medium mb-4">Section not found</h1>
          <p className="text-gray-500 mb-8">This resource section may not exist yet.</p>
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title={`${pillar.title} | AmpuMe Resources`}
        description={pillar.description || `Browse ${pillar.title} resources at AmpuMe`}
        url={`https://ampume.com/resources/${pillarSlug}`}
      />

      <SimpleNavbar />

      <main className="pt-32 pb-20 px-6 md:px-12">
        {/* Back Link */}
        <FadeIn className="mb-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Resources
          </Link>
        </FadeIn>

        {/* Pillar Hero */}
        <FadeIn className="max-w-3xl mb-12">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
            {pillar.title}
          </h1>
          {pillar.description && (
            <p className="text-lg text-gray-500 leading-relaxed">
              {pillar.description}
            </p>
          )}
        </FadeIn>

        {/* Insurance Expert Form (special pillar) */}
        {isInsurancePillar && (
          <FadeIn delay={0.1} className="mb-12">
            <InsuranceExpertForm />
          </FadeIn>
        )}

        {/* Resource Grid */}
        {pillar.resources && pillar.resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillar.resources.map((resource, index) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                pillarSlug={pillarSlug}
                index={index}
              />
            ))}
          </div>
        ) : !isInsurancePillar ? (
          <FadeIn delay={0.1}>
            <div className="text-center py-12 border border-gray-100 rounded-lg">
              <p className="text-gray-400 text-sm">
                Resources for this section are coming soon.
              </p>
            </div>
          </FadeIn>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
