import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Ruler, Info, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { getSizingChart } from '../data/linerSizingData';

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

/* ── Measurement Input ─────────────────────────────────────────── */

function MeasurementInput({ label, value, onChange, placeholder }) {
  const inches = value ? (parseFloat(value) / 2.54).toFixed(1) : null;

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border-b-2 border-gray-300 bg-transparent py-3 pr-20 text-lg font-medium focus:outline-none focus:border-black transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          cm{inches ? <span className="text-xs ml-1">({inches} in)</span> : null}
        </span>
      </div>
    </div>
  );
}

/* ── Recommendation Result ─────────────────────────────────────── */

function RecommendationResult({ recommendation }) {
  if (recommendation.size && !recommendation.between) {
    return (
      <div className="flex items-start gap-4 bg-white rounded-lg p-5 border-l-4 border-brand-gold">
        <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 text-brand-gold" />
        </div>
        <div>
          <p className="text-sm font-bold mb-1">
            Your recommended size is{' '}
            <span className="text-brand-gold">{recommendation.size.label}</span>
            {recommendation.size.name && ` (${recommendation.size.name})`}
          </p>
          <p className="text-sm text-gray-500">
            Based on your measurements, this size should provide the best fit.
            See the chart below for full range details.
          </p>
        </div>
      </div>
    );
  }

  if (recommendation.between) {
    const [lower, upper] = recommendation.between;
    return (
      <div className="flex items-start gap-4 bg-white rounded-lg p-5 border-l-4 border-brand-gold">
        <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
          <ArrowRight className="w-5 h-5 text-brand-gold" />
        </div>
        <div>
          <p className="text-sm font-bold mb-1">
            Your measurements fall between{' '}
            <span>{lower.label}</span>
            {lower.name && ` (${lower.name})`} and{' '}
            <span className="text-brand-gold">{upper.label}</span>
            {upper.name && ` (${upper.name})`}
          </p>
          <p className="text-sm text-gray-500">
            We recommend <strong>{upper.label}</strong> for a more comfortable fit.
            When between sizes, sizing up helps ensure your liner isn&rsquo;t too tight.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 bg-white rounded-lg p-5 border-l-4 border-gray-300">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <AlertCircle className="w-5 h-5 text-gray-400" />
      </div>
      <div>
        <p className="text-sm font-bold mb-1">
          We couldn&rsquo;t find an exact match
        </p>
        <p className="text-sm text-gray-500">
          Your measurements fall outside our standard size range.{' '}
          <Link to="/contact" className="text-black underline underline-offset-2 hover:opacity-70 transition-opacity">
            Contact our team
          </Link>{' '}
          for personalized sizing help.
        </p>
      </div>
    </div>
  );
}

/* ── Measurement Hero (Integrated Diagram) ────────────────────── */

function MeasurementHero({ chartData }) {
  const isDual = chartData.measurementMethod === 'dual-circumference';

  const steps = [
    {
      number: 1,
      title: 'Gather Your Tools',
      desc: 'You\u2019ll need a flexible measuring tape (cloth or plastic). A helper can make measuring easier.',
    },
    ...chartData.measurementPoints.map((point, i) => ({
      number: i + 2,
      title: `Measure at ${point.distance}`,
      desc: point.description,
    })),
    {
      number: chartData.measurementPoints.length + 2,
      title: 'Enter Below',
      desc: 'Use the size finder to get your recommended size instantly.',
    },
  ];

  // Callout label positions (% from top of image) — tuned per image
  const isAK = chartData.measurementImage?.includes('ak-');
  const callouts = isDual
    ? isAK
      ? [
          { label: 'PROXIMAL', sublabel: '30 cm from end', top: 34 },
          { label: 'DISTAL', sublabel: '4 cm from end', top: 74 },
        ]
      : [
          { label: 'PROXIMAL', sublabel: '30 cm from end', top: 23 },
          { label: 'DISTAL', sublabel: '4 cm from end', top: 55 },
        ]
    : [
        { label: 'MEASURE HERE', sublabel: '6 cm from end', top: 48 },
      ];

  return (
    <FadeIn className="mb-8 md:mb-10">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-8 text-center">
        How to Measure
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Annotated diagram — shows first on mobile */}
        <div className="order-1 lg:order-2 flex justify-center">
          <div className="relative w-full max-w-sm">
            {chartData.measurementImage && (
              <div className="relative">
                <img
                  src={chartData.measurementImage}
                  alt={`${chartData.title} \u2014 where to measure`}
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                />

                {/* Callout labels pointing to the measuring tapes in the photo */}
                {callouts.map((callout, i) => (
                  <div key={i} className="absolute right-2 md:right-4 flex items-center gap-1.5" style={{ top: `${callout.top}%`, transform: 'translateY(-50%)' }}>
                    <div className="w-4 md:w-8 h-[2px] bg-brand-gold" />
                    <div className="bg-white/95 backdrop-blur-sm rounded-md px-2.5 py-1.5 shadow-sm border border-brand-gold/20">
                      <p className="text-[11px] md:text-xs font-bold text-brand-gold leading-none whitespace-nowrap">{callout.label}</p>
                      <p className="text-[10px] md:text-[11px] text-gray-500 leading-tight whitespace-nowrap mt-0.5">{callout.sublabel}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Steps — shows second on mobile, left column on desktop */}
        <div className="order-2 lg:order-1 space-y-5 lg:pt-4">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-start gap-4 relative">
              {/* Vertical connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[15px] top-10 bottom-0 w-px bg-gray-200 -mb-5" style={{ height: 'calc(100% - 8px)' }} />
              )}
              <span className="relative z-10 w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.number}
              </span>
              <div className="pb-1">
                <h4 className="text-sm font-bold mb-1">{step.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

/* ── Size Finder (Interactive) ─────────────────────────────────── */

function SizeFinder({
  chartData,
  recommendation,
  onFindSize,
  distalCm,
  proximalCm,
  circumferenceCm,
  onDistalChange,
  onProximalChange,
  onCircumferenceChange,
}) {
  const isDual = chartData.measurementMethod === 'dual-circumference';
  const hasInput = isDual ? (distalCm && proximalCm) : circumferenceCm;

  return (
    <FadeIn className="mb-12 md:mb-16">
      <div className="bg-brand-offwhite rounded-lg p-6 md:p-8">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-1">
          Size Finder
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Enter your measurements to get a personalized size recommendation.
        </p>

        <div className={`grid ${isDual ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-xs'} gap-4 mb-6`}>
          {isDual ? (
            <>
              <MeasurementInput
                label="Distal (4 cm from end)"
                value={distalCm}
                onChange={onDistalChange}
                placeholder="e.g. 26"
              />
              <MeasurementInput
                label="Proximal (30 cm from end)"
                value={proximalCm}
                onChange={onProximalChange}
                placeholder="e.g. 42"
              />
            </>
          ) : (
            <MeasurementInput
              label={`Circumference (${chartData.measurementPoints[0]?.distance} from end)`}
              value={circumferenceCm}
              onChange={onCircumferenceChange}
              placeholder="e.g. 28"
            />
          )}
        </div>

        <button
          onClick={onFindSize}
          disabled={!hasInput}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Ruler className="w-4 h-4" />
          Find My Size
        </button>

        <AnimatePresence mode="wait">
          {recommendation && (
            <motion.div
              key={recommendation.size?.label || 'no-match'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-6"
            >
              <RecommendationResult recommendation={recommendation} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}

/* ── Range Bar ─────────────────────────────────────────────────── */

function RangeBar({ min, max, globalMin, globalMax }) {
  const range = globalMax - globalMin;
  const left = ((min - globalMin) / range) * 100;
  const width = ((max - min) / range) * 100;

  return (
    <div className="h-1.5 rounded-full bg-gray-100 w-full relative mt-1.5">
      <div
        className="h-full rounded-full bg-brand-gold"
        style={{ width: `${width}%`, marginLeft: `${left}%` }}
      />
    </div>
  );
}

/* ── Size Chart Table ──────────────────────────────────────────── */

function SizingChartTable({ chartData, highlightedLabel }) {
  const isDual = chartData.measurementMethod === 'dual-circumference';
  const { globalMin, globalMax } = chartData;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <div className={`grid ${isDual ? 'grid-cols-3' : 'grid-cols-2'} border-b-2 border-black`}>
          <div className="py-3 px-4 text-xs font-bold uppercase tracking-widest">Size</div>
          {isDual ? (
            <>
              <div className="py-3 px-4 text-xs font-bold uppercase tracking-widest">Distal (4 cm)</div>
              <div className="py-3 px-4 text-xs font-bold uppercase tracking-widest">Proximal (30 cm)</div>
            </>
          ) : (
            <div className="py-3 px-4 text-xs font-bold uppercase tracking-widest">
              Circumference ({chartData.measurementPoints[0]?.distance})
            </div>
          )}
        </div>

        {chartData.sizes.map((size, i) => {
          const isHighlighted = highlightedLabel === size.label;
          return (
            <div
              key={size.label}
              className={`grid ${isDual ? 'grid-cols-3' : 'grid-cols-2'} border-b border-gray-100 transition-colors duration-300 border-l-4 ${
                isHighlighted
                  ? 'border-l-brand-gold bg-brand-gold/5'
                  : `border-l-transparent ${i % 2 === 0 ? 'bg-white' : 'bg-brand-offwhite'}`
              }`}
            >
              <div className="py-4 px-4 flex items-center gap-3">
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold flex-shrink-0 ${
                  isHighlighted ? 'bg-brand-gold text-white' : 'bg-black text-white'
                }`}>
                  {size.label}
                </span>
                {size.name && <span className="text-sm text-gray-500">{size.name}</span>}
              </div>

              {isDual ? (
                <>
                  <div className="py-4 px-4">
                    <span className="text-sm font-medium">{size.distal[0]} &ndash; {size.distal[1]} cm</span>
                    <span className="text-xs text-gray-400 ml-2">({size.distalIn[0]} &ndash; {size.distalIn[1]} in)</span>
                    <RangeBar min={size.distal[0]} max={size.distal[1]} globalMin={globalMin} globalMax={globalMax} />
                  </div>
                  <div className="py-4 px-4">
                    <span className="text-sm font-medium">{size.proximal[0]} &ndash; {size.proximal[1]} cm</span>
                    <span className="text-xs text-gray-400 ml-2">({size.proximalIn[0]} &ndash; {size.proximalIn[1]} in)</span>
                    <RangeBar min={size.proximal[0]} max={size.proximal[1]} globalMin={globalMin} globalMax={globalMax} />
                  </div>
                </>
              ) : (
                <div className="py-4 px-4">
                  <span className="text-sm font-medium">{size.circumference[0]} &ndash; {size.circumference[1]} cm</span>
                  <RangeBar min={size.circumference[0]} max={size.circumference[1]} globalMin={globalMin} globalMax={globalMax} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {chartData.sizes.map((size) => {
          const isHighlighted = highlightedLabel === size.label;
          return (
            <div
              key={size.label}
              className={`rounded-lg p-4 transition-colors duration-300 ${
                isHighlighted
                  ? 'bg-brand-gold/5 ring-2 ring-brand-gold'
                  : 'bg-brand-offwhite'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold flex-shrink-0 ${
                  isHighlighted ? 'bg-brand-gold text-white' : 'bg-black text-white'
                }`}>
                  {size.label}
                </span>
                {size.name && <span className="text-sm font-medium">{size.name}</span>}
              </div>

              {isDual ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Distal</span>
                    <p className="text-sm font-medium">{size.distal[0]} &ndash; {size.distal[1]} cm</p>
                    <p className="text-xs text-gray-400">{size.distalIn[0]} &ndash; {size.distalIn[1]} in</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Proximal</span>
                    <p className="text-sm font-medium">{size.proximal[0]} &ndash; {size.proximal[1]} cm</p>
                    <p className="text-xs text-gray-400">{size.proximalIn[0]} &ndash; {size.proximalIn[1]} in</p>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Circumference</span>
                  <p className="text-sm font-medium">{size.circumference[0]} &ndash; {size.circumference[1]} cm</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {chartData.note && (
        <p className="text-xs text-gray-500 mt-4 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          {chartData.note}
        </p>
      )}
    </>
  );
}

/* ── Main Component ────────────────────────────────────────────── */

export default function SizingGuide({ sizingType }) {
  const chartData = getSizingChart(sizingType);
  if (!chartData || chartData.sizes.length === 0) return null;

  const isDual = chartData.measurementMethod === 'dual-circumference';

  const [distalCm, setDistalCm] = useState('');
  const [proximalCm, setProximalCm] = useState('');
  const [circumferenceCm, setCircumferenceCm] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  const findRecommendedSize = () => {
    const sizes = chartData.sizes;

    if (isDual) {
      const distal = parseFloat(distalCm);
      const proximal = parseFloat(proximalCm);
      if (isNaN(distal) || isNaN(proximal)) return;

      // Exact match: both measurements within a single size's ranges
      const exactMatch = sizes.find(
        (s) =>
          distal >= s.distal[0] && distal <= s.distal[1] &&
          proximal >= s.proximal[0] && proximal <= s.proximal[1]
      );

      if (exactMatch) {
        setRecommendation({ size: exactMatch, between: null, noMatch: false });
        return;
      }

      // Find the smallest size that can accommodate both measurements
      let bestIdx = -1;
      for (let i = 0; i < sizes.length; i++) {
        if (distal <= sizes[i].distal[1] && proximal <= sizes[i].proximal[1]) {
          bestIdx = i;
          break;
        }
      }

      if (bestIdx >= 0) {
        const current = sizes[bestIdx];
        const belowMin = distal < current.distal[0] || proximal < current.proximal[0];
        if (belowMin && bestIdx > 0) {
          setRecommendation({ size: current, between: [sizes[bestIdx - 1], current], noMatch: false });
        } else {
          setRecommendation({ size: current, between: null, noMatch: false });
        }
        return;
      }

      // No match
      setRecommendation({ size: null, between: null, noMatch: true });
    } else {
      const circ = parseFloat(circumferenceCm);
      if (isNaN(circ)) return;

      // Exact match
      const exactMatch = sizes.find(
        (s) => circ >= s.circumference[0] && circ <= s.circumference[1]
      );

      if (exactMatch) {
        setRecommendation({ size: exactMatch, between: null, noMatch: false });
        return;
      }

      // Between sizes — find the gap
      for (let i = 0; i < sizes.length - 1; i++) {
        if (circ > sizes[i].circumference[1] && circ < sizes[i + 1].circumference[0]) {
          setRecommendation({ size: sizes[i + 1], between: [sizes[i], sizes[i + 1]], noMatch: false });
          return;
        }
      }

      // Outside range
      setRecommendation({ size: null, between: null, noMatch: true });
    }
  };

  const highlightedLabel = recommendation?.size?.label || null;

  return (
    <section id="sizing-guide" className="py-16 md:py-20 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
              Sizing Guide
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
              Find Your Perfect Fit
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Follow these steps to measure your residual limb and find the right size.
              When in doubt, your prosthetist can help confirm.
            </p>
          </div>
        </FadeIn>

        {/* How to Measure */}
        <MeasurementHero chartData={chartData} />

        {/* Interactive Size Finder */}
        <SizeFinder
          chartData={chartData}
          recommendation={recommendation}
          onFindSize={findRecommendedSize}
          distalCm={distalCm}
          proximalCm={proximalCm}
          circumferenceCm={circumferenceCm}
          onDistalChange={(v) => { setDistalCm(v); setRecommendation(null); }}
          onProximalChange={(v) => { setProximalCm(v); setRecommendation(null); }}
          onCircumferenceChange={(v) => { setCircumferenceCm(v); setRecommendation(null); }}
        />

        {/* Size Chart */}
        <FadeIn>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-center">
            Size Chart
          </h3>
          <SizingChartTable chartData={chartData} highlightedLabel={highlightedLabel} />
        </FadeIn>

        {/* Reassurance Footer */}
        <FadeIn>
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
              <Ruler className="w-5 h-5 text-brand-gold" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <strong>Between sizes?</strong> We recommend sizing up for a more comfortable fit.
                Need help?{' '}
                <Link to="/contact" className="text-black underline underline-offset-2 hover:opacity-70 transition-opacity">
                  Our team is here for you
                </Link>.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
