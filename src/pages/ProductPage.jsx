import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Check, ChevronDown, FileDown } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { fetchProductByHandle, fetchProducts, formatPrice, groupProducts, extractBaseName, extractVariantLabel, getCategoryByProductType } from '../lib/shopify';

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
          // Initialize selected options with first values
          const initialOptions = {};
          result.options?.forEach(option => {
            initialOptions[option.name] = option.values[0];
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

  // Get images
  const images = product?.images?.edges?.map(edge => edge.node) || [];

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

  // Check if variant is available
  const isAvailable = selectedVariant?.availableForSale ?? false;
  const price = selectedVariant?.price?.amount;

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
        title={`${currentGroup ? currentGroup.baseName : product.title} | AmpuMe Shop`}
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

      <main className="pt-32 pb-20 px-6 md:px-12">
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
                {cat ? cat.label : 'Back to Shop'}
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
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                      Color / Fabric
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentGroup.products.map((sibling) => {
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
                <p className="text-2xl font-bold mb-6">
                  {price && price !== '0.00' ? formatPrice(price) : 'Price TBD'}
                </p>

                {/* Options */}
                {product.options?.map(option => (
                  option.values.length > 1 && (
                    <div key={option.id} className="mb-6">
                      <label className="block text-sm font-medium mb-3">
                        {option.name}: <span className="font-normal text-gray-600">{selectedOptions[option.name]}</span>
                      </label>

                      {option.values.length <= 6 ? (
                        // Button style for few options
                        <div className="flex flex-wrap gap-2">
                          {option.values.map(value => (
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
                        // Dropdown for many options
                        <div className="relative">
                          <select
                            value={selectedOptions[option.name]}
                            onChange={(e) => handleOptionChange(option.name, e.target.value)}
                            className="w-full appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                          >
                            {option.values.map(value => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      )}
                    </div>
                  )
                ))}

                {/* Add to Cart */}
                <div className="space-y-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || !isAvailable || !price || price === '0.00'}
                    className={`
                      w-full py-4 px-8 rounded-full font-bold text-center transition-all duration-300
                      flex items-center justify-center gap-2
                      ${addedToCart
                        ? 'bg-green-600 text-white'
                        : isAvailable && price && price !== '0.00'
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
                    ) : !isAvailable ? (
                      'Out of Stock'
                    ) : !price || price === '0.00' ? (
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
                      <strong>Insurance Coverage:</strong> Many prosthetic supplies are covered by insurance.
                      Check your benefits before purchasing.
                    </p>
                  </div>

                  {/* PDF Download for Alpha/WillowWood liners */}
                  {(product.vendor === 'WillowWood' || product.vendor === 'Ohio Willow Wood' || (product.tags || []).some(t => t.toLowerCase().includes('alpha'))) && (
                    <a
                      href="/Important-Instructions-for-Amputees.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <FileDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Important Instructions for Amputees</p>
                        <p className="text-xs text-gray-400">PDF Download</p>
                      </div>
                    </a>
                  )}
                </div>

                {/* Description */}
                {product.descriptionHtml && (
                  <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                      Description
                    </h3>
                    <div
                      className="max-w-none text-gray-600 text-sm leading-relaxed space-y-4 [&_h4]:text-black [&_h4]:font-medium [&_h4]:text-base [&_h4]:mt-6 [&_h4]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-gray-600 [&_p]:text-gray-600"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
