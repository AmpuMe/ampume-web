import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import PillarCard from '../components/PillarCard';
import { fetchPillars, fetchLatestResources } from '../lib/sanity';
import heroImage from '../assets/resources-hero.webp';

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
  const [latestResources, setLatestResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pillarsResult, latestResult] = await Promise.all([
          fetchPillars(),
          fetchLatestResources(),
        ]);
        setPillars(pillarsResult || []);
        setLatestResources(latestResult || []);
      } catch (err) {
        console.error('Error loading resources:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title="Knowledge Base | AmpuMe"
        description="Structured resources across performance, prosthetic care, insurance, and everyday life — designed to help you move forward with confidence."
        url="https://ampume.com/resources"
      />

      <SimpleNavbar transparent />

      <main className="pb-20">
        {/* Hero — full-width image with text overlay (mirrors homepage hero, shorter) */}
        <section className="relative h-[60vh] sm:h-[65vh] md:h-[60vh] lg:h-[65vh] w-full overflow-hidden bg-black">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Two amputees sharing knowledge and support"
              className="w-full h-full object-cover object-[80%_center] sm:object-[75%_center] lg:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
          </div>
          <div className="relative z-10 h-full px-6 md:px-12 grid grid-cols-12 items-end pb-12 md:pb-16 text-white">
            <FadeIn className="col-span-12 md:col-span-8 lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
                Knowledge Base
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-4">
                Trusted guidance for life with limb&nbsp;loss.
              </h1>
              <p className="text-base md:text-lg font-light text-white/80 max-w-lg leading-relaxed">
                Structured resources across performance, prosthetic care, insurance, and everyday life — designed to help you move forward with confidence.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Latest Resources — featured hero + secondary cards */}
        {latestResources.length > 0 && (() => {
          const makeHref = (r) => {
            const ps = r.pillar?.slug?.current;
            return r.contentType === 'externalLink' && r.externalUrl
              ? r.externalUrl : `/resources/${ps}/${r.slug?.current}`;
          };
          const isExt = (r) => r.contentType === 'externalLink' && r.externalUrl;
          const Wrap = ({ resource, children, className = '' }) => {
            const href = makeHref(resource);
            return isExt(resource)
              ? <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
              : <Link to={href} className={className}>{children}</Link>;
          };
          const featured = latestResources[0];
          const secondary = latestResources.slice(1, 3);
          const thumb = (r) => r.thumbnailImage || r.thumbnailUrl;
          const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

          return (
          <section className="px-6 md:px-12 pt-16 md:pt-20">
            <FadeIn>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-medium">Latest</h2>
                <Link to="/resources" className="text-sm text-gray-400 hover:text-black transition-colors">View all</Link>
              </div>
            </FadeIn>

            {/* Featured article — large horizontal card */}
            <FadeIn className="mb-6">
              <Wrap resource={featured} className="group block">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200">
                  {thumb(featured) && (
                    <div className="aspect-[16/9] md:aspect-auto md:min-h-[320px] bg-gray-50 overflow-hidden">
                      <img
                        src={thumb(featured)}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      {featured.pillar?.title && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {featured.pillar.title}
                        </span>
                      )}
                      {featured.publishedAt && (
                        <span className="text-[10px] text-gray-300">{fmtDate(featured.publishedAt)}</span>
                      )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-medium leading-tight mb-3 group-hover:text-gray-600 transition-colors">
                      {featured.title}
                    </h3>
                    {featured.editorialSummary && (
                      <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
                        {featured.editorialSummary}
                      </p>
                    )}
                    <span className="text-sm font-medium text-black group-hover:text-gray-500 transition-colors">
                      Read article →
                    </span>
                  </div>
                </div>
              </Wrap>
            </FadeIn>

            {/* Secondary articles — 2 smaller cards */}
            {secondary.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 md:mb-20">
                {secondary.map((resource, index) => (
                  <FadeIn key={resource._id} delay={(index + 1) * 0.1}>
                    <Wrap resource={resource} className="group block h-full">
                      <div className="border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-300 h-full flex flex-col">
                        {thumb(resource) && (
                          <div className="aspect-[16/9] bg-gray-50 overflow-hidden">
                            <img
                              src={thumb(resource)}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {resource.pillar?.title && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                {resource.pillar.title}
                              </span>
                            )}
                            {resource.publishedAt && (
                              <span className="text-[10px] text-gray-300">{fmtDate(resource.publishedAt)}</span>
                            )}
                          </div>
                          <h3 className="text-base font-medium leading-tight mb-2 group-hover:text-gray-600 transition-colors">
                            {resource.title}
                          </h3>
                          {resource.editorialSummary && (
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                              {resource.editorialSummary}
                            </p>
                          )}
                          <div className="mt-3 pt-3 border-t border-gray-50">
                            <span className="text-xs font-medium text-black group-hover:text-gray-500 transition-colors">
                              Read more →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Wrap>
                  </FadeIn>
                ))}
              </div>
            )}
          </section>
          );
        })()}
        )}

        {/* Browse by Category */}
        <section className="px-6 md:px-12 pt-16 md:pt-20">
          <FadeIn className="mb-8">
            <h2 className="text-2xl font-medium">Browse by Category</h2>
          </FadeIn>
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
