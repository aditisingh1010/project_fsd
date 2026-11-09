import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ListingCard({ listing, onSelect }) {
  const { savedListings, toggleSaveListing } = useAuth();
  const id = listing.id || listing._id;
  const isSaved = savedListings.includes(id);
  const [flipped, setFlipped] = useState(false);

  const period = listing.pricePeriod === 'month'
    ? '/mo'
    : listing.pricePeriod === 'meal'
      ? '/meal'
      : listing.pricePeriod === 'service'
        ? ''
        : '';

  return (
    <article
      className={`flip-card ${flipped ? 'is-flipped' : ''}`}
      onClick={(e) => {
        if (e.target.closest('[data-stop]')) return;
        setFlipped((v) => !v);
      }}
    >
      <div className="flip-inner">
        <div className="flip-face">
          <button
            data-stop
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveListing(id);
            }}
            className={`absolute top-3 right-3 z-10 text-xs font-extrabold px-2 py-1 border-2 border-ink ${isSaved ? 'bg-yell text-ink' : 'bg-white text-ink'}`}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <img src={listing.image} alt="" className="w-full h-40 object-cover" />
          <div className="p-3 flex flex-col flex-1">
            <div className="text-[11px] font-extrabold tracking-widest">
              {(listing.type || listing.category || '').toUpperCase()} · {listing.area}
            </div>
            <h3 className="poster text-[26px] mt-1">{listing.title}</h3>
            <p className="text-sm opacity-70 mt-1">{listing.distanceInfo?.rvu}</p>
            <p className="poster text-3xl mt-2">
              ₹{listing.price.toLocaleString('en-IN')}
              <span className="font-sans text-xs font-bold normal-case tracking-normal">{period}</span>
            </p>
            <p className="mt-auto text-xs font-extrabold tracking-wider">FLIP FOR THE CATCH →</p>
          </div>
        </div>

        <div className="flip-face flip-back">
          <div className="p-4 flex flex-col h-full">
            <div className="text-[11px] font-extrabold tracking-widest text-yell">WHAT THEY DON'T PUT ON THE POSTER</div>
            <h3 className="poster text-[26px] mt-2">{listing.title}</h3>
            <p className="catch-mark mt-3">{listing.theCatch}</p>
            <p className="text-sm mt-3 text-white/80">{listing.honestVerdict}</p>
            <div className="mt-auto pt-3 flex gap-2">
              <button
                data-stop
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(listing);
                }}
                className="flex-1 bg-yell text-ink text-xs font-extrabold py-2"
              >
                Full details
              </button>
              {listing.whatsapp && (
                <a
                  data-stop
                  href={`https://wa.me/${listing.whatsapp}?text=Hi,%20I%20found%20your%20place%20via%20Campus%20Scout.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 border border-yell text-yell text-xs font-extrabold inline-flex items-center gap-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
