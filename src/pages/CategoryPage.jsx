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
    tagline: 'Expertly Curated Prosthetic Liners',
    description: 'A curated selection of cushion and locking liners from leading manufacturers — chosen for comfort, suspension, skin protection, and long-term durability.',
    intro: 'AmpuMe\'s curated selection of prosthetic liners is designed to support a range of amputation levels, suspension systems, and activity needs.',
    guidance: 'Whenever possible, we recommend working directly with your prosthetist when selecting a liner. Proper measurement and clinical guidance help ensure optimal fit, comfort, and performance.',
    sizingNote: 'AmpuMe provides access for those purchasing independently or seeking backup liners. If you are ordering on your own, please review the sizing guide on the product page and confirm your measurements before purchasing.',
    tip: 'Not sure which liner you currently use? Check the side of your existing liner for the model number, or',
  },
  socks: {
    tagline: 'Prosthetic Socks',
    description: 'Manage socket fit and daily limb volume changes with prosthetic socks designed for comfort and control.',
    intro: 'Prosthetic socks help manage daily limb volume changes while maintaining a comfortable, secure socket fit. Worn over a prosthetic liner or directly against the skin depending on your suspension system, socks allow you to make small adjustments throughout the day.',
    guidance: 'Socks are available for both pin-locking and suction suspension systems. Options with a distal hole accommodate pin-lock liners, while closed-end socks are designed for suction or vacuum systems that require an airtight seal.',
    sizingNote: 'Start with fewer plies in the morning when your limb volume is largest, and add plies throughout the day as volume decreases. Review the product page for width and length sizing guidance.',
  },
  sleeves: {
    tagline: 'Prosthetic Sleeves',
    description: 'Suspension sleeves for below-knee prostheses, designed to maintain a secure and comfortable seal.',
    intro: 'Suspension sleeves create a secure seal between the prosthetic socket and the limb, providing reliable suspension during daily activities.',
    guidance: 'Sleeves are designed for below-knee prosthetic systems. Measure the circumference around your kneecap to determine the correct size.',
  },
  accessories: {
    tagline: 'Care and Accessories',
    description: 'Care products and maintenance essentials to support skin health and prosthetic hygiene.',
    intro: 'Keeping your prosthetic components clean and your skin healthy is essential for long-term comfort and performance.',
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
              {copy?.description || category.description}
            </p>
          </FadeIn>

          {/* Collapsible guidance — "Before you order" */}
          {copy && (
            <FadeIn delay={0.1} className="mt-4 max-w-3xl">
              <button
                onClick={() => setShowGuidance(!showGuidance)}
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors"
              >
                {showGuidance ? 'Less info' : 'Before you order'}
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
                      <p className="text-sm text-gray-600 leading-relaxed">{copy.sizingNote}</p>
                    )}
                    {copy.tip && (
                      <p className="text-sm text-gray-500 italic">
                        {copy.tip}{' '}
                        <Link to="/contact" className="underline hover:text-black transition-colors">contact us</Link>{' '}
                        for assistance.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </FadeIn>
          )}
        </section>

        {/* Filters */}
        <section className="px-6 md:px-12 mb-8">
          <FilterBar
            categoryId={categoryId}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
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
