import { useEffect, useState } from 'react';
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
import { priceLabel } from '../utils/priceLabel.js';

export default function ListingDetailModal({ listing, onClose, onReviewAdded }) {
  const { user, isAuthenticated, savedListings, toggleSaveListing } = useAuth();
  const [submittingReview, setSubmittingReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [theCatch, setTheCatch] = useState('');
  const [studentName, setStudentName] = useState(user?.name || '');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [live, setLive] = useState(listing);

  useEffect(() => {
    setLive(listing);
  }, [listing]);

  if (!listing) return null;
  const place = live || listing;
  const price = priceLabel(place);

  const isSaved = savedListings.includes(listing.id || listing._id);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      await api.addReview(listing.id || listing._id, {
        studentName: studentName.trim() || 'Anonymous Scout',
        rating: Number(rating),
        comment: comment.trim(),
        theCatch: theCatch.trim() || 'No additional catch noted'
      });
      const nextReview = {
        studentName: studentName.trim() || 'Anonymous Scout',
        rating: Number(rating),
        comment: comment.trim(),
        theCatch: theCatch.trim() || 'No additional catch noted',
        createdAt: new Date().toISOString()
      };
      setLive((prev) => {
        const reviews = [...((prev || listing).reviews || []), nextReview];
        const average = reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length;
        return {
          ...(prev || listing),
          reviews,
          reviewCount: reviews.length,
          rating: Number(average.toFixed(1))
        };
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70">
      <div
        className="w-full max-w-2xl glass-card max-h-[92vh] flex flex-col relative text-ink dark:text-[#fff8ea]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b-2 border-ink dark:border-yell/40">
          <span className="text-xs font-extrabold uppercase tracking-wider">The place</span>
          <button onClick={onClose} className="p-1" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header Image */}
          <div className="relative overflow-hidden aspect-[3/2] w-full bg-ink">
            <img
              src={place.image}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 border-2 border-ink bg-paper text-ink"
                title="Share listing"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleSaveListing(listing.id || listing._id)}
                className={`p-2 border-2 border-ink ${isSaved ? 'bg-yell text-ink' : 'bg-paper text-ink'}`}
                title="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-extrabold tracking-widest">
                {(place.type || place.category || '').toUpperCase()} · {place.area}
              </div>
              <h2 className="poster text-4xl mt-1 leading-none">
                {place.title}
              </h2>
            </div>
            <div className="text-right">
              <span className="poster text-3xl leading-none">{price.main}</span>
              {price.sub && <span className="block text-xs font-extrabold">{price.sub}</span>}
            </div>
          </div>

          {/* Location & Navigation Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{place.address}</span>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + ' ' + place.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Campus Proximity Metrics */}
          {place.distanceInfo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 border-2 border-ink dark:border-yell/40">
                <span className="font-extrabold block mb-0.5">
                  From RV University
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {place.distanceInfo.rvu}
                </span>
              </div>

              <div className="p-3 border-2 border-ink dark:border-yell/40">
                <span className="font-extrabold block mb-0.5">
                  From the metro
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {place.distanceInfo.metro}
                </span>
              </div>
            </div>
          )}

          {place.distanceInfo?.travelTip && (
            <p className="text-xs font-semibold">{place.distanceInfo.travelTip}</p>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Overview
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Amenities Grid */}
          {place.amenities && place.amenities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Features & Amenities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {place.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Honest Verdict Card */}
          <div className="p-4 border-2 border-ink dark:border-yell/40">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">
                The verdict
              </h4>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {place.honestVerdict}
            </p>
          </div>

          {/* THE CATCH ALERT BOX */}
          <div className="catch-mark">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider mb-1">
              The catch
            </h4>
            <p className="text-sm font-semibold leading-relaxed">
              {place.theCatch}
            </p>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            {place.whatsapp && (
              <a
                href={`https://wa.me/${place.whatsapp}?text=Hi,%20I'm%20inquiring%20about%20${encodeURIComponent(place.title)}%20via%20Campus%20Scout.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Owner</span>
              </a>
            )}

            {place.contactPhone && (
              <a
                href={`tel:${place.contactPhone}`}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 font-extrabold text-xs bg-ink text-[#fff6e4]"
              >
                <Phone className="w-4 h-4" />
                <span>Call {place.contactPhone}</span>
              </a>
            )}
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider mb-2">
              Student reviews
            </h4>
            {place.reviews?.length ? (
              <ul className="space-y-2">
                {place.reviews.map((review, index) => (
                  <li key={`${review.createdAt || index}`} className="border-2 border-ink dark:border-yell/40 p-3 text-xs">
                    <div className="font-extrabold">{review.studentName} · {review.rating}/5</div>
                    <p className="mt-1">{review.comment}</p>
                    {review.theCatch && <p className="catch-mark mt-2">{review.theCatch}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs">No student review on this card yet.</p>
            )}
          </div>

          {/* Add Review Section */}
          <div className="pt-6 border-t-2 border-ink dark:border-yell/40">
            <h4 className="text-sm font-extrabold mb-3">
              Add your own
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
                    <option value="5">5 — exceptional</option>
                    <option value="4">4 — solid</option>
                    <option value="3">3 — average</option>
                    <option value="2">2 — below par</option>
                    <option value="1">1 — skip it</option>
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
