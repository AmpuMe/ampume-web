import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Shield, Layers, Grip, Package, ArrowRight } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { fetchProducts, groupProducts, categorizeGroups, CATEGORY_ORDER } from '../lib/shopify';

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

const ICON_MAP = {
  Shield,
  Layers,
  Grip,
  Package,
};

function CategoryCard({ category, productCount, index }) {
  const Icon = ICON_MAP[category.icon] || Package;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/shop/${category.id}`}
        className="group block bg-brand-offwhite rounded-lg p-8 md:p-10 hover:bg-gray-100 transition-colors h-full"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-gray-700" />
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
        </div>

        <h3 className="text-xl font-medium mb-2 group-hover:text-gray-700 transition-colors">
          {category.label}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          {category.description}
        </p>

        {productCount > 0 && (
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {productCount} product{productCount !== 1 ? 's' : ''}
          </span>
        )}
      </Link>
    </motion.div>
  );
}

export default function ShopPage() {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
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
        title="Shop Prosthetic Supplies | AmpuMe"
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
              The AmpuMe Shop
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
              Curated by prosthetic professionals.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Every product hand-selected to support your comfort, mobility, and independence.
            </p>
          </FadeIn>

          {/* Insurance Notice */}
          <FadeIn delay={0.15} className="mt-4 max-w-3xl">
            <div className="border border-gray-100 p-6 rounded-lg">
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong className="text-black">Have insurance coverage?</strong> Many prosthetic supplies
                are covered by insurance plans. We recommend checking your benefits before purchasing
                out-of-pocket.{' '}
                <Link to="/resources/ask-an-insurance-expert" className="underline hover:text-black transition-colors">
                  Ask an insurance expert
                </Link>{' '}
                to find out what's covered. These products are also ideal for backup supplies, travel, or when you need
                items outside your coverage period.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Category Grid */}
        <section className="px-6 md:px-12">
          <FadeIn className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
              Shop by Category
            </h2>
          </FadeIn>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-50 rounded-lg h-56" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CATEGORY_ORDER.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  productCount={categoryCounts[category.id] || 0}
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
