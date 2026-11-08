import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ThumbsUp, 
  PlusCircle, 
  X, 
  CheckCircle, 
  MapPin, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { api } from '../services/api.js';

export default function ScamLedgerModal({ isOpen, onClose }) {
  const [scams, setScams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('Kengeri & Pattanagere');
  const [scammerInfo, setScammerInfo] = useState('');
  const [description, setDescription] = useState('');
  const [warningLevel, setWarningLevel] = useState('HIGH');
  const [reportedBy, setReportedBy] = useState('');

  useEffect(() => {
    async function loadScams() {
      if (isOpen) {
        setLoading(true);
        const data = await api.getScams();
        setScams(data);
        setLoading(false);
      }
    }
    loadScams();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpvote = async (scamId) => {
    try {
      const res = await api.upvoteScam(scamId);
      setScams(prev => prev.map(s => (s.id === scamId || s._id === scamId) ? { ...s, upvotes: res.upvotes } : s));
    } catch (e) {
      // Optimistic update
      setScams(prev => prev.map(s => (s.id === scamId || s._id === scamId) ? { ...s, upvotes: (s.upvotes || 1) + 1 } : s));
    }
  };

  const handleCreateScam = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const created = await api.createScam({
        title,
        area,
        scammerInfo: scammerInfo.trim() || 'Unidentified individual / WhatsApp profile',
        description,
        warningLevel,
        reportedBy: reportedBy.trim() || 'Anonymous Scout'
      });
      setScams(prev => [created, ...prev]);
      setFeedback('Scam alert published to protect campus students!');
      setShowAddForm(false);
      setTitle('');
      setDescription('');
      setScammerInfo('');
      setTimeout(() => setFeedback(''), 4000);
    } catch (e) {
      setFeedback('Error reporting scam');
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityStyle = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-3xl glass-card overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Peer Scam Ledger
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Community Protection Network
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 mt-1">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  Campus Fraud & Scam Radar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verified warnings reported by Bengaluru college students to prevent UPI and deposit fraud.
                </p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{showAddForm ? 'View List' : 'Flag Scam'}</span>
              </button>
            </div>
          </div>

          {feedback && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
              {feedback}
            </div>
          )}

          {/* Add Scam Form */}
          {showAddForm && (
            <form onSubmit={handleCreateScam} className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-300">
                Report a Fraud or Deceptive Practice
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Scam Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fake room deposit demand on OLX via QR code"
                  className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Area / Landmark
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Near Pattanagere Metro Pillar 320"
                    className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Warning Severity
                  </label>
                  <select
                    value={warningLevel}
                    onChange={(e) => setWarningLevel(e.target.value)}
                    className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                  >
                    <option value="CRITICAL">🔴 CRITICAL (Active financial fraud)</option>
                    <option value="HIGH">🟠 HIGH (Unnotified deductions/coercion)</option>
                    <option value="MODERATE">🟡 MODERATE (Misleading advertisements)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Scammer Contact / Identification (if known)
                </label>
                <input
                  type="text"
                  value={scammerInfo}
                  onChange={(e) => setScammerInfo(e.target.value)}
                  placeholder="e.g. Mobile number, fake broker name, or website link"
                  className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  What Happened? (Detailed Modus Operandi)
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain exactly how the scam worked so other students can recognize it..."
                  className="w-full text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  Publish Scam Warning
                </button>
              </div>
            </form>
          )}

          {/* Quick Prevention Tips */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-amber-900 dark:text-amber-200 mb-1">
                Golden Rule for Mysore Road & Kengeri PGs:
              </p>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                Never scan a QR code to "receive an advance" or "hold a room". Always visit physically, ask for the rental agreement terms in writing, and inspect water pressure in person.
              </p>
            </div>
          </div>

          {/* List of Scams */}
          <div className="space-y-4">
            {scams.map((scam) => (
              <div 
                key={scam.id || scam._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-600"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border mb-1.5 ${getSeverityStyle(scam.warningLevel)}`}>
                      {scam.warningLevel || 'HIGH'} ALERT
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {scam.title}
                    </h4>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={() => handleUpvote(scam.id || scam._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-xs font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all shadow-subtle shrink-0"
                    title="Confirm this happens"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{scam.upvotes || 1}</span>
                    <span className="hidden sm:inline text-[10px] text-slate-400">confirm</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {scam.description}
                </p>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{scam.area}</span>
                  </div>

                  <span>Reported by {scam.reportedBy} • {scam.dateReported}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
