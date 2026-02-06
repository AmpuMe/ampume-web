import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '../lib/shopify';

export default function ProductCard({ product, index = 0 }) {
  const image = product.images?.edges?.[0]?.node;
  const minPrice = product.priceRange?.minVariantPrice?.amount;
  const maxPrice = product.priceRange?.maxVariantPrice?.amount;
  const hasVariants = product.variants?.edges?.length > 1;

  // Format price display
  const priceDisplay = () => {
    if (!minPrice || minPrice === '0.00') {
      return 'Price TBD';
    }
    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    }
    return `From ${formatPrice(minPrice)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/shop/${product.handle}`}
        className="group block"
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-gray-300 text-sm">No image</span>
            </div>
          )}

          {/* Product Type Badge */}
          {product.productType && (
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white text-black px-2 py-1 rounded">
                {product.productType}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-medium text-sm leading-tight group-hover:text-gray-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {product.vendor && (
            <p className="text-xs text-gray-400">
              {product.vendor}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <p className="font-bold text-sm">
              {priceDisplay()}
            </p>

            {hasVariants && (
              <span className="text-xs text-gray-400">
                {product.variants.edges.length} options
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
