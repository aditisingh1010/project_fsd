import express from 'express';
import Listing from '../models/Listing.js';
import { getDbStatus, memoryStore } from '../db.js';

const router = express.Router();

// GET all listings with advanced filters
router.get('/', async (req, res) => {
  try {
    const { category, area, search, verified, maxPrice, sort } = req.query;

    if (getDbStatus()) {
      let query = {};

      if (category && category !== 'all') {
        query.category = category;
      }
      if (area && area !== 'all') {
        query.area = area;
      }
      if (verified === 'true') {
        query.verified = true;
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.price = { $lte: Number(maxPrice) };
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: regex },
          { description: regex },
          { address: regex },
          { honestVerdict: regex },
          { theCatch: regex },
          { amenities: regex }
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price-low') sortOption = { price: 1 };
      else if (sort === 'price-high') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };

      const listings = await Listing.find(query).sort(sortOption);
      return res.json(listings);
    } else {
      // In-Memory filtering
      let results = [...memoryStore.listings];

      if (category && category !== 'all') {
        results = results.filter(item => item.category === category);
      }
      if (area && area !== 'all') {
        results = results.filter(item => item.area.toLowerCase() === area.toLowerCase());
      }
      if (verified === 'true') {
        results = results.filter(item => item.verified);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        results = results.filter(item => item.price <= Number(maxPrice));
      }
      if (search && search.trim()) {
        const term = search.toLowerCase().trim();
        results = results.filter(item =>
          item.title?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.address?.toLowerCase().includes(term) ||
          item.honestVerdict?.toLowerCase().includes(term) ||
          item.theCatch?.toLowerCase().includes(term) ||
          item.amenities?.some(a => a.toLowerCase().includes(term))
        );
      }

      if (sort === 'price-low') {
        results.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        results.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else {
        results.reverse();
      }

      return res.json(results);
    }
  } catch (error) {
    console.error('Fetch listings error:', error);
    res.status(500).json({ message: 'Error retrieving listings', error: error.message });
  }
});

// GET single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      let listing = await Listing.findOne({ id });
      if (!listing && id.match(/^[0-9a-fA-F]{24}$/)) {
        listing = await Listing.findById(id);
      }
      if (!listing) return res.status(404).json({ message: 'Listing not found' });
      return res.json(listing);
    } else {
      const listing = memoryStore.listings.find(item => item.id === id || item._id === id);
      if (!listing) return res.status(404).json({ message: 'Listing not found' });
      return res.json(listing);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving listing details' });
  }
});

// POST create listing
router.post('/', async (req, res) => {
  try {
    const {
      title,
      category,
      type,
      area,
      address,
      price,
      pricePeriod,
      image,
      description,
      honestVerdict,
      theCatch,
      amenities,
      contactPhone,
      whatsapp,
      coordinates
    } = req.body;

    if (!title || !category || !area || !price || !honestVerdict || !theCatch) {
      return res.status(400).json({
        message: 'Missing required listing fields: title, category, area, price, honestVerdict, and theCatch are mandatory.'
      });
    }

    const newListing = {
      id: 'list-' + Date.now(),
      title,
      category,
      type: type || 'Student Hub',
      area,
      address: address || `${area}, Bengaluru`,
      price: Number(price),
      pricePeriod: pricePeriod || 'month',
      rating: 4.5,
      reviewCount: 1,
      verified: false,
      image: image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      description: description || 'Student reviewed community listing.',
      honestVerdict,
      theCatch,
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map(s => s.trim()) : ['Verified Student Pick']),
      contactPhone: contactPhone || '',
      whatsapp: whatsapp || '',
      coordinates: coordinates || { lat: 12.9238, lng: 77.4987 },
      distanceInfo: {
        rvu: 'Walking distance to campus',
        metro: 'Kengeri / Pattanagere route',
        travelTip: 'Contact owner directly and verify physical room'
      },
      reviews: []
    };

    if (getDbStatus()) {
      const created = await Listing.create(newListing);
      return res.status(201).json(created);
    } else {
      memoryStore.listings.unshift(newListing);
      return res.status(201).json(newListing);
    }
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Failed to create listing', error: error.message });
  }
});

// POST add peer review to a listing
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, rating, comment, theCatch } = req.body;

    if (!studentName || !rating || !comment) {
      return res.status(400).json({ message: 'Student name, rating, and comment are required.' });
    }

    const reviewObj = {
      studentName,
      rating: Number(rating),
      comment,
      theCatch: theCatch || 'None reported yet',
      createdAt: new Date()
    };

    if (getDbStatus()) {
      let listing = await Listing.findOne({ id });
      if (!listing && id.match(/^[0-9a-fA-F]{24}$/)) {
        listing = await Listing.findById(id);
      }
      if (!listing) return res.status(404).json({ message: 'Listing not found' });

      listing.reviews.push(reviewObj);
      listing.reviewCount = listing.reviews.length;
      // recalculate rating average
      const total = listing.reviews.reduce((acc, r) => acc + (r.rating || 4.5), 0);
      listing.rating = Number((total / listing.reviews.length).toFixed(1));

      await listing.save();
      return res.status(201).json({ message: 'Review added', reviews: listing.reviews, rating: listing.rating });
    } else {
      const listing = memoryStore.listings.find(item => item.id === id || item._id === id);
      if (!listing) return res.status(404).json({ message: 'Listing not found' });
      if (!listing.reviews) listing.reviews = [];
      listing.reviews.push(reviewObj);
      listing.reviewCount = listing.reviews.length;
      const total = listing.reviews.reduce((acc, r) => acc + (r.rating || 4.5), 0);
      listing.rating = Number((total / listing.reviews.length).toFixed(1));
      return res.status(201).json({ message: 'Review added', reviews: listing.reviews, rating: listing.rating });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review' });
  }
});

export default router;
