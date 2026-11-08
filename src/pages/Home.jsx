import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
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
    { id: 'all', label: 'All Categories', emoji: '✨' },
    { id: 'pg', label: 'PGs & Hostels', emoji: '🏠' },
    { id: 'food', label: 'Student Food', emoji: '🍲' },
    { id: 'fix', label: 'Laptop & Tech Fix', emoji: '🔧' },
    { id: 'study', label: 'Study & Work', emoji: '📚' },
    { id: 'essentials', label: 'Printing & Xerox', emoji: '🖨️' }
  ];

  const areas = [
    { id: 'all', label: 'All Pockets' },
    { id: 'Pattanagere', label: 'Pattanagere (RVU)' },
    { id: 'Kengeri', label: 'Kengeri' },
    { id: 'RR Nagar', label: 'RR Nagar' },
    { id: 'Banashankari', label: 'Banashankari' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header 
        onOpenWeather={() => setIsWeatherOpen(true)}
        onOpenTransit={() => setIsTransitOpen(true)}
        onOpenScams={() => setIsScamsOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        weatherData={weatherData}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
        {/* HERO SECTION */}
        <section className="relative rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-2xl border border-indigo-950">
          {/* Subtle Glow Blobs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-5">
            {/* Top Pill Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Bengaluru Campus Scout
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero Brokerage • Honest Peer Reviews
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              The student guide that gives you <span className="text-gradient">the real catch.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              No staged photos. No fake 4.9 ratings. Real student verdicts on PGs, cheap messes, laptop repairs, and scam alerts around RV University, Mysore Road, and Kengeri.
            </p>

            {/* Smart Search Bar */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl gap-2">
                <div className="flex items-center flex-grow px-3 py-2 text-white">
                  <Search className="w-5 h-5 text-indigo-300 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 'PG near Pattanagere', 'Anna meals', 'WiFi curfew'..."
                    className="w-full bg-transparent border-none text-sm text-white placeholder-slate-400 focus:ring-0 focus:outline-none"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-white px-2"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  onClick={fetchListings}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  Search Scout
                </button>
              </div>
            </div>

            {/* Live Campus Quick Links Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400 font-medium">Quick Jump:</span>
              <button 
                onClick={() => setSelectedCategory('pg')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
              >
                🏠 PGs & Hostels
              </button>
              <button 
                onClick={() => setSelectedCategory('food')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
              >
                🍲 Student Canteens
              </button>
              <button 
                onClick={() => setIsScamsOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Olx QR Scam Alerts
              </button>
              <button 
                onClick={() => setIsTransitOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-colors flex items-center gap-1"
              >
                <Train className="w-3.5 h-3.5" />
                Purple Line Metro Fare
              </button>
            </div>
          </div>
        </section>

        {/* CAMPUS POCKETS & FILTER BAR */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-100'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* View Mode Toggle (Grid vs Map) */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-auto shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'map'
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Interactive map view"
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Map Radar</span>
              </button>
              <button
                onClick={() => setViewMode('both')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'both'
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Split map and cards"
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Split</span>
              </button>
            </div>
          </div>

          {/* Area Pockets & Secondary Filters */}
          <div className="p-4 rounded-2xl glass-card flex flex-wrap items-center justify-between gap-4">
            {/* Area Switcher */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Area:
              </span>
              {areas.map(area => (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedArea === area.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>

            {/* Verified & Sorting Controls */}
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Verified Picks Only</span>
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1.5 pl-2.5 pr-8 font-medium"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              {(selectedCategory !== 'all' || selectedArea !== 'all' || verifiedOnly || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-500" />
                Campus Geolocation & Distance Radar
              </h2>
              <span className="text-xs text-slate-500">
                Showing {listings.length} verified landmarks
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
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Honest Listings & Verdicts
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {listings.length} available
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every card features "The Catch" — what the brokers and landlords hide.
                </p>
              </div>

              <button
                onClick={() => setIsSubmitOpen(true)}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
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
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                  No listings found for this filter
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
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Community Fraud Defense
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Reported PG & Deposit Scams
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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-1.5"
              >
                <span>Open Scam Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Metro & Commute Fare Estimator Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Train className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                  Bengaluru Transit Calculator
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                BMRCL Purple Line & Auto Pool Tool
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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-1.5"
              >
                <span>Calculate Fares</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* METHODOLOGY: WHY CAMPUS SCOUT EXISTS */}
        <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Our Editorial Standard
            </h3>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Why we never accept broker listings.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">01</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Anonymous Student Visits
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We inspect rooms unannounced. We check hot water geysers, Wi-Fi speed test latency at 9 PM, and meal quality.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <span className="text-2xl font-black text-amber-500">02</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Mandatory "The Catch"
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every listing must declare the downsides: whether it is strict curfew, low water pressure on top floors, or noisy traffic.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <span className="text-2xl font-black text-emerald-500">03</span>
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
