import { useState } from 'react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  CloudFog, 
  Wind, 
  Droplets, 
  RefreshCw, 
  X, 
  Thermometer
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70">
      <div
        className="w-full max-w-lg glass-card p-6 relative text-ink dark:text-[#fff8ea]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 border-2 border-ink dark:border-yell/40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="sticker">Campus weather</span>
          <span className="text-[11px] font-medium text-slate-400">
            Updated {weatherData?.updatedAt || 'Recently'}
          </span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="poster text-4xl mt-3">
              Mysore Road
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
        <div className="p-5 border-2 border-ink dark:border-yell/40 bg-yell text-ink mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="poster text-7xl">
                {weatherData?.temperature ?? 24}°
              </span>
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
          <div className="p-3 border-2 border-ink dark:border-yell/40 text-center">
            <Droplets className="w-4 h-4 mx-auto mb-1" />
            <p className="text-[11px] font-extrabold uppercase">Humidity</p>
            <p className="poster text-2xl">{weatherData?.humidity ?? 78}%</p>
          </div>

          <div className="p-3 border-2 border-ink dark:border-yell/40 text-center">
            <Wind className="w-4 h-4 mx-auto mb-1" />
            <p className="text-[11px] font-extrabold uppercase">Wind</p>
            <p className="poster text-2xl">{weatherData?.windSpeed ?? 12}</p>
          </div>

          <div className="p-3 border-2 border-ink dark:border-yell/40 text-center">
            <Thermometer className="w-4 h-4 mx-auto mb-1" />
            <p className="text-[11px] font-extrabold uppercase">Rain</p>
            <p className="poster text-2xl">{weatherData?.precipitation ?? 0}</p>
          </div>
        </div>

        {/* Student Commuter Advisory Callout */}
        <div className="p-4 border-2 border-ink dark:border-yell/40 bg-paper dark:bg-night">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider mb-1">
              Commuter tip
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
              {weatherData?.studentAdvisory || "Pleasant campus weather. Great time to walk between RV University gate and Pattanagere metro."}
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 bg-ink text-[#fff6e4] dark:bg-yell dark:text-ink font-extrabold text-xs uppercase"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
