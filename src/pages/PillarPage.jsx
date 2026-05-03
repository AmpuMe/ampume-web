import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import ResourceCard from '../components/ResourceCard';
import InsuranceExpertForm from '../components/InsuranceExpertForm';
import { fetchPillarWithResources } from '../lib/sanity';

// Temporarily hidden pending HIPAA review — set true to restore form + FAQs.
const SHOW_INSURANCE_FORM = false;

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
  const navigate = useNavigate();
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

  const isInsurancePillar = pillarSlug === 'insurance-and-coverage';

  // SEO renders in every state so prerendered HTML always carries tags.
  const seoTitle = pillar ? `${pillar.title} | AmpuMe Knowledge Base` : 'Knowledge Base | AmpuMe';
  const seoDesc = pillar?.description || 'Expert guidance and resources for life with limb loss.';
  const seoUrl = `https://ampume.com/resources/${pillarSlug}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SEO title={seoTitle} description={seoDesc} url={seoUrl} />
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
        <SEO title={seoTitle} description={seoDesc} url={seoUrl} />
        <SimpleNavbar />
        <div className="pt-32 px-6 md:px-12 text-center">
          <h1 className="text-2xl font-medium mb-4">Section not found</h1>
          <p className="text-gray-500 mb-8">This resource section may not exist yet.</p>
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledge Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title={`${pillar.title} | AmpuMe Knowledge Base`}
        description={pillar.description || `Browse ${pillar.title} resources at AmpuMe`}
        url={`https://ampume.com/resources/${pillarSlug}`}
      />

      <SimpleNavbar />

      <main className="pt-32 pb-20 px-6 md:px-12">
        {/* Back Link */}
        <FadeIn className="mb-8">
          <button
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/resources')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </FadeIn>

        {/* Pillar Hero */}
        <FadeIn className="max-w-3xl mb-12">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
            {isInsurancePillar ? 'Understand Your Insurance and Coverage' : pillar.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            {isInsurancePillar && SHOW_INSURANCE_FORM
              ? 'Get clarity on your benefits, coverage, and what to expect. Our team will review your information and help you understand your options.'
              : pillar.description}
          </p>
        </FadeIn>

        {/* Insurance Expert Form (special pillar) — gated pending HIPAA review */}
        {isInsurancePillar && SHOW_INSURANCE_FORM && (
          <>
            <FadeIn delay={0.1} className="mb-12">
              <InsuranceExpertForm />
            </FadeIn>

            {/* Insurance & Shopping FAQ */}
            <FadeIn delay={0.15} className="mb-12 max-w-3xl">
              <h2 className="text-xl font-medium mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-sm font-bold mb-2">What if my insurance doesn't cover what I need?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our <Link to="/shop" className="underline hover:text-black transition-colors">shop</Link> offers prosthetic supplies at accessible prices for out-of-pocket purchases. Many people keep backup liners, travel supplies, or extra socks on hand outside of their insurance coverage.
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-sm font-bold mb-2">How often does insurance replace prosthetic liners?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Most insurance plans cover liner replacement every 6 to 12 months, depending on the plan and medical necessity. If you're between replacement cycles and need a liner now, our shop has you covered.
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-sm font-bold mb-2">What information do I need to check my benefits?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Your insurance provider name, policy or member ID, and a general idea of what supplies you need. Fill out the form above and our team will do the rest — we'll review your benefits and follow up within 2-3 business days.
                  </p>
                </div>
                <div className="pb-6">
                  <h3 className="text-sm font-bold mb-2">Do you accept Medicare or Medicaid?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Coverage for prosthetic supplies through Medicare and Medicaid varies by state and plan type. Submit your information above and we'll help determine what your specific plan covers.
                  </p>
                </div>
              </div>
            </FadeIn>
          </>
        )}

        {/* Bridge section — Knowledge Base link for insurance pillar (only shown alongside the form) */}
        {isInsurancePillar && SHOW_INSURANCE_FORM && pillar.resources && pillar.resources.length > 0 && (
          <FadeIn delay={0.2} className="mb-10">
            <h2 className="text-xl font-medium mb-2">From Our Knowledge Base</h2>
            <p className="text-sm text-gray-500">Explore guides and resources to better understand insurance, coverage, and the claims process.</p>
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
