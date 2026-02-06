import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '../lib/shopify';

export default function ProductCard({ group, index = 0 }) {
  const { baseName, primaryProduct, products, minPrice, maxPrice, optionCount } = group;
  const image = primaryProduct.images?.edges?.[0]?.node;
  const isGrouped = products.length > 1;

  const priceDisplay = () => {
    if (!minPrice || minPrice === 0) return 'Price TBD';
    if (minPrice === maxPrice) return formatPrice(minPrice);
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
        to={`/shop/${primaryProduct.handle}`}
        className="group block"
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || baseName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-gray-300 text-sm">No image</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-medium text-sm leading-tight group-hover:text-gray-600 transition-colors line-clamp-2">
            {baseName}
          </h3>

          {primaryProduct.vendor && (
            <p className="text-xs text-gray-400">
              {primaryProduct.vendor}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <p className="font-bold text-sm">
              {priceDisplay()}
            </p>

            {isGrouped && (
              <span className="text-xs text-gray-400">
                {optionCount} options
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
