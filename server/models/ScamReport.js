import mongoose from 'mongoose';

const scamReportSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  category: { type: String, default: 'other' },
  area: { type: String, required: true },
  scammerInfo: { type: String, required: true },
  description: { type: String, required: true },
  warningLevel: { type: String, enum: ['MODERATE', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  upvotes: { type: Number, default: 1 },
  reportedBy: { type: String, default: 'Anonymous Scout' },
  dateReported: { type: String, default: () => new Date().toISOString().split('T')[0] },
  createdAt: { type: Date, default: Date.now }
});

const ScamReport = mongoose.models.ScamReport || mongoose.model('ScamReport', scamReportSchema);
export default ScamReport;
