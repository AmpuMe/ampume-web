import { motion } from 'framer-motion';

const FILTER_CONFIGS = {
  liners: [
    {
      key: 'ampLevel',
      label: 'Amputation Level',
      options: [
        { value: 'all', label: 'All' },
        { value: 'AK', label: 'Above Knee' },
        { value: 'BK', label: 'Below Knee' },
      ],
      match: (product, value) => {
        if (value === 'all') return true;
        const title = product.title.toLowerCase();
        const tags = (product.tags || []).map(t => t.toLowerCase());
        if (value === 'AK') return title.includes('above-knee') || title.includes('above knee') || tags.includes('ak') || tags.includes('above-knee');
        if (value === 'BK') return title.includes('below-knee') || title.includes('below knee') || tags.includes('bk') || tags.includes('below-knee');
        return true;
      },
    },
    {
      key: 'suspension',
      label: 'Suspension',
      options: [
        { value: 'all', label: 'All' },
        { value: 'cushion', label: 'Cushion' },
        { value: 'locking', label: 'Locking' },
      ],
      match: (product, value) => {
        if (value === 'all') return true;
        const title = product.title.toLowerCase();
        const tags = (product.tags || []).map(t => t.toLowerCase());
        const optionValues = (product.options || []).flatMap(o => o.values || []).map(v => v.toLowerCase());
        return title.includes(value) || tags.includes(value) || optionValues.some(v => v.includes(value));
      },
    },
    {
      key: 'brand',
      label: 'Brand',
      options: [
        { value: 'all', label: 'All' },
        { value: 'WillowWood', label: 'WillowWood' },
        { value: 'ALPS', label: 'ALPS' },
      ],
      match: (product, value) => {
        if (value === 'all') return true;
        return (product.vendor || '').toLowerCase() === value.toLowerCase();
      },
    },
  ],
};

export function getFiltersForCategory(categoryId) {
  return FILTER_CONFIGS[categoryId] || [];
}

export function applyFilters(products, categoryId, activeFilters) {
  const filters = FILTER_CONFIGS[categoryId];
  if (!filters) return products;

  return products.filter(product => {
    return filters.every(filter => {
      const value = activeFilters[filter.key] || 'all';
      return filter.match(product, value);
    });
  });
}

export default function FilterBar({ categoryId, activeFilters, onFilterChange }) {
  const filters = FILTER_CONFIGS[categoryId];
  if (!filters || filters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-wrap gap-6 py-6 border-y border-gray-100"
    >
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {filter.label}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {filter.options.map((option) => {
              const isActive = (activeFilters[filter.key] || 'all') === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onFilterChange(filter.key, option.value)}
                  className={`
                    px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap
                    ${isActive
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
