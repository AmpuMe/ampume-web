import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Ruler, Info } from 'lucide-react';
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

function MeasurementSteps({ chartData }) {
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
      title: 'Find Your Size',
      desc: 'Use the chart below to match your measurements. When possible, confirm sizing with your prosthetist.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {steps.map((step) => (
        <div key={step.number} className="bg-brand-offwhite rounded-lg p-5">
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold mb-4">
            {step.number}
          </div>
          <h4 className="text-sm font-bold mb-2">{step.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}

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

function SizingChartTable({ chartData }) {
  const isDual = chartData.measurementMethod === 'dual-circumference';
  const { globalMin, globalMax } = chartData;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        {/* Header */}
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

        {/* Rows */}
        {chartData.sizes.map((size, i) => (
          <div
            key={size.label}
            className={`grid ${isDual ? 'grid-cols-3' : 'grid-cols-2'} border-b border-gray-100 ${
              i % 2 === 0 ? 'bg-white' : 'bg-brand-offwhite'
            }`}
          >
            <div className="py-4 px-4 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black text-white text-sm font-bold flex-shrink-0">
                {size.label}
              </span>
              {size.name && <span className="text-sm text-gray-500">{size.name}</span>}
            </div>

            {isDual ? (
              <>
                <div className="py-4 px-4">
                  <span className="text-sm font-medium">{size.distal[0]} \u2013 {size.distal[1]} cm</span>
                  <span className="text-xs text-gray-400 ml-2">({size.distalIn[0]} \u2013 {size.distalIn[1]} in)</span>
                  <RangeBar min={size.distal[0]} max={size.distal[1]} globalMin={globalMin} globalMax={globalMax} />
                </div>
                <div className="py-4 px-4">
                  <span className="text-sm font-medium">{size.proximal[0]} \u2013 {size.proximal[1]} cm</span>
                  <span className="text-xs text-gray-400 ml-2">({size.proximalIn[0]} \u2013 {size.proximalIn[1]} in)</span>
                  <RangeBar min={size.proximal[0]} max={size.proximal[1]} globalMin={globalMin} globalMax={globalMax} />
                </div>
              </>
            ) : (
              <div className="py-4 px-4">
                <span className="text-sm font-medium">{size.circumference[0]} \u2013 {size.circumference[1]} cm</span>
                <RangeBar min={size.circumference[0]} max={size.circumference[1]} globalMin={globalMin} globalMax={globalMax} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {chartData.sizes.map((size) => (
          <div key={size.label} className="bg-brand-offwhite rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black text-white text-sm font-bold flex-shrink-0">
                {size.label}
              </span>
              {size.name && <span className="text-sm font-medium">{size.name}</span>}
            </div>

            {isDual ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Distal</span>
                  <p className="text-sm font-medium">{size.distal[0]} \u2013 {size.distal[1]} cm</p>
                  <p className="text-xs text-gray-400">{size.distalIn[0]} \u2013 {size.distalIn[1]} in</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Proximal</span>
                  <p className="text-sm font-medium">{size.proximal[0]} \u2013 {size.proximal[1]} cm</p>
                  <p className="text-xs text-gray-400">{size.proximalIn[0]} \u2013 {size.proximalIn[1]} in</p>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Circumference</span>
                <p className="text-sm font-medium">{size.circumference[0]} \u2013 {size.circumference[1]} cm</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Note */}
      {chartData.note && (
        <p className="text-xs text-gray-500 mt-4 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          {chartData.note}
        </p>
      )}
    </>
  );
}

export default function SizingGuide({ sizingType, measuringGuide }) {
  const chartData = getSizingChart(sizingType);
  if (!chartData || chartData.sizes.length === 0) return null;

  return (
    <section id="sizing-guide" className="py-16 md:py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
                Sizing Guide
              </span>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                Find Your Perfect Fit
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-md md:text-right">
              Getting the right size is essential for comfort and performance. Follow these steps to measure your residual limb.
            </p>
          </div>
        </FadeIn>

        {/* Reassurance Banner */}
        <FadeIn>
          <div className="bg-brand-offwhite rounded-lg p-6 md:p-8 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
              <Ruler className="w-6 h-6 text-brand-gold" />
            </div>
            <div>
              <p className="text-sm font-bold mb-1">Not sure about your size? We&rsquo;ve got you.</p>
              <p className="text-sm text-gray-600">
                Our sizing guides are designed to help you measure confidently at home. If you have any questions,{' '}
                <Link to="/contact" className="text-black underline underline-offset-2 hover:opacity-70 transition-opacity">
                  reach out to our team
                </Link>{' '}
                or consult your prosthetist.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* How to Measure */}
        <FadeIn>
          <div className="mb-12">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">How to Measure</h3>
            <MeasurementSteps chartData={chartData} />
          </div>
        </FadeIn>

        {/* Size Chart */}
        <FadeIn>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Size Chart</h3>
            <SizingChartTable chartData={chartData} />
          </div>
        </FadeIn>

        {/* Bottom Tip */}
        <FadeIn>
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Between sizes? We recommend sizing up for a more comfortable fit.
            </p>
            <Link
              to="/contact"
              className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              Get Sizing Help
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
