import { useState, useEffect } from 'react';
import { Train, Car, Users, ArrowRight, X, AlertCircle, Info } from 'lucide-react';
import { api } from '../services/api.js';

export default function MetroFareCalculator({ isOpen, onClose }) {
  const [fromStation, setFromStation] = useState('Pattanagere');
  const [toStation, setToStation] = useState('Nadaprabhu Kempegowda Stn (Majestic)');
  const [metroResult, setMetroResult] = useState(null);
  const [stations, setStations] = useState([]);

  // Auto split calculator
  const [autoDistance, setAutoDistance] = useState(3.5);
  const [passengerCount, setPassengerCount] = useState(3);
  const [autoResult, setAutoResult] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await api.getMetroInfo(fromStation, toStation);
      setStations(data.stations || []);
      setMetroResult(data.lookup);

      const auto = await api.getAutoFare(autoDistance, passengerCount);
      setAutoResult(auto);
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen, fromStation, toStation, autoDistance, passengerCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-3xl glass-card overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Commute & Fare Optimizer
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
          BMRCL Purple Line & Auto Fare Estimator
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Official tariffs for Mysore Road, Pattanagere, and Kengeri student transit.
        </p>

        {/* Metro Section */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Train className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Namma Metro (Purple Line)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                From Station
              </label>
              <select
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {stations.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                To Station
              </label>
              <select
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {stations.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {metroResult && (
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-purple-900 dark:text-purple-300">
                  {metroResult.from} <ArrowRight className="w-3 h-3 inline mx-1" /> {metroResult.to}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Distance: {metroResult.distanceKm} km • Est. Time: {metroResult.estimatedTravelTime}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-extrabold text-purple-700 dark:text-purple-300">
                  ₹{metroResult.tokenFare}
                </span>
                <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{metroResult.smartCardFare} (Smartcard)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Auto Pooling Fare Section */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Bengaluru Auto-Rickshaw Pool Estimator
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Distance (km): {autoDistance} km
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={autoDistance}
                onChange={(e) => setAutoDistance(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Students Pooling: {passengerCount}
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={passengerCount}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {autoResult && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  Total Meter Fare: ₹{autoResult.totalAutoFare}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {autoResult.studentTip}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{autoResult.perPersonCost}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                  per student
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
        >
          Close Transit Guide
        </button>
      </div>
    </div>
  );
}
