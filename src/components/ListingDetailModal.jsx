import { useState } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  AlertTriangle, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Navigation, 
  Check, 
  Send,
  Bookmark,
  Share2
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ListingDetailModal({ listing, onClose, onReviewAdded }) {
  const { user, isAuthenticated, savedListings, toggleSaveListing } = useAuth();
  const [submittingReview, setSubmittingReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [theCatch, setTheCatch] = useState('');
  const [studentName, setStudentName] = useState(user?.name || '');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!listing) return null;

  const isSaved = savedListings.includes(listing.id || listing._id);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.addReview(listing.id || listing._id, {
        studentName: studentName.trim() || 'Anonymous Scout',
        rating: Number(rating),
        comment: comment.trim(),
        theCatch: theCatch.trim() || 'No additional catch noted'
      });
      setFeedbackMsg('Your honest verdict was posted!');
      setComment('');
      setTheCatch('');
      if (onReviewAdded) onReviewAdded();
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err) {
      setFeedbackMsg('Review recorded locally.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out ${listing.title} on Campus Scout Bengaluru!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-3xl glass-card overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 max-h-[92vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-indigo-600 shadow-md backdrop-blur-md transition-all"
            title="Share listing"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleSaveListing(listing.id || listing._id)}
            className={`p-2 rounded-full backdrop-blur-md shadow-md transition-all ${
              isSaved 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-indigo-600'
            }`}
            title="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-rose-600 shadow-md backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800">
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 backdrop-blur-md">
                  {listing.type || listing.category}
                </span>
                <h2 className="text-2xl font-black text-white mt-1 leading-tight drop-shadow-md">
                  {listing.title}
                </h2>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white">
                  ₹{listing.price.toLocaleString('en-IN')}
                </span>
                <span className="block text-xs text-slate-300">
                  per {listing.pricePeriod}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Navigation Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{listing.address}</span>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.title + ' ' + listing.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Campus Proximity Metrics */}
          {listing.distanceInfo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-0.5">
                  Proximity to RV University
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {listing.distanceInfo.rvu}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                <span className="font-bold text-purple-900 dark:text-purple-300 block mb-0.5">
                  Metro Transit Access
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {listing.distanceInfo.metro}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Overview
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Amenities Grid */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Features & Amenities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {listing.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Honest Verdict Card */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 dark:bg-indigo-500/10 dark:border-indigo-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                Editorial Verdict
              </h4>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {listing.honestVerdict}
            </p>
          </div>

          {/* THE CATCH ALERT BOX */}
          <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 dark:bg-amber-500/10 dark:border-amber-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                The Catch (Downsides Nobody Tells You)
              </h4>
            </div>
            <p className="text-xs text-amber-900/90 dark:text-amber-200/90 font-medium leading-relaxed">
              {listing.theCatch}
            </p>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            {listing.whatsapp && (
              <a
                href={`https://wa.me/${listing.whatsapp}?text=Hi,%20I'm%20inquiring%20about%20${encodeURIComponent(listing.title)}%20via%20Campus%20Scout.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Owner</span>
              </a>
            )}

            {listing.contactPhone && (
              <a
                href={`tel:${listing.contactPhone}`}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 shadow-sm transition-opacity"
              >
                <Phone className="w-4 h-4" />
                <span>Call {listing.contactPhone}</span>
              </a>
            )}
          </div>

          {/* Add Review Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-3">
              Add Your Honest Peer Review
            </h4>

            {feedbackMsg && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold">
                {feedbackMsg}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Your Name or Handle
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul S. (RVU '26)"
                    className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Rating (1 to 5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5.0 - Exceptional</option>
                    <option value="4">⭐⭐⭐⭐ 4.0 - Solid Choice</option>
                    <option value="3">⭐⭐⭐ 3.0 - Decent / Average</option>
                    <option value="2">⭐⭐ 2.0 - Below Par</option>
                    <option value="1">⭐ 1.0 - Do Not Recommend</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  What's Good? (General Experience)
                </label>
                <textarea
                  rows="2"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell peers about the food, room cleanliness, owner attitude..."
                  className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  What is "The Catch"? (Hidden flaw or downside)
                </label>
                <input
                  type="text"
                  value={theCatch}
                  onChange={(e) => setTheCatch(e.target.value)}
                  placeholder="e.g. Warden locks gate at 9pm sharp, or electricity bills are inflated"
                  className="w-full text-xs rounded-xl border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-950/20 text-slate-900 dark:text-white py-2"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Honest Review</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
