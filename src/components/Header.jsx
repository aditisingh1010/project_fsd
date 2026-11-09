import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Bookmark, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Header({
  onOpenWeather,
  onOpenTransit,
  onOpenScams,
  onOpenSubmit,
  weatherData = null
}) {
  const { user, isAuthenticated, logout, savedListings } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const link = 'bg-transparent border-0 font-semibold text-sm';
  const bar = solid
    ? 'bg-paper/95 text-ink border-ink dark:bg-night/95 dark:text-[#fff8ea] dark:border-yell/40'
    : 'bg-transparent text-white border-transparent';

  const closeMobile = (fn) => {
    setMobileMenuOpen(false);
    fn();
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 border-b-2 transition-colors ${bar}`}>
      <div className="px-4 sm:px-7 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="font-extrabold text-lg tracking-tight">
          Campus Scout
        </Link>

        <div className="hidden lg:flex items-center gap-5">
          <button className={link} onClick={onOpenWeather}>
            {weatherData ? `${Math.round(weatherData.temperature)}°` : '26°'}
          </button>
          <button className={link} onClick={onOpenTransit}>Metro</button>
          <button className={link} onClick={onOpenScams}>Scams</button>
          <button className={link} onClick={onOpenSubmit}>Submit</button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="text-sm font-extrabold px-2 py-1"
              >
                {user?.name?.split(' ')[0] || 'You'}
              </button>
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1c0c16] text-ink dark:text-[#fff8ea] border-2 border-ink dark:border-yell/40 p-3 z-50"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <p className="text-sm font-extrabold truncate">{user?.name}</p>
                  <p className="text-xs opacity-70 truncate">{user?.email}</p>
                  <p className="text-xs mt-1">{user?.campus || 'RV University'}</p>
                  <p className="mt-3 text-sm font-extrabold flex items-center justify-between">
                    <span className="inline-flex items-center gap-1"><Bookmark className="w-4 h-4" /> Saved</span>
                    <span>{savedListings.length}</span>
                  </p>
                  <button onClick={logout} className="mt-2 w-full text-left text-sm font-extrabold inline-flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm font-extrabold">Login</Link>
          )}

          <button
            className="lg:hidden p-2"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden grid grid-cols-2 gap-2 p-3 border-t-2 border-ink dark:border-yell/40 bg-paper dark:bg-night text-ink dark:text-[#fff8ea]">
          <button className="border-2 border-ink dark:border-yell/40 p-3 text-left font-extrabold text-sm" onClick={() => closeMobile(onOpenWeather)}>Weather</button>
          <button className="border-2 border-ink dark:border-yell/40 p-3 text-left font-extrabold text-sm" onClick={() => closeMobile(onOpenTransit)}>Metro & auto</button>
          <button className="border-2 border-ink dark:border-yell/40 p-3 text-left font-extrabold text-sm" onClick={() => closeMobile(onOpenScams)}>Scam ledger</button>
          <button className="border-2 border-ink dark:border-yell/40 p-3 text-left font-extrabold text-sm" onClick={() => closeMobile(onOpenSubmit)}>Submit a place</button>
        </div>
      )}
    </header>
  );
}
