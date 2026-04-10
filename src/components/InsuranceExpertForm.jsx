import { useState } from 'react';
import { Send, Check } from 'lucide-react';

export default function InsuranceExpertForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    insuranceProvider: '',
    question: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insurance-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit. Please try again.');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', insuranceProvider: '', question: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-brand-offwhite rounded-lg p-8 md:p-12 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-medium mb-2">Inquiry Submitted</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          We've received your insurance question. Our team will review your information and get back to you within 2-3 business days.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm font-medium underline hover:text-gray-600 transition-colors"
        >
          Submit another question
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-offwhite rounded-lg p-8 md:p-12">
      <h3 className="text-xl font-medium mb-2">Start Your Coverage Review</h3>
      <p className="text-sm text-gray-500 mb-8 max-w-lg">
        Share a few details about your insurance and what you're looking for. Our team will review your benefits and follow up with clear next steps.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="Full name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Insurance Provider
          </label>
          <input
            type="text"
            name="insuranceProvider"
            value={formData.insuranceProvider}
            onChange={handleChange}
            required
            className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="e.g. Blue Cross, Medicare, Aetna"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Your Question
          </label>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
            placeholder="What would you like to know about your coverage?"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : (
            <>
              <Send className="w-4 h-4" />
              Check My Coverage
            </>
          )}
        </button>
      </form>
    </div>
  );
}
