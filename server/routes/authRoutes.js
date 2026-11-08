import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDbStatus, memoryStore } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'campus-scout-super-secret-key-2026';

// Middleware to verify token
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, campus } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getDbStatus()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        campus: campus || 'RV University / Mysore Road',
        savedListings: []
      });

      const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name }, JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          campus: newUser.campus,
          savedListings: newUser.savedListings
        }
      });
    } else {
      // Memory store fallback
      const existing = memoryStore.users.find(u => u.email === normalizedEmail);
      if (existing) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: 'usr-' + Date.now(),
        name,
        email: normalizedEmail,
        password: hashedPassword,
        campus: campus || 'RV University / Mysore Road',
        savedListings: []
      };
      memoryStore.users.push(newUser);

      const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.status(201).json({
        message: 'Account created successfully (Memory/Mock Mode)',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          campus: newUser.campus,
          savedListings: newUser.savedListings
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error during registration', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getDbStatus()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
      }

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.json({
        message: 'Signed in successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          campus: user.campus,
          savedListings: user.savedListings || []
        }
      });
    } else {
      const user = memoryStore.users.find(u => u.email === normalizedEmail);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.json({
        message: 'Signed in successfully (Memory/Mock Mode)',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          campus: user.campus,
          savedListings: user.savedListings || []
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login', error: error.message });
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (getDbStatus()) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json(user);
    } else {
      const user = memoryStore.users.find(u => u.id === req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password, ...safeUser } = user;
      return res.json(safeUser);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user' });
  }
});

// Toggle bookmark
router.post('/bookmark/:id', authMiddleware, async (req, res) => {
  try {
    const listingId = req.params.id;
    if (getDbStatus()) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const idx = user.savedListings.indexOf(listingId);
      if (idx > -1) {
        user.savedListings.splice(idx, 1);
      } else {
        user.savedListings.push(listingId);
      }
      await user.save();
      return res.json({ savedListings: user.savedListings });
    } else {
      const user = memoryStore.users.find(u => u.id === req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (!user.savedListings) user.savedListings = [];
      const idx = user.savedListings.indexOf(listingId);
      if (idx > -1) {
        user.savedListings.splice(idx, 1);
      } else {
        user.savedListings.push(listingId);
      }
      return res.json({ savedListings: user.savedListings });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating bookmark' });
  }
});

export default router;
