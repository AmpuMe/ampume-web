import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Stethoscope, User, Calendar, ExternalLink, X, Lock, Mail, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import Select from '../components/Select';

const FadeIn = ({ children, delay = 0, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

const APPOINTMENT_TYPES = [
  'Functional Assessment',
  'Liner Replacement Visit',
  'Osseointegration Consultation',
  'Mental Health Counseling',
  'Other Specialized Care',
];

// Demo clinician data for the password-protected preview
const DEMO_CLINICIANS = [
  { name: 'Dr. Sarah Mitchell', specialty: 'Prosthetic Rehabilitation', state: 'New York', types: ['Functional Assessment', 'Liner Replacement Visit'], image: null },
  { name: 'Dr. James Chen', specialty: 'Osseointegration', state: 'California', types: ['Osseointegration Consultation', 'Functional Assessment'], image: null },
  { name: 'Dr. Amanda Torres', specialty: 'Limb Loss Counseling', state: 'Texas', types: ['Mental Health Counseling'], image: null },
  { name: 'Dr. Robert Kim', specialty: 'Physical Medicine & Rehab', state: 'Florida', types: ['Functional Assessment', 'Liner Replacement Visit', 'Other Specialized Care'], image: null },
  { name: 'Dr. Emily Watson', specialty: 'Prosthetics & Orthotics', state: 'Pennsylvania', types: ['Functional Assessment', 'Liner Replacement Visit', 'Osseointegration Consultation'], image: null },
  { name: 'Dr. Michael Davis', specialty: 'Psychology — Limb Loss', state: 'New York', types: ['Mental Health Counseling'], image: null },
];

function ClinicianCard({ clinician }) {
  return (
    <div className="border border-gray-100 rounded-lg p-6 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium mb-1">{clinician.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{clinician.specialty}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <MapPin className="w-3 h-3" />
            {clinician.state}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {clinician.types.map((type) => (
              <span key={type} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-full">{type}</span>
            ))}
          </div>
        </div>
      </div>
      <button className="mt-4 w-full text-center text-xs font-bold uppercase tracking-widest bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors">
        Schedule Appointment
      </button>
    </div>
  );
}

function PreLaunchGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePassword = (e) => {
    e.preventDefault();
    if (password === 'ampume2026') {
      onUnlock();
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const handleEmail = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setEmailSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md w-full p-8 md:p-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mx-auto mb-5">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-medium mb-2">Telemedicine is launching soon</h2>
          <p className="text-sm text-gray-500">Be the first to know when you can connect with limb loss specialists through AmpuMe.</p>
        </div>

        {/* Email waitlist — primary action */}
        {emailSubmitted ? (
          <div className="text-center py-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium">You're on the list!</p>
            <p className="text-xs text-gray-500 mt-1">We'll notify you when telemedicine launches.</p>
          </div>
        ) : (
          <form onSubmit={handleEmail}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <button type="submit" className="px-5 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                Notify Me
              </button>
            </div>
          </form>
        )}

        {/* Password toggle — secondary, tucked away for partners */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          {!showPassword ? (
            <button
              onClick={() => setShowPassword(true)}
              className="w-full text-center text-xs text-gray-400 hover:text-black transition-colors"
            >
              Have an access code?
            </button>
          ) : (
            <form onSubmit={handlePassword}>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Access code"
                    autoFocus
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none transition-colors ${
                      passwordError ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-black'
                    }`}
                  />
                </div>
                <button type="submit" className="px-5 py-3 bg-gray-100 text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Enter
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-500 mt-2">Incorrect code.</p>}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function TelemedicinePage() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filteredClinicians = DEMO_CLINICIANS.filter((c) => {
    if (selectedState && c.state !== selectedState) return false;
    if (selectedType && !c.types.includes(selectedType)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <SEO
        title="Telemedicine | AmpuMe"
        description="Schedule an appointment with a limb loss specialist. AmpuMe clinical partners provide functional assessments, liner replacement visits, and specialized care."
        url="https://ampume.com/telemedicine"
      />

      <SimpleNavbar />

      {/* Pre-launch gate */}
      <AnimatePresence>
        {!unlocked && <PreLaunchGate onUnlock={() => setUnlocked(true)} />}
      </AnimatePresence>

      <main className={`pt-32 pb-20 ${!unlocked ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* Back link + Hero */}
        <section className="px-6 md:px-12 mb-8 md:mb-12">
          <FadeIn>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-8 block"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </FadeIn>

          <FadeIn className="max-w-3xl" delay={0.05}>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">
              Telemedicine
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
              Schedule an appointment with a limb loss specialist today
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              AmpuMe clinical partners provide functional assessments, liner replacement visits, osseointegration consultations, mental health counseling, and other specialized care.
            </p>
          </FadeIn>
        </section>

        {/* Filters */}
        <section className="px-6 md:px-12 mb-8">
          <FadeIn delay={0.1} className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <Select
              options={STATES.map(s => ({ value: s, label: s }))}
              value={selectedState}
              onChange={setSelectedState}
              placeholder="Choose your state"
              className="flex-1"
            />
            <Select
              options={APPOINTMENT_TYPES.map(t => ({ value: t, label: t }))}
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Appointment type"
              className="flex-1"
            />
            {(selectedState || selectedType) && (
              <button
                onClick={() => { setSelectedState(''); setSelectedType(''); }}
                className="text-xs font-medium text-gray-400 hover:text-black transition-colors self-center"
              >
                Clear filters
              </button>
            )}
          </FadeIn>
        </section>

        {/* Count */}
        <section className="px-6 md:px-12 mb-6">
          <p className="text-sm text-gray-400">
            {filteredClinicians.length} {filteredClinicians.length === 1 ? 'clinician' : 'clinicians'} available
          </p>
        </section>

        {/* Results grid */}
        <section className="px-6 md:px-12">
          {filteredClinicians.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClinicians.map((clinician, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <ClinicianCard clinician={clinician} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn>
              <div className="text-center py-16 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-5">
                  <MapPin className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium mb-2">No clinicians found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  We don't have a partner in that area yet. Try adjusting your filters, or contact us and we'll help connect you with a specialist.
                </p>
                <Link to="/contact" className="text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
                  Contact Us
                </Link>
              </div>
            </FadeIn>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
