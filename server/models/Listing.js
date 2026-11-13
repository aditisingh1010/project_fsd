import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['pg', 'food', 'fix', 'study', 'essentials'], required: true },
  type: { type: String, default: 'General' },
  area: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  pricePeriod: { type: String, default: 'month' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  pinned: { type: Boolean, default: true },
  pinLabel: { type: String, default: '' },
  image: { type: String, required: true },
  description: { type: String, required: true },
  honestVerdict: { type: String, required: true },
  theCatch: { type: String, required: true },
  amenities: [{ type: String }],
  contactPhone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, default: 12.9238 },
    lng: { type: Number, default: 77.4987 }
  },
  distanceInfo: {
    rvu: { type: String, default: '500m • 5 min walk' },
    metro: { type: String, default: 'Nearby Metro' },
    travelTip: { type: String, default: '' }
  },
  reviews: [{
    studentName: String,
    rating: Number,
    comment: String,
    theCatch: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
export default Listing;
