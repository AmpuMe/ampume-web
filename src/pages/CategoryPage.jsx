import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, ChevronDown } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import FilterBar, { applyFilters } from '../components/FilterBar';
import { useCart } from '../context/CartContext';
import { fetchProductsByType, getCategoryById, groupProducts } from '../lib/shopify';

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

const CATEGORY_COPY = {
  liners: {
    tagline: 'Curated by Professionals',
    intro: 'AmpuMe\'s curated selection of prosthetic liners is designed to support users across different amputation levels, suspension systems, and activity needs.',
    guidance: 'Whenever possible, we recommend working directly with your prosthetist when selecting a liner. Proper measurement and clinical guidance help ensure optimal fit, comfort, and performance. However, we understand that appointments aren\'t always feasible — and insurance may not cover backup or replacement liners.',
    sizingNote: 'If you are ordering independently, please review the sizing guide provided on each product page carefully before purchasing.',
    tip: true,
    filterHelper: 'Not sure what you need? Start by selecting your amputation level and suspension type.',
  },
};

export default function CategoryPage() {
  const location = useLocation();
  const categoryId = location.pathname.split('/').pop();
  const category = getCategoryById(categoryId);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [showGuidance, setShowGuidance] = useState(false);

  const { cartCount, openCart } = useCart();

  useEffect(() => {
    if (!category) return;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const result = await fetchProductsByType(category.key);
        setProducts(result);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [category?.key]);

  const filteredProducts = useMemo(() => {
    const filtered = applyFilters(products, categoryId, activeFilters);
    return groupProducts(filtered);
  }, [products, categoryId, activeFilters]);

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const copy = CATEGORY_COPY[categoryId];

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <SimpleNavbar />
        <div className="pt-32 px-6 md:px-12 text-center">
          <h1 className="text-2xl font-medium mb-4">Category not found</h1>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title={`${category.label} | AmpuMe Shop`}
        description={category.description}
        url={`https://ampume.com/shop/${categoryId}`}
      />

      <SimpleNavbar />

      {/* Cart Button (Fixed) */}
      <button
        onClick={openCart}
        className="fixed bottom-6 right-6 z-40 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Open cart"
      >
        <ShoppingBag className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-brand-gold text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <main className="pt-32 pb-20">
        {/* Back Link + Hero */}
        <section className="px-6 md:px-12 mb-8 md:mb-12">
          <FadeIn>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-8 block"
            >
              <ArrowLeft className="w-4 h-4" />
              All Categories
            </Link>
          </FadeIn>

          <FadeIn className="max-w-3xl" delay={0.05}>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">
              {copy?.tagline || 'The AmpuMe Shop'}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
              {category.label}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {category.description}
            </p>
          </FadeIn>

          {/* Collapsible guidance */}
          {copy && (
            <FadeIn delay={0.1} className="mt-4 max-w-3xl">
              <button
                onClick={() => setShowGuidance(!showGuidance)}
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors"
              >
                {showGuidance ? 'Less info' : 'Sizing & ordering help'}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showGuidance ? 'rotate-180' : ''}`} />
              </button>

              {showGuidance && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-4 overflow-hidden"
                >
                  <div className="bg-brand-offwhite border border-gray-100 p-5 rounded-lg space-y-3">
                    <p className="text-sm text-gray-600 leading-relaxed">{copy.intro}</p>
                    {copy.guidance && (
                      <p className="text-sm text-gray-600 leading-relaxed">{copy.guidance}</p>
                    )}
                    {copy.sizingNote && (
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">{copy.sizingNote}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </FadeIn>
          )}
        </section>

        {/* Guided Selection (liners) or Filter Bar (other categories) */}
        <section className="px-6 md:px-12 mb-8">
          {categoryId === 'liners' ? (
            <FadeIn className="max-w-2xl">
              {/* Step 1: Amputation Level */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Step 1 — Select Your Amputation Level
                </p>
                <div className="flex gap-3">
                  {[
                    { value: 'AK', label: 'Above Knee (AK)' },
                    { value: 'BK', label: 'Below Knee (BK)' },
                  ].map((opt) => {
                    const isActive = activeFilters.ampLevel === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleFilterChange('ampLevel', isActive ? 'all' : opt.value)}
                        className={`
                          flex-1 py-4 px-6 rounded-lg text-sm font-medium transition-all border
                          ${isActive
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                          }
                        `}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Suspension Type — appears after step 1 */}
              {activeFilters.ampLevel && activeFilters.ampLevel !== 'all' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Step 2 — Select Suspension Type
                  </p>
                  <div className="flex gap-3">
                    {[
                      { value: 'cushion', label: 'Cushion' },
                      { value: 'locking', label: 'Locking' },
                    ].map((opt) => {
                      const isActive = activeFilters.suspension === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleFilterChange('suspension', isActive ? 'all' : opt.value)}
                          className={`
                            flex-1 py-4 px-6 rounded-lg text-sm font-medium transition-all border
                            ${isActive
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                            }
                          `}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tip line — shown after step 2 appears */}
                  {copy?.tip && (
                    <p className="text-sm text-gray-500 italic mt-6">
                      Not sure which liner you currently use? Check the side of your existing liner for the model number, or{' '}
                      <Link to="/contact" className="underline hover:text-black transition-colors">contact us</Link>{' '}
                      for assistance.
                    </p>
                  )}
                </motion.div>
              )}
            </FadeIn>
          ) : (
            <FilterBar
              categoryId={categoryId}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
            />
          )}
        </section>

        {/* Products Grid */}
        <section className="px-6 md:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">Unable to load products</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-2">No products found</p>
              <p className="text-sm text-gray-400">
                {Object.values(activeFilters).some(v => v !== 'all')
                  ? 'Try adjusting your filters'
                  : 'Check back soon for new products'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-8">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.map((group, index) => (
                  <ProductCard
                    key={group.baseName}
                    group={group}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
