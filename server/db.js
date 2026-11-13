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

    await syncSeedCatalog();
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

const retiredListingIds = ['list-1', 'list-2', 'list-3', 'list-4', 'list-5', 'list-6', 'list-7', 'list-8'];

async function syncSeedCatalog() {
  try {
    const removed = await Listing.deleteMany({ id: { $in: retiredListingIds } });
    if (removed.deletedCount) {
      console.log(`Removed ${removed.deletedCount} retired seed listings.`);
    }

    for (const item of initialListings) {
      const existing = await Listing.findOne({ id: item.id }).lean();
      if (!existing) {
        await Listing.create({ ...item, reviews: [] });
        continue;
      }
      const keepReviews = (existing.reviewCount || 0) > 0;
      await Listing.updateOne(
        { id: item.id },
        {
          $set: {
            ...item,
            rating: keepReviews ? existing.rating : item.rating,
            reviewCount: keepReviews ? existing.reviewCount : item.reviewCount
          }
        }
      );
    }

    for (const item of initialScams) {
      const existing = await ScamReport.findOne({ id: item.id }).lean();
      if (!existing) {
        await ScamReport.create(item);
        continue;
      }
      const sameWarning = existing.title === item.title;
      await ScamReport.updateOne(
        { id: item.id },
        { $set: sameWarning ? { ...item, upvotes: existing.upvotes } : item }
      );
    }
    console.log('Campus catalog synced.');
  } catch (err) {
    console.error('Error during catalog sync:', err.message);
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
