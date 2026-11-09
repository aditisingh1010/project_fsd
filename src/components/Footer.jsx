import { Link } from 'react-router-dom';
import { ShieldAlert, Heart } from 'lucide-react';

export default function Footer({ onOpenWeather, onOpenTransit, onOpenScams }) {
  return (
    <footer className="w-full border-t-2 border-ink dark:border-yell/40 bg-paper dark:bg-night mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="poster text-3xl text-ink dark:text-[#fff8ea]">
              Campus Scout
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The unfiltered peer city guide built by students, for students. We document the honest verdict and the downsides nobody warns you about.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>100% Broker-Free & Honest</span>
            </div>
          </div>

          {/* Col 2: Campus Pockets */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Campus Pockets
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                Pattanagere (RV University Gate)
              </li>
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                Kengeri Satellite Town Hub
              </li>
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                Rajarajeshwari Nagar (Student Suburb)
              </li>
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                Banashankari & Jnanabharathi
              </li>
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                Global Village Tech Corridor
              </li>
            </ul>
          </div>

          {/* Col 3: Useful Student Utilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Student Tools & APIs
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button onClick={onOpenWeather} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left">
                  Live Campus Weather & Advisory
                </button>
              </li>
              <li>
                <button onClick={onOpenTransit} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left">
                  Purple Line Metro & Auto Calculator
                </button>
              </li>
              <li>
                <button onClick={onOpenScams} className="hover:text-rose-600 dark:hover:text-rose-400 text-left">
                  Scam Radar & Olx Deposit Fraud
                </button>
              </li>
              <li>
                <Link to="/signup" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Join the Verified Scout Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Tech Stack & Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Technical Architecture
            </h4>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <p>• <b>Frontend:</b> React 19 + Tailwind CSS + Leaflet</p>
              <p>• <b>Backend:</b> Node.js + Express.js API</p>
              <p>• <b>Database:</b> MongoDB Atlas Cloud Cluster</p>
              <p>• <b>Live APIs:</b> Open-Meteo Meteorology + BMRCL Transit</p>
              <p>• <b>Deployment:</b> Netlify (Client) + Render (API)</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Campus Scout Bengaluru. Designed for FSD Project & University Campuses.</p>
          <p className="flex items-center gap-1 font-medium">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Bengaluru college students
          </p>
        </div>
      </div>
    </footer>
  );
}
