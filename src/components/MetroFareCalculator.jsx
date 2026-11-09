import { useState, useEffect } from 'react';
import { Train, Car, Users, ArrowRight, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70">
      <div
        className="w-full max-w-xl glass-card p-6 relative max-h-[90vh] overflow-y-auto text-ink dark:text-[#fff8ea]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 border-2 border-ink dark:border-yell/40"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="sticker inline-block mb-3">MYSORE ROAD</p>
        <h3 className="poster text-4xl pr-10">
          Purple Line & the auto
        </h3>
        <p className="text-xs font-semibold mt-2 mb-6 opacity-80">
          Token, smartcard, then how the meter splits between you.
        </p>

        <div className="p-4 border-2 border-ink dark:border-yell/40 mb-5 bg-paper dark:bg-night">
          <div className="flex items-center gap-2 mb-3">
            <Train className="w-4 h-4" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider">
              Namma Metro, Purple Line
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1">From</label>
              <select
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="w-full text-xs font-extrabold py-2 px-2"
              >
                {stations.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1">To</label>
              <select
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="w-full text-xs font-extrabold py-2 px-2"
              >
                {stations.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {metroResult && (
            <div className="p-3 border-2 border-ink dark:border-yell/40 flex items-center justify-between gap-3 bg-white dark:bg-[#1c0c16]">
              <div>
                <p className="text-xs font-extrabold">
                  {metroResult.from} <ArrowRight className="w-3 h-3 inline mx-1" /> {metroResult.to}
                </p>
                <p className="text-xs mt-1 opacity-70">
                  {metroResult.distanceKm} km · {metroResult.estimatedTravelTime}
                </p>
              </div>
              <div className="text-right">
                <span className="poster text-4xl">₹{metroResult.tokenFare}</span>
                <span className="block text-[11px] font-extrabold">token</span>
                <span className="block text-[11px] font-extrabold mt-1 bg-yell text-ink px-1">
                  ₹{metroResult.smartCardFare} smartcard
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-2 border-ink bg-[#1a1204] text-white mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-4 h-4 text-yell" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-yell">
              Auto meter, split the ride
            </h4>
          </div>
          <p className="text-[11px] mb-4 text-white/70">
            ₹30 for the first 2 km, then ₹15 each extra km. Rounded, then split.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1">
                Distance {autoDistance} km
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={autoDistance}
                onChange={(e) => setAutoDistance(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-[11px] font-extrabold uppercase mb-1">
                <Users className="w-3.5 h-3.5" /> {passengerCount} students
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={passengerCount}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          {autoResult && (
            <div className="p-3 bg-yell text-ink flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase">Meter</p>
                <p className="poster text-4xl">₹{autoResult.totalAutoFare}</p>
                <p className="text-[11px] font-semibold mt-1">{autoResult.studentTip}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-extrabold uppercase">Each</p>
                <span className="poster text-5xl">₹{autoResult.perPersonCost}</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-yell text-ink font-extrabold text-xs uppercase tracking-wider"
        >
          Close
        </button>
      </div>
    </div>
  );
}
