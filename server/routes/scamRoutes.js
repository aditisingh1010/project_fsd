import express from 'express';
import ScamReport from '../models/ScamReport.js';
import { getDbStatus, memoryStore } from '../db.js';

const router = express.Router();

// GET all scam reports
router.get('/', async (req, res) => {
  try {
    if (getDbStatus()) {
      const scams = await ScamReport.find().sort({ upvotes: -1 });
      return res.json(scams);
    } else {
      const sorted = [...memoryStore.scams].sort((a, b) => b.upvotes - a.upvotes);
      return res.json(sorted);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving scam reports' });
  }
});

// POST new scam report
router.post('/', async (req, res) => {
  try {
    const { title, category, area, scammerInfo, description, warningLevel, reportedBy } = req.body;

    if (!title || !area || !description || !scammerInfo) {
      return res.status(400).json({ message: 'Title, area, scammer info, and description are required.' });
    }

    const newScam = {
      id: 'scam-' + Date.now(),
      title,
      category: category || 'other',
      area,
      scammerInfo,
      description,
      warningLevel: warningLevel || 'HIGH',
      upvotes: 1,
      reportedBy: reportedBy || 'Anonymous Scout',
      dateReported: new Date().toISOString().split('T')[0]
    };

    if (getDbStatus()) {
      const created = await ScamReport.create(newScam);
      return res.status(201).json(created);
    } else {
      memoryStore.scams.unshift(newScam);
      return res.status(201).json(newScam);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to post scam report' });
  }
});

// POST upvote scam warning
router.post('/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      let scam = await ScamReport.findOne({ id });
      if (!scam && id.match(/^[0-9a-fA-F]{24}$/)) {
        scam = await ScamReport.findById(id);
      }
      if (!scam) return res.status(404).json({ message: 'Scam report not found' });
      scam.upvotes += 1;
      await scam.save();
      return res.json({ upvotes: scam.upvotes });
    } else {
      const scam = memoryStore.scams.find(item => item.id === id || item._id === id);
      if (!scam) return res.status(404).json({ message: 'Scam report not found' });
      scam.upvotes = (scam.upvotes || 0) + 1;
      return res.json({ upvotes: scam.upvotes });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to upvote scam' });
  }
});

export default router;
