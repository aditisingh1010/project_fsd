import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Listing from './models/Listing.js';
import ScamReport from './models/ScamReport.js';
import User from './models/User.js';
import { initialListings, initialScams } from './data/seedData.js';

const DEMO_EMAIL = 'scout@rvu.edu.in';
const DEMO_PASSWORD = 'Scout123!';

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
    await ensureDemoUser();
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

async function ensureDemoUser() {
  const existing = await User.findOne({ email: DEMO_EMAIL });
  if (existing) return;

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  await User.create({
    name: 'Demo Scout',
    email: DEMO_EMAIL,
    password: hashedPassword,
    campus: 'RV University / Mysore Road',
    savedListings: [],
    role: 'student'
  });
  console.log('✅ Demo scout account saved in Atlas.');
}
