import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
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

  return [...values].sort((a, b) => {
    const al = a.toLowerCase();
    const bl = b.toLowerCase();

    const ai = order.findIndex(s => al === s || al.includes(s));
    const bi = order.findIndex(s => bl === s || bl.includes(s));
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;

    // Numeric fallback
    const aNum = parseFloat(a.replace(/[^\d.]/g, ''));
    const bNum = parseFloat(b.replace(/[^\d.]/g, ''));
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;

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
          // Initialize selected options — cascade through options left-to-right,
          // always picking the leftmost sorted value that still maps to a real variant.
          const initialOptions = {};
          const variants = result.variants?.edges?.map(e => e.node) || [];
          let remaining = variants;

          result.options?.forEach(option => {
            const sorted = sortOptionValues(option.values, option.name);
            const chosen = sorted.find(val =>
              remaining.some(v => v.selectedOptions.some(o => o.name === option.name && o.value === val))
            ) || sorted[0] || '';
            initialOptions[option.name] = chosen;
            remaining = remaining.filter(v =>
              v.selectedOptions.some(o => o.name === option.name && o.value === chosen)
            );
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

  // Find the selected variant based on options
  const selectedVariant = useMemo(() => {
    if (!product?.variants?.edges) return null;

    return product.variants.edges.find(({ node: variant }) => {
      return variant.selectedOptions.every(
        option => selectedOptions[option.name] === option.value
      );
    })?.node;
  }, [product, selectedOptions]);

  // Get raw images from Shopify
  const rawImages = product?.images?.edges?.map(edge => edge.node) || [];

  // Handle option change
  const handleOptionChange = (optionName, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
    setAddedToCart(false);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
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

  // Prefer the selected variant's price; fall back to the product's minimum price
  // so the page always displays a real number when Shopify pricing is set.
  const price = selectedVariant?.price?.amount || product?.priceRange?.minVariantPrice?.amount;

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
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
                {/* Main Image */}
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  {images[selectedImage] ? (
                    <img
                      src={images[selectedImage].url}
                      alt={images[selectedImage].altText || product.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-300">No image</span>
                    </div>
                  )}
                </div>

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

                {/* Price */}
                <p className="text-2xl font-bold mb-4">
                  {price && price !== '0.00' ? formatPrice(price) : 'Price TBD'}
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
                        // Button style for few options
                        <div className="flex flex-wrap gap-2">
                          {sortOptionValues(option.values, option.name).map(value => (
                            <button
                              key={value}
                              onClick={() => handleOptionChange(option.name, value)}
                              className={`
                                px-4 py-2 text-sm border rounded-full transition-colors
                                ${selectedOptions[option.name] === value
                                  ? 'border-black bg-black text-white'
                                  : 'border-gray-200 hover:border-gray-400'
                                }
                              `}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      ) : (
                        // Custom dropdown for many options
                        <Select
                          options={sortOptionValues(option.values, option.name).map(v => ({ value: v, label: v }))}
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
                    disabled={isAdding || !selectedVariant || !price || price === '0.00'}
                    className={`
                      w-full py-4 px-8 rounded-full font-bold text-center transition-all duration-300
                      flex items-center justify-center gap-2
                      ${addedToCart
                        ? 'bg-green-600 text-white'
                        : selectedVariant && price && price !== '0.00'
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
    </div>
  );
}
