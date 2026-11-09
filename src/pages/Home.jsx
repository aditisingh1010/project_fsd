import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Train, 
  CloudSun, 
  ShieldAlert, 
  PlusCircle, 
  Filter, 
  RotateCcw,
  Map as MapIcon,
  LayoutGrid,
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ListingCard from '../components/ListingCard.jsx';
import ListingDetailModal from '../components/ListingDetailModal.jsx';
import CampusMap from '../components/CampusMap.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import MetroFareCalculator from '../components/MetroFareCalculator.jsx';
import ScamLedgerModal from '../components/ScamLedgerModal.jsx';
import SubmitListingModal from '../components/SubmitListingModal.jsx';
import { api } from '../services/api.js';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Modals state
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isTransitOpen, setIsTransitOpen] = useState(false);
  const [isScamsOpen, setIsScamsOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map' | 'both'

  // Weather data cache
  const [weatherData, setWeatherData] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(15000);

  // Load listings from Backend (with fallback)
  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await api.getListings({
        category: selectedCategory,
        area: selectedArea,
        search: searchQuery,
        verified: verifiedOnly,
        sort: sortBy
      });
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedArea, verifiedOnly, sortBy]);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Weather on Mount
  useEffect(() => {
    async function loadWeather() {
      const data = await api.getWeather();
      setWeatherData(data);
    }
    loadWeather();
  }, []);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedArea('all');
    setVerifiedOnly(false);
    setSortBy('featured');
    setMaxPrice(15000);
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'pg', label: 'PGs' },
    { id: 'food', label: 'Food' },
    { id: 'fix', label: 'Repairs' },
    { id: 'study', label: 'Study' },
    { id: 'essentials', label: 'Print' }
  ];

  const areas = [
    { id: 'all', label: 'All Pockets' },
    { id: 'Pattanagere', label: 'Pattanagere (RVU)' },
    { id: 'Kengeri', label: 'Kengeri' },
    { id: 'RR Nagar', label: 'RR Nagar' },
    { id: 'Banashankari', label: 'Banashankari' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onOpenWeather={() => setIsWeatherOpen(true)}
        onOpenTransit={() => setIsTransitOpen(true)}
        onOpenScams={() => setIsScamsOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        weatherData={weatherData}
      />

      <section className="hero-screen">
        <div className="flex flex-wrap gap-2">
          <span className="sticker">NO BROKER FEE</span>
          <span className="sticker-line">THE CATCH IS ON THE CARD</span>
        </div>
        <h1 className="poster text-5xl sm:text-7xl lg:text-8xl max-w-4xl mt-4">
          Find a place<br />worth your rent.
        </h1>
        <p className="max-w-md mt-3 text-white/85">
          PGs, mess food, repairs, and scam alerts around RV University. Students wrote the catch.
        </p>
        <form
          className="mt-5 flex items-center max-w-xl bg-black/50 border border-white/40 p-1.5 pl-4"
          onSubmit={(e) => {
            e.preventDefault();
            fetchListings();
            document.getElementById('filters')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <Search className="w-4 h-4 text-white/70 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="PG near Pattanagere, Anna meals, Wi-Fi curfew…"
            className="w-full bg-transparent border-0 text-sm text-white placeholder-white/60 focus:ring-0 focus:outline-none"
          />
          <button type="submit" className="bg-yell text-ink font-extrabold text-sm px-4 py-2">
            Search
          </button>
        </form>
      </section>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">

        {/* CAMPUS POCKETS & FILTER BAR */}
        <section id="filters" className="space-y-4 sticky top-16 z-30 bg-paper dark:bg-night py-3 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 text-xs font-extrabold whitespace-nowrap border-2 border-ink dark:border-yell/40 ${
                    selectedCategory === cat.id
                      ? 'bg-yell text-ink'
                      : 'bg-white dark:bg-[#1c0c16] text-ink dark:text-[#fff8ea]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center border-2 border-ink dark:border-yell/40 self-start md:self-auto shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-xs font-extrabold flex items-center gap-1.5 ${
                  viewMode === 'grid' ? 'bg-yell text-ink' : 'text-ink dark:text-[#fff8ea]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 text-xs font-extrabold flex items-center gap-1.5 border-l-2 border-ink dark:border-yell/40 ${
                  viewMode === 'map' ? 'bg-yell text-ink' : 'text-ink dark:text-[#fff8ea]'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Map
              </button>
              <button
                onClick={() => setViewMode('both')}
                className={`px-3 py-2 text-xs font-extrabold flex items-center gap-1.5 border-l-2 border-ink dark:border-yell/40 ${
                  viewMode === 'both' ? 'bg-yell text-ink' : 'text-ink dark:text-[#fff8ea]'
                }`}
              >
                <Compass className="w-4 h-4" />
                Split
              </button>
            </div>
          </div>

          <div className="p-4 border-2 border-ink dark:border-yell/40 bg-white dark:bg-[#1c0c16] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-extrabold mr-1">Area</span>
              {areas.map(area => (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`px-3 py-1 text-xs font-extrabold border-2 border-ink dark:border-yell/40 ${
                    selectedArea === area.id
                      ? 'bg-yell text-ink'
                      : 'bg-paper dark:bg-night text-ink dark:text-[#fff8ea]'
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer font-extrabold">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Verified only</span>
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-extrabold border-2 border-ink dark:border-yell/40 bg-paper dark:bg-night text-ink dark:text-[#fff8ea] py-1.5 pl-2.5 pr-8"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>

              {(selectedCategory !== 'all' || selectedArea !== 'all' || verifiedOnly || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="p-1.5 border-2 border-ink dark:border-yell/40"
                  title="Reset filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* MAP RADAR VIEW (when mode is 'map' or 'both') */}
        {(viewMode === 'map' || viewMode === 'both') && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="poster text-3xl text-ink dark:text-[#fff8ea]">Around campus</h2>
              <span className="text-xs font-extrabold">
                {listings.length} on the map
              </span>
            </div>
            <CampusMap listings={listings} onSelectListing={(l) => setSelectedListing(l)} />
          </section>
        )}

        {/* LISTINGS SECTION (when mode is 'grid' or 'both') */}
        {(viewMode === 'grid' || viewMode === 'both') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="poster text-4xl text-ink dark:text-[#fff8ea] flex items-center gap-3">
                  The board
                  <span className="sticker text-[11px]">{listings.length} up</span>
                </h2>
                <p className="text-xs font-semibold mt-2 text-ink/70 dark:text-[#fff8ea]/70">
                  Flip a card. The back is what the place leaves out.
                </p>
              </div>

              <button
                onClick={() => setIsSubmitOpen(true)}
                className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold border-2 border-ink dark:border-yell/40 px-3 py-2 bg-yell text-ink"
              >
                <PlusCircle className="w-4 h-4" />
                Know a good place? Add it
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="rounded-3xl h-80 glass-card animate-pulse p-4 flex flex-col justify-between">
                    <div className="w-full h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                    <div className="space-y-2">
                      <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <ListingCard
                    key={listing.id || listing._id}
                    listing={listing}
                    onSelect={(l) => setSelectedListing(l)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 p-8 rounded-3xl glass-card border border-dashed border-slate-300 dark:border-slate-800">
                <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="poster text-3xl mb-2">
                  Nothing in this pocket
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                  Try clearing the search query or selecting "All Pockets" to see places across Bengaluru.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* FRAUD RADAR & TRANSIT HIGHLIGHT CALLOUTS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Scam Radar Highlight Banner */}
          <div className="p-6 border-2 border-ink dark:border-yell/40 bg-white dark:bg-[#1c0c16] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Community Fraud Defense
                </span>
              </div>
              <h3 className="poster text-3xl text-ink dark:text-[#fff8ea]">
                Reported PG & deposit scams
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Fraudulent "holding deposits" on OLX, hidden paint deductions, and aggressive brokers at Pattanagere metro are tracked on the Scout Ledger.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-rose-200/50 dark:border-rose-900/40 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                3 active fraud alerts
              </span>
              <button
                onClick={() => setIsScamsOpen(true)}
                className="px-4 py-2 text-xs font-extrabold bg-yell text-ink flex items-center gap-1.5"
              >
                <span>Open Scam Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Metro & Commute Fare Estimator Banner */}
          <div className="p-6 border-2 border-ink dark:border-yell/40 bg-white dark:bg-[#1c0c16] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Train className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                  Bengaluru Transit Calculator
                </span>
              </div>
              <h3 className="poster text-3xl text-ink dark:text-[#fff8ea]">
                Purple Line & auto split
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Calculate metro token vs smartcard fares from Pattanagere or Kengeri to Majestic, plus auto-meter split costs for campus student groups.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-purple-200/50 dark:border-purple-900/40 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                Direct to Majestic in 24 mins
              </span>
              <button
                onClick={() => setIsTransitOpen(true)}
                className="px-4 py-2 text-xs font-extrabold bg-yell text-ink flex items-center gap-1.5"
              >
                <span>Calculate Fares</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* METHODOLOGY: WHY CAMPUS SCOUT EXISTS */}
        <section className="p-8 sm:p-10 border-2 border-ink dark:border-yell/40 space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-xs font-extrabold uppercase tracking-wider mb-2">
              House rule
            </h3>
            <h2 className="poster text-4xl text-ink dark:text-[#fff8ea]">
              Why we never accept broker listings.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <span className="poster text-4xl text-ink dark:text-yell">01</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Anonymous Student Visits
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We inspect rooms unannounced. We check hot water geysers, Wi-Fi speed test latency at 9 PM, and meal quality.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <span className="poster text-4xl text-ink dark:text-yell">02</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Mandatory "The Catch"
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every listing must declare the downsides: whether it is strict curfew, low water pressure on top floors, or noisy traffic.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <span className="poster text-4xl text-ink dark:text-yell">03</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Zero Commission Policy
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Brokers charge half-a-month rent just to show a room. Campus Scout gives direct owner WhatsApp and phone contacts for free.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer 
        onOpenWeather={() => setIsWeatherOpen(true)}
        onOpenTransit={() => setIsTransitOpen(true)}
        onOpenScams={() => setIsScamsOpen(true)}
      />

      {/* MODALS */}
      <ListingDetailModal 
        listing={selectedListing} 
        onClose={() => setSelectedListing(null)}
        onReviewAdded={fetchListings}
      />

      <WeatherWidget
        isOpen={isWeatherOpen}
        onClose={() => setIsWeatherOpen(false)}
        weatherData={weatherData}
        onRefresh={async () => {
          const fresh = await api.getWeather();
          setWeatherData(fresh);
        }}
      />

      <MetroFareCalculator
        isOpen={isTransitOpen}
        onClose={() => setIsTransitOpen(false)}
      />

      <ScamLedgerModal
        isOpen={isScamsOpen}
        onClose={() => setIsScamsOpen(false)}
      />

      <SubmitListingModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onListingCreated={fetchListings}
      />
    </div>
  );
}
