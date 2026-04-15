import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import PillarCard from '../components/PillarCard';
import ResourceCard from '../components/ResourceCard';
import { fetchPillars, fetchLatestResources, fetchAllResources } from '../lib/sanity';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTag = searchParams.get('tag') || '';
  const initialSearch = searchParams.get('q') || '';
  const showBrowse = searchParams.has('browse') || searchParams.has('tag') || searchParams.has('q');

  const [pillars, setPillars] = useState([]);
  const [latestResources, setLatestResources] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeTag, setActiveTag] = useState(initialTag);

  // Load initial data
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

  // Load all resources when browse mode is activated
  useEffect(() => {
    if (showBrowse && !allLoaded) {
      fetchAllResources().then(result => {
        setAllResources(result || []);
        setAllLoaded(true);
      });
    }
  }, [showBrowse, allLoaded]);

  // Collect all unique tags from loaded resources
  const allTags = useMemo(() => {
    // Count tag frequency, only show tags used on 2+ resources
    const tagCounts = {};
    allResources.forEach(r => r.tags?.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
    return Object.entries(tagCounts)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [allResources]);

  // Filter resources
  const filteredResources = useMemo(() => {
    let results = allResources;
    if (activeTag) {
      results = results.filter(r => r.tags?.includes(activeTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.editorialSummary?.toLowerCase().includes(q) ||
        r.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return results;
  }, [allResources, activeTag, searchQuery]);

  const handleTagClick = (tag) => {
    const newTag = tag === activeTag ? '' : tag;
    setActiveTag(newTag);
    const params = new URLSearchParams(searchParams);
    if (newTag) { params.set('tag', newTag); } else { params.delete('tag'); }
    if (!params.has('browse') && !params.has('q')) params.set('browse', '');
    setSearchParams(params, { replace: true });
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value) { params.set('q', value); } else { params.delete('q'); }
    if (!params.has('browse') && !params.has('tag')) params.set('browse', '');
    setSearchParams(params, { replace: true });
  };

  const openBrowse = () => {
    if (!allLoaded) {
      fetchAllResources().then(result => {
        setAllResources(result || []);
        setAllLoaded(true);
      });
    }
    setSearchParams({ browse: '' }, { replace: true });
  };

  const closeBrowse = () => {
    setSearchQuery('');
    setActiveTag('');
    setSearchParams({}, { replace: true });
  };

  // Helpers shared by the Latest section
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
  const thumb = (r) => r.thumbnailImage || r.thumbnailUrl;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title="Knowledge Base | AmpuMe"
        description="Structured resources across performance, prosthetic care, insurance, and everyday life — designed to help you move forward with confidence."
        url="https://ampume.com/resources"
      />

      <SimpleNavbar transparent />

      <main className="pb-20">
        {/* Hero */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-black">
          <img src={heroImage} alt="" className="w-full h-full object-cover object-[50%_60%] opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-12 md:pb-16 text-white">
            <FadeIn>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-4 block">
                Knowledge Base
              </span>
              <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
                Expert guidance at your pace.
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
                Explore trusted resources to navigate amputation, prosthetic care, and everyday life with limb loss.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Search bar — always visible */}
        <section className="px-6 md:px-12 pt-8 md:pt-12">
          <FadeIn>
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search articles, guides, and resources..."
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
              />
              {searchQuery && (
                <button onClick={() => { handleSearch(''); closeBrowse(); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400 hover:text-black" />
                </button>
              )}
            </div>
          </FadeIn>
        </section>

        {/* Browse / Search Mode */}
        {showBrowse ? (
          <section className="px-6 md:px-12 pt-6 md:pt-8">
            <FadeIn>

              {/* Tag filters */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        activeTag === tag
                          ? 'bg-black text-white border-black'
                          : 'border-gray-200 text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Results count */}
              <p className="text-sm text-gray-400 mb-6">
                {filteredResources.length} {filteredResources.length === 1 ? 'result' : 'results'}
                {activeTag && <> tagged <strong className="text-black">"{activeTag}"</strong></>}
                {searchQuery && <> matching <strong className="text-black">"{searchQuery}"</strong></>}
              </p>

              {/* Results grid */}
              {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map((resource, i) => (
                    <ResourceCard
                      key={resource._id}
                      resource={resource}
                      pillarSlug={resource.pillar?.slug?.current}
                      index={i}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-sm">No resources found. Try a different search or tag.</p>
                </div>
              )}
            </FadeIn>
          </section>
        ) : (
          <>
            {/* Latest Section */}
            {latestResources.length > 0 && (() => {
              const featured = latestResources[0];
              const secondary = latestResources.slice(1, 3);

              return (
              <section className="px-6 md:px-12 pt-16 md:pt-20">
                <FadeIn>
                  <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl font-medium">Latest</h2>
                    <button onClick={openBrowse} className="text-sm text-gray-400 hover:text-black transition-colors">View all</button>
                  </div>
                </FadeIn>

                {/* Featured article */}
                <FadeIn className="mb-6">
                  <Wrap resource={featured} className="group block">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-300">
                      {thumb(featured) && (
                        <div className="aspect-[16/9] md:aspect-auto bg-gray-50 overflow-hidden">
                          <img src={thumb(featured)} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
                        </div>
                      )}
                      <div className="p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-3">
                          {featured.pillar?.title && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                              {featured.pillar.title}
                            </span>
                          )}
                          {featured.publishedAt && (
                            <span className="text-[10px] text-gray-500">{fmtDate(featured.publishedAt)}</span>
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

                {/* Secondary articles */}
                {secondary.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 md:mb-20">
                    {secondary.map((resource, index) => (
                      <FadeIn key={resource._id} delay={(index + 1) * 0.1}>
                        <Wrap resource={resource} className="group block h-full">
                          <div className="border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-300 h-full flex flex-col">
                            {thumb(resource) && (
                              <div className="aspect-[16/9] bg-gray-50 overflow-hidden">
                                <img src={thumb(resource)} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
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
                                  <span className="text-[10px] text-gray-500">{fmtDate(resource.publishedAt)}</span>
                                )}
                              </div>
                              <h3 className="text-base font-medium leading-tight mb-2 group-hover:text-gray-600 transition-colors">
                                {resource.title}
                              </h3>
                              {resource.editorialSummary && (
                                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
