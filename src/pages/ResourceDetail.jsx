import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Play, FileText } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import PortableTextRenderer from '../components/PortableTextRenderer';
import { fetchResourceDetail, getYouTubeEmbedUrl } from '../lib/sanity';

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

export default function ResourceDetail() {
  const { pillarSlug, resourceSlug } = useParams();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResource = async () => {
      try {
        setIsLoading(true);
        const result = await fetchResourceDetail(resourceSlug);
        if (result) {
          setResource(result);
        } else {
          setError('Resource not found');
        }
      } catch (err) {
        console.error('Error loading resource:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadResource();
  }, [resourceSlug]);

  const embedUrl = resource?.videoUrl ? getYouTubeEmbedUrl(resource.videoUrl) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SimpleNavbar />
        <div className="pt-32 px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="h-4 bg-gray-100 animate-pulse rounded w-32 mb-8" />
            <div className="h-8 bg-gray-100 animate-pulse rounded w-3/4 mb-4" />
            <div className="h-5 bg-gray-100 animate-pulse rounded w-full mb-2" />
            <div className="h-5 bg-gray-100 animate-pulse rounded w-2/3 mb-8" />
            <div className="h-64 bg-gray-100 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-white">
        <SimpleNavbar />
        <div className="pt-32 px-6 md:px-12 text-center">
          <h1 className="text-2xl font-medium mb-4">Resource not found</h1>
          <p className="text-gray-500 mb-8">This resource may no longer be available.</p>
          <Link
            to={`/resources/${pillarSlug}`}
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
        title={`${resource.title} | AmpuMe Resources`}
        description={resource.editorialSummary || `Read ${resource.title} at AmpuMe`}
        url={`https://ampume.com/resources/${pillarSlug}/${resourceSlug}`}
      />

      <SimpleNavbar />

      <main className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <FadeIn className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/resources" className="hover:text-black transition-colors">
                Resources
              </Link>
              <span>/</span>
              <Link to={`/resources/${pillarSlug}`} className="hover:text-black transition-colors">
                {resource.pillar?.title || pillarSlug}
              </Link>
            </nav>
          </FadeIn>

          {/* Header */}
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
                {resource.contentType === 'video' ? <Play className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                {resource.contentType === 'video' ? 'Video' : resource.contentType === 'listing' ? 'Guide' : 'Article'}
              </span>
              {resource.source && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-xs text-gray-400">{resource.source}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              {resource.title}
            </h1>

            {resource.editorialSummary && (
              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                {resource.editorialSummary}
              </p>
            )}
          </FadeIn>

          {/* Video Embed */}
          {embedUrl && (
            <FadeIn delay={0.1} className="mb-8">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  src={embedUrl}
                  title={resource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </FadeIn>
          )}

          {/* External Link Button */}
          {resource.externalUrl && (
            <FadeIn delay={0.1} className="mb-8">
              <a
                href={resource.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Visit Resource
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </FadeIn>
          )}

          {/* Body Content */}
          {resource.body && (
            <FadeIn delay={0.15} className="border-t border-gray-100 pt-8">
              <PortableTextRenderer value={resource.body} />
            </FadeIn>
          )}

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <FadeIn delay={0.2} className="border-t border-gray-100 pt-6 mt-8">
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-gray-400 border border-gray-100 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
