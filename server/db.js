import mongoose from 'mongoose';
import Listing from './models/Listing.js';
import ScamReport from './models/ScamReport.js';
import { initialListings, initialScams } from './data/seedData.js';

let isMongoConnected = false;

// Fallback in-memory store in case MongoDB Atlas is offline or not yet configured
export const memoryStore = {
  users: [],
  listings: [...initialListings],
  scams: [...initialScams]
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI not provided in .env! Running in resilient Mock-Memory Mode with pre-seeded campus data.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);

    // Auto-seed Atlas if empty
    await seedDatabaseIfEmpty();
    return true;
  } catch (error) {
    console.error(`⚠️ MongoDB Atlas Connection Error: ${error.message}`);
    console.log('🔄 Falling back to in-memory seed store. The API remains fully functional!');
    isMongoConnected = false;
    return false;
  }
};

export const getDbStatus = () => isMongoConnected;

async function seedDatabaseIfEmpty() {
  try {
    const count = await Listing.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial campus listings into MongoDB Atlas...');
      await Listing.insertMany(initialListings);
      console.log('✅ Listings seeded successfully.');
    }

    const scamCount = await ScamReport.countDocuments();
    if (scamCount === 0) {
      console.log('🌱 Seeding initial scam alerts into MongoDB Atlas...');
      await ScamReport.insertMany(initialScams);
      console.log('✅ Scam reports seeded successfully.');
    }
  } catch (err) {
    console.error('Error during auto-seeding:', err.message);
  }
}
