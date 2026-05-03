import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Check, ZoomIn, X } from 'lucide-react';
import Select from '../components/Select';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import SizingGuide from '../components/SizingGuide';
import LinerContentSections from '../components/LinerContentSections';
import { useCart } from '../context/CartContext';
import { fetchProductByHandle, fetchProducts, formatPrice, groupProducts, extractBaseName, extractVariantLabel, getCategoryByProductType } from '../lib/shopify';
import { findLinerDescription } from '../data/linerDescriptions';
import { findProductDescription } from '../data/productDescriptions';

// Sort option values by option name context
const SORT_ORDERS = {
  fabric: ['original', 'spirit', 'max'],
  thickness: ['3mm', '6mm', '9mm'],
  ply: ['lightweight', '1-ply', '1 ply', '3-ply', '3 ply', '5-ply', '5 ply'],
  width: ['narrow', 'regular', 'wide'],
  length: ['xshort', 'x-short', 'extra short', 'short', 'medium', 'long', 'extra long'],
  size: [
    'x-small', 'extra small', 'xs',
    'small',
    'medium',
    'medium+', 'med+',
    'large',
    'large+', 'lrg+',
    'x-large', 'extra large', 'xl',
    'extra large+', 'xl+',
    'xx-large', 'xxl', '2xl',
  ],
};

// Map option names to sort orders
const OPTION_NAME_MAP = {
  fabric: 'fabric',
  thickness: 'thickness',
  ply: 'ply',
  width: 'width',
  length: 'length',
  size: 'size',
};

// Flat fallback order for unknown option names
const FALLBACK_ORDER = [
  ...SORT_ORDERS.fabric,
  ...SORT_ORDERS.thickness,
  ...SORT_ORDERS.ply,
  ...SORT_ORDERS.width,
  ...SORT_ORDERS.size,
  ...SORT_ORDERS.length,
];

function sortOptionValues(values, optionName = '') {
  // Pick the right sort order based on option name
  const key = OPTION_NAME_MAP[optionName.toLowerCase()];
  const order = key ? SORT_ORDERS[key] : FALLBACK_ORDER;

  // Numeric-first heuristic: values that begin with a number (e.g. "16cm", "3mm")
  // always sort ascending BEFORE any named-size values like "X-Large".
  const startsWithNumber = (v) => /^\d/.test(v.trim());

  return [...values].sort((a, b) => {
    const aNumeric = startsWithNumber(a);
    const bNumeric = startsWithNumber(b);
    if (aNumeric && !bNumeric) return -1;
    if (!aNumeric && bNumeric) return 1;
    if (aNumeric && bNumeric) {
      const aNum = parseFloat(a.replace(/[^\d.]/g, ''));
      const bNum = parseFloat(b.replace(/[^\d.]/g, ''));
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    }

    const al = a.toLowerCase();
    const bl = b.toLowerCase();

    const ai = order.findIndex(s => al === s || al.includes(s));
    const bi = order.findIndex(s => bl === s || bl.includes(s));
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;

    return al.localeCompare(bl);
  });
}

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

export default function ProductPage() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [chartZoomOpen, setChartZoomOpen] = useState(false);

  useEffect(() => {
    if (!chartZoomOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setChartZoomOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [chartZoomOpen]);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  const { addToCart, cartCount, openCart } = useCart();

  // Fetch sibling products for color/fabric navigation
  useEffect(() => {
    const loadSiblings = async () => {
      try {
        const result = await fetchProducts(100);
        const productList = result?.edges?.map(edge => edge.node) || [];
        const groups = groupProducts(productList);
        const myGroup = groups.find(g => g.handles.includes(handle));
        setCurrentGroup(myGroup && myGroup.products.length > 1 ? myGroup : null);
      } catch (err) {
        console.error('Error loading siblings:', err);
      }
    };
    loadSiblings();
  }, [handle]);

  // Fetch product on mount
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const result = await fetchProductByHandle(handle);
        if (result) {
          setProduct(result);
          // Decide whether to pre-select option values on load.
          //
          // Pre-selecting leftmost defaults is convenient for products with
          // dense variant matrices (every combination exists), but for sparse
          // matrices — common with liners that have Fabric × Thickness × Size
          // — the defaults force other groups to grey out values that ARE
          // available with a different choice. That misleads users. For those
          // products, load with nothing selected so the full landscape is
          // visible and the user can explore.
          const opts = result.options?.filter(o => o.values.length > 1) || [];
          const variants = result.variants?.edges?.map(e => e.node) || [];
          const maxCombos = opts.reduce((acc, o) => acc * o.values.length, 1);
          const isSparse = opts.length >= 2 && variants.length < maxCombos;

          // Try to restore last session's picks for this product first.
          let stored = null;
          try {
            const raw = typeof window !== 'undefined' && sessionStorage.getItem(`product-options:${handle}`);
            if (raw) stored = JSON.parse(raw);
          } catch { /* ignore */ }

          const initialOptions = {};
          result.options?.forEach(option => {
            const storedVal = stored?.[option.name];
            const isValidStored = storedVal && option.values.includes(storedVal);
            if (isValidStored) {
              initialOptions[option.name] = storedVal;
            } else if (isSparse) {
              // Empty string = not yet chosen; isOptionValueAvailable treats
              // missing selections as "any value matches", so everything
              // renders as available on load.
              initialOptions[option.name] = '';
            } else {
              const sorted = sortOptionValues(option.values, option.name);
              initialOptions[option.name] = sorted[0] || '';
            }
          });
          setSelectedOptions(initialOptions);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  // Persist picks per-product so nav-away-and-back doesn't wipe them
  useEffect(() => {
    if (!product || Object.keys(selectedOptions).length === 0) return;
    try {
      sessionStorage.setItem(`product-options:${handle}`, JSON.stringify(selectedOptions));
    } catch { /* ignore quota errors */ }
  }, [selectedOptions, handle, product]);

  // Find the selected variant based on options (exact match)
  const selectedVariant = useMemo(() => {
    if (!product?.variants?.edges) return null;

    return product.variants.edges.find(({ node: variant }) => {
      return variant.selectedOptions.every(
        option => selectedOptions[option.name] === option.value
      );
    })?.node;
  }, [product, selectedOptions]);

  // When the leftmost defaults don't form a real variant, find the closest one
  // so pricing and Add to Cart still work on page load.
  const bestVariant = useMemo(() => {
    if (selectedVariant) return selectedVariant;
    if (!product?.variants?.edges) return null;
    let best = null;
    let bestScore = -1;
    for (const { node: v } of product.variants.edges) {
      const score = v.selectedOptions.reduce(
        (s, o) => s + (selectedOptions[o.name] === o.value ? 1 : 0), 0
      );
      if (score > bestScore) { best = v; bestScore = score; }
    }
    return best;
  }, [product, selectedOptions, selectedVariant]);

  // For a given option name + value, would any real variant exist given the
  // current selections of the OTHER options? Used to grey out impossible combos.
  const isOptionValueAvailable = (optionName, value) => {
    if (!product?.variants?.edges) return true;
    return product.variants.edges.some(({ node: v }) => {
      return v.selectedOptions.every(o => {
        if (o.name === optionName) return o.value === value;
        const sel = selectedOptions[o.name];
        return !sel || sel === o.value;
      });
    });
  };

  // Get raw images from Shopify
  const rawImages = product?.images?.edges?.map(edge => edge.node) || [];

  // Handle option change — supports three behaviors:
  //   1. Click an unselected, compatible value → select it
  //   2. Click the currently-selected value → deselect (toggle off)
  //   3. Click a value that's incompatible with current picks → select it
  //      and clear any other-group picks that conflict, so the user can
  //      freely pivot without having to manually deselect first
  const handleOptionChange = (optionName, value) => {
    setAddedToCart(false);
    setSelectedOptions(prev => {
      const currentlySelected = prev[optionName] === value;
      if (currentlySelected) {
        return { ...prev, [optionName]: '' };
      }
      // Would the new combo have any matching variant? If not, clear other
      // groups that conflict — starting from the LAST one the user set.
      const tentative = { ...prev, [optionName]: value };
      const hasMatch = (sel) =>
        product?.variants?.edges?.some(({ node: v }) =>
          v.selectedOptions.every(o => !sel[o.name] || sel[o.name] === o.value)
        );
      if (!hasMatch(tentative)) {
        // Clear other selections one at a time until the pick is consistent.
        for (const o of (product?.options || [])) {
          if (o.name === optionName) continue;
          if (!tentative[o.name]) continue;
          tentative[o.name] = '';
          if (hasMatch(tentative)) break;
        }
      }
      return tentative;
    });
  };

  const handleAddToCart = async () => {
    // Only add once every option is chosen and a concrete variant resolves.
    if (!selectedVariant) return;

    setIsAdding(true);
    try {
      await addToCart(selectedVariant.id, 1);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  // Which option groups (with >1 value) haven't been picked yet?
  const unpickedOptions = (product?.options || [])
    .filter(o => o.values.length > 1 && !selectedOptions[o.name])
    .map(o => o.name);

  const allOptionsChosen = unpickedOptions.length === 0;

  // Price display: exact variant price once fully resolved, otherwise the
  // product-level min/max range while the user is still exploring.
  const minPrice = product?.priceRange?.minVariantPrice?.amount;
  const maxPrice = product?.priceRange?.maxVariantPrice?.amount;
  const price = allOptionsChosen
    ? (selectedVariant?.price?.amount || bestVariant?.price?.amount || minPrice)
    : minPrice;
  const showPriceRange = !allOptionsChosen && minPrice && maxPrice && minPrice !== maxPrice;

  // Progressive Add-to-Cart label — narrates what's still missing.
  const formatList = (items) => {
    if (items.length <= 1) return items.join('');
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
  };
  const addToCartLabel = allOptionsChosen
    ? 'Add to Cart'
    : `Select ${formatList(unpickedOptions.map(n => n.toLowerCase()))}`;

  // Detect product type for enhanced layout
  const baseName = currentGroup ? currentGroup.baseName : product?.title;
  const linerDesc = baseName ? findLinerDescription(baseName) : null;
  const productDesc = !linerDesc && product?.title ? findProductDescription(product.title) : null;
  const isLiner = !!linerDesc;
  const hasEnhancedLayout = isLiner || !!productDesc;
  // Use whichever description is available for shared logic
  const activeDesc = linerDesc || productDesc;

  // Filter and inject sizing chart/measurement images into gallery
  const images = useMemo(() => {
    const title = (product?.title || '').toLowerCase();
    let imgs = [...rawImages];

    // Remove 3rd image from Alpha Classic BK products (not applicable to BK profile)
    const isAlphaClassicBK = title.includes('alpha') && title.includes('classic') &&
      (title.includes('below-knee') || title.includes('below knee') || title.includes('bk'));
    if (isAlphaClassicBK && imgs.length >= 3) {
      imgs = imgs.filter((_, i) => i !== 2);
    }

    // Inject sizing chart image into gallery for products with sizing data
    const sizingType = activeDesc?.sizingType;
    if (sizingType) {
      const chartMap = {
        'alpha-ak': '/images/sizing/ak-sizing-chart.webp',
        'alpha-bk': '/images/sizing/bk-sizing-chart.webp',
        'easyliner': '/images/sizing/easyliner-sizing-chart.webp',
        'alps-gp': '/images/sizing/alps-gp-sizing-chart.webp',
        'sock': '/images/sizing/sock-sizing-chart.webp',
        'sleeve-bk': '/images/sizing/sleeve-sizing-chart.webp',
      };
      const chartUrl = chartMap[sizingType];
      if (chartUrl) {
        imgs.push({ url: chartUrl, altText: 'Sizing chart' });
      }
    }

    return imgs;
  }, [product, rawImages, linerDesc]);

  // SEO renders in every state so the prerendered HTML always carries
  // tags. Real product-specific titles for crawlers come from the
  // build-time prerender override (see prerender.js).
  const seoTitle = product
    ? `${currentGroup ? currentGroup.baseName : product.title} | AmpuMe Store`
    : 'Shop | AmpuMe';
  const seoDesc = product?.description || 'Shop prosthetic supplies at AmpuMe.';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SEO title={seoTitle} description={seoDesc} url={`https://ampume.com/shop/${handle}`} />
        <SimpleNavbar />
        <div className="pt-32 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-100 animate-pulse rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-100 animate-pulse rounded w-3/4" />
                <div className="h-6 bg-gray-100 animate-pulse rounded w-1/4" />
                <div className="h-32 bg-gray-100 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <SEO title={seoTitle} description={seoDesc} url={`https://ampume.com/shop/${handle}`} />
        <SimpleNavbar />
        <div className="pt-32 px-6 md:px-12 text-center">
          <h1 className="text-2xl font-medium mb-4">Product not found</h1>
          <p className="text-gray-500 mb-8">{error || 'This product may no longer be available.'}</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title={`${currentGroup ? currentGroup.baseName : product.title} | AmpuMe Store`}
        description={product.description || `Shop ${product.title} at AmpuMe`}
        url={`https://ampume.com/shop/${handle}`}
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

      <main className={`pt-32 px-6 md:px-12 ${hasEnhancedLayout ? 'pb-8' : 'pb-20'}`}>
        {/* Back Link */}
        <FadeIn className="mb-8">
          {(() => {
            const cat = getCategoryByProductType(product.productType);
            return (
              <Link
                to={cat ? `/shop/${cat.id}` : '/shop'}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {cat ? cat.label : 'AmpuMe Store'}
              </Link>
            );
          })()}
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
            <FadeIn>
              <div className="space-y-4">
                {/* Main Image — sizing charts render at natural aspect so they stay legible */}
                {(() => {
                  const current = images[selectedImage];
                  const isChart = current?.url?.includes('/sizing/') && current.url.includes('-sizing-chart');
                  if (isChart) {
                    return (
                      <button
                        type="button"
                        onClick={() => setChartZoomOpen(true)}
                        className="group relative block w-full bg-white rounded-lg overflow-hidden border border-gray-100 cursor-zoom-in"
                        aria-label="View full-size sizing chart"
                      >
                        <img
                          src={current.url}
                          alt={current.altText || product.title}
                          className="w-full h-auto block"
                        />
                        <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full pl-2.5 pr-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-sm group-hover:bg-white group-hover:border-gray-400 transition-colors">
                          <ZoomIn className="w-3.5 h-3.5" />
                          Click to enlarge
                        </span>
                      </button>
                    );
                  }
                  return (
                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                      {current ? (
                        <img
                          src={current.url}
                          alt={current.altText || product.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-300">No image</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(index)}
                        className={`
                          flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors
                          ${selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'}
                        `}
                      >
                        <img
                          src={image.url}
                          alt={image.altText || `${product.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Product Info */}
            <FadeIn delay={0.1}>
              <div className="lg:sticky lg:top-32">
                {/* Vendor & Type */}
                <div className="flex items-center gap-3 mb-4">
                  {product.vendor && (
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {product.vendor}
                    </span>
                  )}
                  {product.productType && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {product.productType}
                      </span>
                    </>
                  )}
                </div>

                {/* Color/Fabric Navigation */}
                {currentGroup && (
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Color / Fabric
                      </p>
                      {linerDesc?.fabricOptions && (
                        <a
                          href="#fabric"
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById('fabric');
                            if (el) {
                              const top = el.getBoundingClientRect().top + window.scrollY - 80;
                              window.scrollTo({ top, behavior: 'smooth' });
                            }
                          }}
                          className="text-xs text-black hover:text-gray-500 transition-colors underline underline-offset-2"
                        >
                          What's the difference?
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[...currentGroup.products].sort((a, b) => {
                        // Sort fabric variants: Original first, then Spirit, then MAX, then alphabetical
                        const la = extractVariantLabel(a.title, currentGroup.baseName).toLowerCase();
                        const lb = extractVariantLabel(b.title, currentGroup.baseName).toLowerCase();
                        const fabricOrder = ['original', 'spirit', 'max'];
                        const ai = fabricOrder.findIndex(f => la.includes(f));
                        const bi = fabricOrder.findIndex(f => lb.includes(f));
                        if (ai !== -1 && bi !== -1) return ai - bi;
                        if (ai !== -1) return -1;
                        if (bi !== -1) return 1;
                        return la.localeCompare(lb);
                      }).map((sibling) => {
                        const label = extractVariantLabel(sibling.title, currentGroup.baseName);
                        const isCurrent = sibling.handle === handle;
                        return (
                          <Link
                            key={sibling.handle}
                            to={`/shop/${sibling.handle}`}
                            className={`
                              px-4 py-2 text-sm border rounded-full transition-colors
                              ${isCurrent
                                ? 'border-black bg-black text-white'
                                : 'border-gray-200 hover:border-gray-400 text-gray-600'
                              }
                            `}
                          >
                            {label || 'Standard'}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-1">
                  {currentGroup ? currentGroup.baseName : product.title}
                </h1>
                {currentGroup ? (
                  <p className="text-lg text-gray-500 mb-4">
                    {extractVariantLabel(product.title, currentGroup.baseName) || 'Standard'}
                  </p>
                ) : (
                  <div className="mb-4" />
                )}

                {/* Price — shows a range until all options are picked */}
                <p className="text-2xl font-bold mb-4">
                  {showPriceRange
                    ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                    : price && price !== '0.00'
                      ? formatPrice(price)
                      : 'Price TBD'}
                </p>

                {/* Short description for liner products */}
                {activeDesc && (
                  <div className="mb-6 space-y-3">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {activeDesc.shortDescription || activeDesc.overview?.[0]}
                    </p>
                    {(() => {
                      const stdConfig = activeDesc.overview?.find(p => p.startsWith('Standard Configuration:'));
                      if (!stdConfig) return null;
                      const rest = stdConfig.replace(/^Standard Configuration:\s*/, '');
                      return (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          <strong className="font-bold text-black">Standard Configuration:</strong> {rest}
                        </p>
                      );
                    })()}
                    {(() => {
                      const xl = activeDesc.overview?.find(p => p.startsWith('XL Size:'));
                      if (!xl) return null;
                      const rest = xl.replace(/^XL Size:\s*/, '');
                      return (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          <strong className="font-bold text-black">XL Size:</strong> {rest}
                        </p>
                      );
                    })()}
                  </div>
                )}

                {/* Options */}
                {product.options?.map(option => (
                  option.values.length > 1 && (
                    <div key={option.id} className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <label className="text-sm font-medium">
                          {option.name}: <span className="font-normal text-gray-600">{selectedOptions[option.name] || ''}</span>
                        </label>
                        {option.name.toLowerCase() === 'fabric' && linerDesc?.fabricOptions && (
                          <a
                            href="#fabric"
                            onClick={(e) => {
                              e.preventDefault();
                              const el = document.getElementById('fabric');
                              if (el) {
                                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                                window.scrollTo({ top, behavior: 'smooth' });
                              }
                            }}
                            className="text-xs text-black hover:text-gray-500 transition-colors underline underline-offset-2"
                          >
                            What's the difference?
                          </a>
                        )}
                      </div>

                      {option.values.length <= 6 ? (
                        // Button style for few options — all clickable;
                        // unavailable values stay pickable (and clearing
                        // conflicting picks is handled in handleOptionChange)
                        <div className="flex flex-wrap gap-2">
                          {sortOptionValues(option.values, option.name).map(value => {
                            const isSelected = selectedOptions[option.name] === value;
                            const available = isOptionValueAvailable(option.name, value);
                            return (
                              <button
                                key={value}
                                onClick={() => handleOptionChange(option.name, value)}
                                title={!available && !isSelected ? 'Not available with the current selection — click to switch' : undefined}
                                className={`
                                  px-4 py-2 text-sm border rounded-full transition-colors
                                  ${isSelected
                                    ? 'border-black bg-black text-white'
                                    : available
                                      ? 'border-gray-200 hover:border-gray-400'
                                      : 'border-gray-100 text-gray-300 hover:border-gray-300 hover:text-gray-500'
                                  }
                                `}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        // Custom dropdown for many options
                        <Select
                          options={sortOptionValues(option.values, option.name).map(v => ({
                            value: v,
                            label: v,
                            disabled: !isOptionValueAvailable(option.name, v) && selectedOptions[option.name] !== v,
                          }))}
                          value={selectedOptions[option.name]}
                          onChange={(v) => handleOptionChange(option.name, v)}
                          placeholder="Select a size"
                        />
                      )}
                    </div>
                  )
                ))}

                {/* Add to Cart */}
                <div className="space-y-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || !allOptionsChosen || !selectedVariant || !price || price === '0.00'}
                    className={`
                      w-full py-4 px-8 rounded-full font-bold text-center transition-all duration-300
                      flex items-center justify-center gap-2
                      ${addedToCart
                        ? 'bg-green-600 text-white'
                        : allOptionsChosen && selectedVariant && price && price !== '0.00'
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : isAdding ? (
                      'Adding...'
                    ) : !allOptionsChosen ? (
                      addToCartLabel
                    ) : !selectedVariant || !price || price === '0.00' ? (
                      'Price Coming Soon'
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>

                  {/* Insurance Notice */}
                  <div className="bg-brand-offwhite p-4 rounded-lg">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      <strong>Insurance Coverage:</strong> Many prosthetic supplies are covered by insurance.{' '}
                      <Link to="/resources/insurance-and-coverage" className="underline hover:text-black transition-colors">
                        Check your benefits
                      </Link>{' '}
                      before purchasing.
                    </p>
                  </div>

                </div>

                {/* Non-liner: Description */}
                {!hasEnhancedLayout && product.descriptionHtml ? (
                  <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                      Description
                    </h3>
                    <div
                      className="max-w-none text-gray-600 text-sm leading-relaxed space-y-4 [&_h4]:text-black [&_h4]:font-medium [&_h4]:text-base [&_h4]:mt-6 [&_h4]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-gray-600 [&_p]:text-gray-600"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                  </div>
                ) : null}
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      {/* Horizontal Anchor Bar — for any product with enhanced layout */}
      {hasEnhancedLayout && activeDesc && (
        <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm pt-2">
          <div className="max-w-6xl mx-auto px-4 md:px-12 flex justify-center gap-4 sm:gap-6 md:gap-8 flex-wrap">
            {[
              ...(activeDesc.fabricOptions ? [{ label: 'Fabric', id: 'fabric' }] : []),
              ...(activeDesc.sizingType ? [{ label: 'Sizing & Fit', id: 'sizing-guide' }] : []),
              { label: 'Overview', id: 'overview' },
              { label: 'Features', id: 'features' },
              { label: 'Care & Maintenance', id: 'care-maintenance' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(item.id);
                  if (el) {
                    const offset = 80;
                    const top = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 hover:text-black transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-black"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Full-width product content sections */}
      {hasEnhancedLayout && activeDesc && (
        <>
          {/* Fabric section renders before Sizing for BK liner products with fabric options */}
          {isLiner && (
            <LinerContentSections
              linerDesc={activeDesc}
              showPdfDownload={product.vendor === 'WillowWood' || product.vendor === 'Ohio Willow Wood' || (product.tags || []).some(t => t.toLowerCase().includes('alpha'))}
              renderFabricOnly
            />
          )}
          {activeDesc.sizingType && (
            <SizingGuide sizingType={activeDesc.sizingType} measuringGuide={activeDesc.measuringGuide} />
          )}
          <LinerContentSections
            linerDesc={activeDesc}
            showPdfDownload={isLiner && (product.vendor === 'WillowWood' || product.vendor === 'Ohio Willow Wood' || (product.tags || []).some(t => t.toLowerCase().includes('alpha')))}
            skipFabric
          />
        </>
      )}

      <Footer />

      {/* Sizing chart zoom modal */}
      {chartZoomOpen && (() => {
        const chartImg = images.find(
          (im) => im?.url?.includes('/sizing/') && im.url.includes('-sizing-chart')
        );
        if (!chartImg) return null;
        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setChartZoomOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setChartZoomOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Sizing chart"
          >
            <button
              type="button"
              onClick={() => setChartZoomOpen(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={chartImg.url}
              alt={chartImg.altText || 'Sizing chart'}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[95vw] max-h-[90vh] w-auto h-auto bg-white rounded-lg shadow-2xl"
            />
          </div>
        );
      })()}
    </div>
  );
}
