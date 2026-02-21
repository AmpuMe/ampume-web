import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, ChevronDown, Shield, Layers, Lock, Heart, Flame, Flag, Activity, Sparkles, User, Droplets } from 'lucide-react';

const FadeIn = ({ children, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/* ── Feature Icon Mapping ─────────────────────────────────────── */

const FEATURE_ICON_MAP = [
  { keywords: ['transfemoral', 'above-knee', 'AK users', 'transtibial', 'below-knee', 'BK users', 'lower-limb'], icon: User },
  { keywords: ['gel', 'cushion', 'mm distal', 'thickness', 'durometer'], icon: Shield },
  { keywords: ['fabric', 'MAX', 'Spirit', 'Original', 'knit', 'seamless'], icon: Layers },
  { keywords: ['pin-lock', 'locking', 'suspension', 'Reinforced Matrix'], icon: Lock },
  { keywords: ['latex-free', 'hypoallergenic', 'Vitamin E', 'antioxidant', 'skin', 'diabetic'], icon: Heart },
  { keywords: ['moldable', 'heat'], icon: Flame },
  { keywords: ['USA', 'Made in'], icon: Flag },
  { keywords: ['activity', 'K1', 'K2', 'K3', 'K4'], icon: Activity },
  { keywords: ['Grip Gel', 'adhesion', 'conform'], icon: Droplets },
];

function getFeatureIcon(text) {
  for (const { keywords, icon } of FEATURE_ICON_MAP) {
    if (keywords.some(kw => text.includes(kw))) return icon;
  }
  return Sparkles;
}

function getHighlightedFeatures(features) {
  const highlights = [];
  const remaining = [];
  const usedIcons = new Set();

  for (const feat of features) {
    const Icon = getFeatureIcon(feat);
    // Promote to highlight if we haven't used this icon yet and have < 4 highlights
    if (highlights.length < 4 && !usedIcons.has(Icon)) {
      highlights.push({ text: feat, Icon });
      usedIcons.add(Icon);
    } else {
      remaining.push(feat);
    }
  }

  return { highlights, remaining };
}

/* ── Feature Highlights (Two-Tier) ────────────────────────────── */

function FeatureHighlights({ features }) {
  const [expanded, setExpanded] = useState(false);
  const { highlights, remaining } = getHighlightedFeatures(features);

  return (
    <section className="py-16 md:py-20 bg-brand-offwhite">
      <FadeIn className="max-w-6xl mx-auto px-6 md:px-12">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 block">
          Key Features
        </span>

        {/* Tier 1: Highlight cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${highlights.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 mb-6`}>
          {highlights.map((feat, i) => (
            <div key={i} className="bg-white rounded-lg p-5">
              <feat.Icon className="w-5 h-5 text-brand-gold mb-3" />
              <p className="text-sm font-medium text-gray-800 leading-relaxed">{feat.text}</p>
            </div>
          ))}
        </div>

        {/* Tier 2: Expandable remaining features */}
        {remaining.length > 0 && (
          <>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                    {remaining.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 py-2">
                        <Check className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 leading-relaxed">{feat}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
            >
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
              {expanded ? 'Show less' : `View all ${features.length} features`}
            </button>
          </>
        )}
      </FadeIn>
    </section>
  );
}

/* ── Spec Strip ("At a Glance") ───────────────────────────────── */

function SpecStrip({ specs }) {
  const entries = Object.entries(specs);

  return (
    <section className="py-16 md:py-20 border-t border-gray-100">
      <FadeIn className="max-w-4xl mx-auto px-6 md:px-12">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 block text-center">
          At a Glance
        </span>

        {/* Desktop: horizontal row with dividers */}
        <div className="hidden md:flex justify-center items-start gap-0">
          {entries.map(([label, value], i) => (
            <div key={label} className="flex items-start">
              <div className="text-center px-6 lg:px-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-medium text-black">{value}</p>
              </div>
              {i < entries.length - 1 && (
                <div className="w-px h-10 bg-gray-200 flex-shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: 2-col grid */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {entries.map(([label, value]) => (
            <div key={label} className="text-center py-3 bg-brand-offwhite rounded-lg">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
              <p className="text-sm font-medium text-black">{value}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

/* ── Care & Use Tabs ──────────────────────────────────────────── */

const CARE_TABS = [
  { id: 'application', label: 'Application' },
  { id: 'care', label: 'Care' },
  { id: 'precautions', label: 'Precautions' },
];

function CareUseTabs({ applicationInstructions, careInstructions, precautions }) {
  const [activeTab, setActiveTab] = useState('application');

  const panels = {
    application: applicationInstructions,
    care: careInstructions,
    precautions: precautions,
  };

  return (
    <section className="py-16 md:py-20 bg-brand-offwhite">
      <FadeIn className="max-w-4xl mx-auto px-6 md:px-12">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block text-center">
          Care & Use
        </span>
        <p className="text-sm text-gray-500 text-center mb-8">
          Everything you need to know about using your liner.
        </p>

        {/* Tab bar */}
        <div className="flex justify-center gap-8 mb-8 border-b border-gray-200 relative" role="tablist">
          {CARE_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="care-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            role="tabpanel"
            id={`panel-${activeTab}`}
            tabIndex={0}
          >
            {activeTab === 'precautions' ? (
              <ul className="space-y-3 max-w-lg mx-auto">
                {panels[activeTab].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-amber-50 rounded-lg p-4">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <ol className="space-y-4 max-w-lg mx-auto">
                {panels[activeTab].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            )}
          </motion.div>
        </AnimatePresence>
      </FadeIn>
    </section>
  );
}

/* ── Main Component ───────────────────────────────────────────── */

export default function LinerContentSections({ linerDesc }) {
  if (!linerDesc) return null;

  return (
    <>
      {/* 1. Product Overview (unchanged layout) */}
      <section className="py-16 md:py-20 border-t border-gray-100">
        <FadeIn className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                Overview
              </span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                About This Liner
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-4">
              {linerDesc.overview.map((para, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 2. Features (two-tier: highlights + expandable) */}
      <FeatureHighlights features={linerDesc.features} />

      {/* 3. Specs — At a Glance (moved up) */}
      <SpecStrip specs={linerDesc.specs} />

      {/* 4. Fabric Options (BK only, minor gold accent) */}
      {linerDesc.fabricOptions && (
        <section className="py-16 md:py-20 border-t border-gray-100">
          <FadeIn className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
              <div className="md:col-span-4">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                  Fabric Options
                </span>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                  Choose Your Fabric
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {linerDesc.fabricOptions.map((opt, i) => (
                    <div key={i} className="bg-brand-offwhite rounded-lg p-5 border-l-2 border-brand-gold">
                      <h4 className="text-sm font-bold mb-2">{opt.name}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      )}

      {/* 5. Technology (ALPS GP only) */}
      {(linerDesc.gelTechnology || linerDesc.fabricTechnology) && (
        <section className="py-16 md:py-20 bg-brand-offwhite">
          <FadeIn className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
              <div className="md:col-span-4">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                  Technology
                </span>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                  Built for Performance
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6 space-y-6">
                {linerDesc.gelTechnology && (
                  <div>
                    <h4 className="text-sm font-bold mb-2">Gel Technology</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{linerDesc.gelTechnology}</p>
                  </div>
                )}
                {linerDesc.fabricTechnology && (
                  <div>
                    <h4 className="text-sm font-bold mb-2">Fabric Technology</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{linerDesc.fabricTechnology}</p>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </section>
      )}

      {/* 6. Suspension Options (ALPS GP only) */}
      {linerDesc.suspensionOptions && (
        <section className="py-16 md:py-20 border-t border-gray-100">
          <FadeIn className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
              <div className="md:col-span-4">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                  Suspension
                </span>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                  Suspension Options
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {linerDesc.suspensionOptions.map((opt, i) => (
                    <div key={i} className="bg-brand-offwhite rounded-lg p-5">
                      <h4 className="text-sm font-bold mb-2">{opt.name}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      )}

      {/* 7. Care & Use (tabbed) */}
      <CareUseTabs
        applicationInstructions={linerDesc.applicationInstructions}
        careInstructions={linerDesc.careInstructions}
        precautions={linerDesc.precautions}
      />
    </>
  );
}
