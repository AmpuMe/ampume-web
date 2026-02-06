import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ShoppingBag } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { fetchProducts, groupProducts } from '../lib/shopify';

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

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const { cartCount, openCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const result = await fetchProducts(100);
        const productList = result?.edges?.map(edge => edge.node) || [];
        setProducts(productList);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Get unique product types for filter pills
  const productTypes = useMemo(() => {
    const types = new Set(products.map(p => p.productType).filter(Boolean));
    return ['all', ...Array.from(types)];
  }, [products]);

  // Group products, then filter by search and type
  const filteredGroups = useMemo(() => {
    const groups = groupProducts(products);

    return groups.filter(group => {
      const matchesType = selectedType === 'all' || group.productType === selectedType;

      const matchesSearch = !searchQuery || (() => {
        const q = searchQuery.toLowerCase();
        return (
          group.baseName.toLowerCase().includes(q) ||
          group.vendor?.toLowerCase().includes(q) ||
          group.productType?.toLowerCase().includes(q) ||
          group.products.some(p => p.title.toLowerCase().includes(q))
        );
      })();

      return matchesType && matchesSearch;
    });
  }, [products, searchQuery, selectedType]);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title="Shop Prosthetic Supplies | AmpuMe"
        description="Browse prosthetic liners, socks, sleeves, and accessories. Quality supplies for amputees, shipped directly to you."
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
        <section className="px-6 md:px-12 mb-16">
          <FadeIn className="max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">
              Marketplace
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
              Prosthetic Supplies
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
              Quality liners, socks, sleeves, and accessories for your prosthetic needs.
              Shipped directly to your door.
            </p>
          </FadeIn>

          {/* Insurance Notice */}
          <FadeIn delay={0.1} className="mt-8 max-w-2xl">
            <div className="bg-brand-offwhite border border-gray-100 p-6 rounded-lg">
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong className="text-black">Have insurance coverage?</strong> Many prosthetic supplies
                are covered by insurance plans. We recommend checking your benefits before purchasing
                out-of-pocket. These products are ideal for backup supplies, travel, or when you need
                items outside your coverage period.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Search & Filter */}
        <section className="px-6 md:px-12 mb-12 border-y border-gray-100 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Type Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {productTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`
                    px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap
                    ${selectedType === type
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {type === 'all' ? 'All Products' : type}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="px-6 md:px-12">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4" />
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
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-2">No products found</p>
              <p className="text-sm text-gray-400">
                {searchQuery ? 'Try a different search term' : 'Check back soon for new products'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-8">
                {filteredGroups.length} product{filteredGroups.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredGroups.map((group, index) => (
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
