import { motion } from 'framer-motion';
import { Check, AlertTriangle, FileDown } from 'lucide-react';

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

export default function LinerContentSections({ linerDesc, showPdfDownload, renderFabricOnly = false, skipFabric = false }) {
  if (!linerDesc) return null;

  // When renderFabricOnly, only show the fabric section (rendered before SizingGuide)
  if (renderFabricOnly) {
    if (!linerDesc.fabricOptions) return null;
    return (
      <section id="fabric" className="py-16 md:py-20 border-t border-gray-100">
        <FadeIn className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                Fabric Options
              </span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                Fabric Options
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {linerDesc.fabricOptions.map((opt, i) => (
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
    );
  }

  return (
    <>
      {/* Product Overview */}
      <section id="overview" className="py-16 md:py-20 border-t border-gray-100">
        <FadeIn className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                Overview
              </span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                About This Product
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-4">
              {linerDesc.overview
                .filter((para) => !para.startsWith('Standard Configuration:') && !para.startsWith('XL Size:'))
                .map((para, i) => (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
                ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Key Features & Benefits */}
      <section id="features" className="py-16 md:py-20 bg-brand-offwhite">
        <FadeIn className="max-w-6xl mx-auto px-6 md:px-12">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 block">
            Key Features & Benefits
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {linerDesc.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg">
                <Check className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">{feat}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Technology - ALPS GP only */}
      {(linerDesc.gelTechnology || linerDesc.fabricTechnology) && (
        <section className="py-16 md:py-20 border-t border-gray-100">
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

      {/* Suspension Options - ALPS GP only */}
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

      {/* Care & Maintenance */}
      <section id="care-maintenance" className="py-16 md:py-20 border-t border-gray-100">
        <FadeIn className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Care & Maintenance
            </span>
            {showPdfDownload && (
              <a
                href="/Important-Instructions-for-Amputees.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black text-white px-4 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Download Instructions (PDF)
              </a>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Application Instructions */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Application</h4>
              <ol className="space-y-3">
                {linerDesc.applicationInstructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Care Instructions */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Care</h4>
              <ol className="space-y-3">
                {linerDesc.careInstructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Precautions */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Precautions</h4>
              <ul className="space-y-3">
                {linerDesc.precautions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-amber-50 rounded-lg p-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
