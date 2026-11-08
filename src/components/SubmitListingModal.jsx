import { useState } from 'react';
import { PlusCircle, X, AlertTriangle, ShieldCheck, Upload, Send } from 'lucide-react';
import { api } from '../services/api.js';

export default function SubmitListingModal({ isOpen, onClose, onListingCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'pg',
    type: 'Boys PG',
    area: 'Pattanagere',
    address: '',
    price: '',
    pricePeriod: 'month',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    description: '',
    honestVerdict: '',
    theCatch: '',
    amenities: 'Wi-Fi, 3 Meals, Power Backup',
    contactPhone: '',
    whatsapp: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.honestVerdict || !formData.theCatch || !formData.price) {
      setFeedback('Please fill out all required fields including The Catch.');
      return;
    }

    setSubmitting(true);
    try {
      await api.createListing({
        ...formData,
        price: Number(formData.price),
        amenities: formData.amenities.split(',').map(s => s.trim())
      });
      setFeedback('Listing published successfully!');
      if (onListingCreated) onListingCreated();
      setTimeout(() => {
        onClose();
        setFeedback('');
      }, 1000);
    } catch (err) {
      setFeedback('Failed to create listing: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-3xl glass-card overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 max-h-[92vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 space-y-5">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Peer Directory
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Submit a Campus Place
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Help your college mates find verified PGs, budget messes, and laptop fix spots.
            </p>
          </div>

          {feedback && (
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-bold">
              {feedback}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Place / PG Name *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Royal Comforts PG for Boys"
                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                >
                  <option value="pg">🏠 PG / Hostel / Stay</option>
                  <option value="food">🍲 Student Food / Mess</option>
                  <option value="fix">🔧 Tech / Laptop Fix</option>
                  <option value="study">📚 Library / Study Space</option>
                  <option value="essentials">🖨️ Print & Essentials</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Area / Campus Pocket *
                </label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                >
                  <option value="Pattanagere">Pattanagere (RVU)</option>
                  <option value="Kengeri">Kengeri</option>
                  <option value="RR Nagar">RR Nagar</option>
                  <option value="Banashankari">Banashankari</option>
                  <option value="Mysore Road">Mysore Road</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 8000"
                  className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Price Period
                </label>
                <select
                  name="pricePeriod"
                  value={formData.pricePeriod}
                  onChange={handleChange}
                  className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                >
                  <option value="month">per month</option>
                  <option value="meal">per meal</option>
                  <option value="service">per service / repair</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Full Address & Landmark
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 5th Cross, Near RVU Gate 2, Pattanagere"
                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Amenities (comma separated)
              </label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="Wi-Fi, 3 Meals, Attached Washroom, Power Backup"
                className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                The Honest Verdict (What is great about this place?) *
              </label>
              <textarea
                rows="2"
                name="honestVerdict"
                value={formData.honestVerdict}
                onChange={handleChange}
                placeholder="Clean rooms, hot water, tasty food, friendly owner..."
                className="w-full text-xs rounded-xl border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20 text-slate-900 dark:text-white p-2.5"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                THE CATCH (What are the hidden downsides?) *
              </label>
              <textarea
                rows="2"
                name="theCatch"
                value={formData.theCatch}
                onChange={handleChange}
                placeholder="Strict 9 PM curfew, high deposit deduction, slow Wi-Fi on weekends..."
                className="w-full text-xs rounded-xl border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/20 text-slate-900 dark:text-white p-2.5"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Owner WhatsApp Number
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="919845012345"
                  className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 98450 12345"
                  className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Campus Directory</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
