import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play, FileText, List } from 'lucide-react';

const typeConfig = {
  externalLink: { label: 'Link', icon: ArrowUpRight },
  video: { label: 'Video', icon: Play },
  article: { label: 'Article', icon: FileText },
  listing: { label: 'Guide', icon: List },
};

export default function ResourceCard({ resource, pillarSlug, index = 0 }) {
  const config = typeConfig[resource.contentType] || typeConfig.article;
  const TypeIcon = config.icon;

  // External links open in new tab, everything else goes to detail page
  const isExternal = resource.contentType === 'externalLink' && resource.externalUrl;

  const cardContent = (
    <>
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
          <TypeIcon className="w-3.5 h-3.5" />
          {config.label}
        </span>
        {resource.featured && (
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Featured
          </span>
        )}
      </div>

      <h3 className="font-medium text-base mb-2 group-hover:text-gray-600 transition-colors leading-tight">
        {resource.title}
      </h3>

      {resource.editorialSummary && (
        <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-3">
          {resource.editorialSummary}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
        {resource.source && (
          <span className="text-xs text-gray-400">{resource.source}</span>
        )}
        {isExternal && (
          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        )}
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {isExternal ? (
        <a
          href={resource.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block border border-gray-100 rounded-lg p-5 hover:border-gray-300 transition-all duration-300 h-full flex flex-col"
        >
          {cardContent}
        </a>
      ) : (
        <Link
          to={`/resources/${pillarSlug}/${resource.slug?.current}`}
          className="group block border border-gray-100 rounded-lg p-5 hover:border-gray-300 transition-all duration-300 h-full flex flex-col"
        >
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}
