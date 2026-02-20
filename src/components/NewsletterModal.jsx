import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSubscribe } from '../hooks/useSubscribe';

const NewsletterModal = ({ isOpen, onClose }) => {
  const { subscribe, loading, success, error, reset } = useSubscribe();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await subscribe(formData);
  };

  const handleClose = () => {
    reset();
    setFormData({ firstName: '', lastName: '', email: '' });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 md:p-12 max-w-lg w-full relative shadow-2xl"
        >
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          {success ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-medium mb-4">You're subscribed!</h3>
              <p className="text-gray-500 mb-8">We'll keep you in the loop with updates, new products, and resources.</p>
              <button
                onClick={handleClose}
                className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-medium mb-2">Stay in the Loop</h3>
              <p className="text-gray-500 mb-8 font-light">
                Get updates on new products, resources, and platform features.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest">First Name</label>
                    <input
                      id="firstName"
                      required
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest">Last Name</label>
                    <input
                      id="lastName"
                      required
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest">Email Address</label>
                  <input
                    id="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors mt-4 disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewsletterModal;
