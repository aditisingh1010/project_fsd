import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  CloudSun, 
  Moon, 
  Sun, 
  PlusCircle, 
  ShieldAlert, 
  Train, 
  User as UserIcon, 
  LogOut, 
  Bookmark, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { api } from '../services/api.js';

export default function Header({ 
  onOpenWeather, 
  onOpenTransit, 
  onOpenScams, 
  onOpenSubmit,
  currentLocationName = "RV University Pocket",
  weatherData = null
}) {
  const { user, isAuthenticated, logout, savedListings } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full glass-header border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              CampusScout
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                BLR
              </span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline -mt-0.5">
              The zero-BS peer guide
            </span>
          </div>
        </Link>

        {/* Live Weather & Location Pills (Center / Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Location Chip */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-subtle">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            <span>{currentLocationName}</span>
          </div>

          {/* Live Weather Preview Pill */}
          <button
            onClick={onOpenWeather}
            title="Click for full campus weather radar"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50 hover:bg-amber-100/70 transition-colors shadow-subtle cursor-pointer"
          >
            <CloudSun className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{weatherData ? `${weatherData.temperature}°C • ${weatherData.condition}` : '24°C • Live Weather'}</span>
          </button>

          {/* Transit Calculator Pill */}
          <button
            onClick={onOpenTransit}
            title="Metro & Auto Fare Calculator"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50 hover:bg-purple-100/70 transition-colors shadow-subtle cursor-pointer"
          >
            <Train className="w-3.5 h-3.5 text-purple-500" />
            <span>Metro & Auto Fares</span>
          </button>

          {/* Scam Radar Pill */}
          <button
            onClick={onOpenScams}
            title="Scam Alerts & Fraud Warnings"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50 hover:bg-rose-100/70 transition-colors shadow-subtle cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Scam Radar</span>
          </button>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Post a Place Button */}
          <button
            onClick={onOpenSubmit}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
            <span>Submit a Place</span>
          </button>

          {/* Auth State / Profile */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center">
                  {user?.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl glass-card py-2 shadow-2xl z-50 border border-slate-200 dark:border-slate-700"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                      {user?.campus || 'RV University'}
                    </span>
                  </div>

                  <div className="px-2 py-1">
                    <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-indigo-500" /> Saved Bookmarks
                      </span>
                      <span className="font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[11px]">
                        {savedListings.length}
                      </span>
                    </div>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
              >
                Join Scouts
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => { onOpenWeather(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 text-left"
            >
              <CloudSun className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Campus Weather</span>
            </button>

            <button
              onClick={() => { onOpenTransit(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 text-left"
            >
              <Train className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Metro & Auto Fares</span>
            </button>

            <button
              onClick={() => { onOpenScams(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 text-left"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Scam Radar</span>
            </button>

            <button
              onClick={() => { onOpenSubmit(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 text-left"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Submit Place</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
