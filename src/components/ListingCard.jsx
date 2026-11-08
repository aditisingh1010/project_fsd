import { useState } from 'react';
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  MessageCircle, 
  ExternalLink, 
  Navigation,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ListingCard({ listing, onSelect }) {
  const { savedListings, toggleSaveListing } = useAuth();
  const isSaved = savedListings.includes(listing.id || listing._id);

  const formatPricePeriod = (period) => {
    switch (period) {
      case 'month': return '/month';
      case 'meal': return '/meal';
      case 'service': return '/service';
      default: return '';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'pg': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/60';
      case 'food': return 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200/60 dark:border-orange-800/60';
      case 'fix': return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/60';
      case 'study': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60';
      default: return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <article className="group relative rounded-3xl glass-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full border border-slate-200/80 dark:border-slate-700/80 hover:-translate-y-1">
      {/* Top Image Section */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={listing.image}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm backdrop-blur-md ${getCategoryColor(listing.category)}`}>
            {listing.type || listing.category}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveListing(listing.id || listing._id);
            }}
            title={isSaved ? "Remove from bookmarks" : "Save bookmark"}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Details on Image */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{listing.area}</span>
              {listing.distanceInfo?.rvu && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-200 text-[11px]">{listing.distanceInfo.rvu}</span>
                </>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-black text-white drop-shadow-md">
              ₹{listing.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-semibold text-slate-300 drop-shadow-sm">
              {formatPricePeriod(listing.pricePeriod)}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title & Verified Indicator */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 
            onClick={() => onSelect(listing)}
            className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
          >
            {listing.title}
          </h3>

          <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-bold">
            <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
            <span>{listing.rating || 4.5}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {listing.description}
        </p>

        {/* Amenities Chips */}
        {listing.amenities && listing.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {listing.amenities.slice(0, 3).map((amenity, i) => (
              <span 
                key={i} 
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 text-slate-400">
                +{listing.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* SIGNATURE CAMPUS SCOUT FEATURE: THE CATCH (Peer Honesty) */}
        <div className="mt-auto mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-500/5 dark:border-amber-500/20 relative">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              The Peer Catch
            </span>
          </div>
          <p className="text-xs font-medium text-amber-900/90 dark:text-amber-200/90 leading-snug">
            {listing.theCatch}
          </p>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelect(listing)}
            className="flex-grow py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity text-center"
          >
            Honest Breakdown
          </button>

          {listing.whatsapp && (
            <a
              href={`https://wa.me/${listing.whatsapp}?text=Hi,%20I%20found%20your%20place%20via%20Campus%20Scout%20student%20guide.`}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat with owner on WhatsApp"
              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
