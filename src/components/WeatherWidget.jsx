import { useState } from 'react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  CloudFog, 
  Wind, 
  Droplets, 
  Compass, 
  RefreshCw, 
  X, 
  MapPin, 
  Info,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api.js';

export default function WeatherWidget({ isOpen, onClose, weatherData, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);

  if (!isOpen && !weatherData) return null;

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  const getWeatherIcon = (type) => {
    switch (type) {
      case 'Sun':
        return <Sun className="w-12 h-12 text-amber-500 animate-spin-slow" />;
      case 'CloudRain':
        return <CloudRain className="w-12 h-12 text-blue-500 animate-bounce" />;
      case 'CloudFog':
        return <CloudFog className="w-12 h-12 text-slate-400" />;
      default:
        return <CloudSun className="w-12 h-12 text-amber-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl glass-card overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Live Meteorological Feed
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            Updated {weatherData?.updatedAt || 'Recently'}
          </span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" />
              Mysore Road / Kengeri Hub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              RV University • Bangalore University • Global Village Tech Park
            </p>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50"
            title="Refresh live weather feed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>

        {/* Big Temperature Hero */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-amber-50/50 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-700 mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {weatherData?.temperature ?? 24}°
              </span>
              <span className="text-lg font-semibold text-slate-500 dark:text-slate-400">C</span>
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
              {weatherData?.condition || 'Partly Cloudy'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Feels like {weatherData?.feelsLike ?? 25}°C
            </p>
          </div>

          <div className="pr-2">
            {getWeatherIcon(weatherData?.iconType)}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
            <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Humidity</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {weatherData?.humidity ?? 78}%
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
            <Wind className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Wind</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {weatherData?.windSpeed ?? 12} km/h
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
            <Thermometer className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Precipitation</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {weatherData?.precipitation ?? 0} mm
            </p>
          </div>
        </div>

        {/* Student Commuter Advisory Callout */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-500/10 dark:border-amber-500/20 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-0.5">
              Campus Scout Commuter Tip
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
              {weatherData?.studentAdvisory || "Pleasant campus weather. Great time to walk between RV University gate and Pattanagere metro."}
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
