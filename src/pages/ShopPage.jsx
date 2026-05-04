import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, ChevronDown } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { fetchProducts, groupProducts, categorizeGroups, CATEGORY_ORDER } from '../lib/shopify';
import linersImage from '../assets/shop/category-liners.webp';
import socksImage from '../assets/shop/category-socks-v13.webp';
import sleevesImage from '../assets/shop/category-sleeves-v2.webp';
import accessoriesImage from '../assets/shop/category-accessories-v2.webp';

const CATEGORY_IMAGES = {
  liners: { src: linersImage, position: 'object-center' },
  socks: { src: socksImage, position: 'object-center' },
  sleeves: { src: sleevesImage, position: 'object-center md:object-[30%_center]' },
  accessories: { src: accessoriesImage, position: 'object-center' },
};

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

function CategoryCard({ category, productCount, image, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/shop/${category.id}`}
        className="group relative block h-[320px] md:h-[400px] overflow-hidden rounded-lg"
      >
        {image ? (
          <img
            src={image.src || image}
            alt={category.label}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${image.position || 'object-center'}`}
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
        <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/30 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
          <h3 className="text-2xl md:text-3xl font-medium mb-3">{category.label}</h3>
          <div className="h-auto md:h-0 md:group-hover:h-auto overflow-hidden transition-all duration-500">
            <p className="text-sm text-white/90 leading-relaxed mb-4">
              {category.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-white transition-colors">
                Browse <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ShopPage() {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const { cartCount, openCart } = useCart();

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const result = await fetchProducts(100);
        const productList = result?.edges?.map(edge => edge.node) || [];
        const groups = groupProducts(productList);
        const categories = categorizeGroups(groups);

        const counts = {};
        for (const cat of categories) {
          counts[cat.id] = cat.groups.length;
        }
        setCategoryCounts(counts);
      } catch (err) {
        console.error('Error loading product counts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCounts();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title="Shop Prosthetic Supplies"
        description="Expertly curated prosthetic supplies and performance products to support comfort, mobility, and quality of life."
        url="https://ampume.com/shop"
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
        {/* Hero Section */}
        <section className="px-6 md:px-12 mb-12 md:mb-20">
          <FadeIn className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">
              The AmpuMe Store
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
              Prosthetic essentials for everyday performance.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Liners, sleeves, socks, and performance accessories — thoughtfully selected for optimal fit, function, and durability.
            </p>

            <button
              onClick={() => setShowMore(!showMore)}
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors mt-4"
            >
              {showMore ? 'Close' : 'Before you order'}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMore ? 'rotate-180' : ''}`} />
            </button>

            {showMore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-4 overflow-hidden"
              >
                <div className="border border-gray-100 p-5 rounded-lg space-y-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Many prosthetic supplies are covered by insurance and can often be ordered directly through your prosthetist. We encourage patients to work with their prosthetist to ensure proper fit, clinical oversight, and coverage.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    AmpuMe offers direct access to select items for those paying out-of-pocket, seeking backup supplies, or without convenient access to a clinic. If you're unsure about your benefits,{' '}
                    <Link to="/resources/insurance-and-coverage" className="underline hover:text-black transition-colors">
                      we can help you understand your options
                    </Link>{' '}
                    before purchasing.
                  </p>
                </div>
              </motion.div>
            )}
          </FadeIn>
        </section>

        {/* Category Grid */}
        <section className="px-6 md:px-12">
          <FadeIn className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
              Choose a category to explore products tailored to your needs
            </h2>
          </FadeIn>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-[320px] md:h-[400px]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CATEGORY_ORDER.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  productCount={categoryCounts[category.id] || 0}
                  image={CATEGORY_IMAGES[category.id]}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
