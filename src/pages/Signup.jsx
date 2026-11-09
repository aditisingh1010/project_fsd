import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, User, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('RV University / Mysore Road');
  const [password, setPassword] = useState('');
  const [pledgeChecked, setPledgeChecked] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    if (!pledgeChecked) {
      setErrorMsg('You must agree to the honest student review pledge.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await register({
        name,
        email,
        password,
        campus
      });
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b-2 border-ink dark:border-yell/40 bg-paper dark:bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-extrabold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <Link to="/" className="font-extrabold text-lg">Campus Scout</Link>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Main Signup Card */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="poster text-5xl text-ink dark:text-[#fff8ea]">
              Make an account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Post honest verdicts, flag scams, and help peers avoid broker traps.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-card shadow-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditi Singh"
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  College / Campus Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditi@rvu.edu.in"
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Campus / University
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="RV University / Mysore Road">RV University (Mysore Road)</option>
                    <option value="RVCE Engineering">RV College of Engineering (RVCE)</option>
                    <option value="PES University Ring Road">PES University (Outer Ring Road)</option>
                    <option value="Bangalore University (Jnanabharathi)">Bangalore University (Jnanabharathi)</option>
                    <option value="RNSIT / JSSATE (RR Nagar)">RNSIT / JSSATE (RR Nagar)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Honest Pledge */}
              <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={pledgeChecked}
                  onChange={(e) => setPledgeChecked(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <span>
                  I pledge to review places honestly and always report <b>The Catch</b> (the downsides) for other students.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Join Campus Scout'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
