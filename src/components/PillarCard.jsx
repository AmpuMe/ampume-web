import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Cog, Sun, Users, BookOpen, Shield } from 'lucide-react';

const iconMap = {
  Heart,
  Cog,
  Sun,
  Users,
  BookOpen,
  Shield,
};

export default function PillarCard({ pillar, index = 0 }) {
  const IconComponent = iconMap[pillar.icon] || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/resources/${pillar.slug?.current}`}
        className="group block border border-gray-100 rounded-lg p-6 md:p-8 hover:border-gray-300 transition-all duration-300 h-full"
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: pillar.color ? `${pillar.color}20` : '#F5F5F5' }}
          >
            <IconComponent
              className="w-5 h-5"
              style={{ color: pillar.color || '#000' }}
            />
          </div>
          {pillar.resourceCount > 0 && (
            <span className="text-xs text-gray-400">
              {pillar.resourceCount} {pillar.resourceCount === 1 ? 'resource' : 'resources'}
            </span>
          )}
        </div>

        <h3 className="text-lg font-medium mb-2 group-hover:text-gray-600 transition-colors">
          {pillar.title}
        </h3>

        {pillar.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
            {pillar.description}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
