import { initialListings, initialScams } from '../../server/data/seedData.js';
import { compareQuotedPrice } from '../utils/priceLabel.js';

// Base API configuration (Netlify / Render environment variable support)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper for fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Auth Headers helper
function getAuthHeaders() {
  const token = localStorage.getItem('cs_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Check backend health
  async checkHealth() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/health`, {}, 3000);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (e) {
      return { status: 'fallback', database: 'Local Mode' };
    }
  },

  // Listings API
  async getListings(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.area && params.area !== 'all') query.append('area', params.area);
    if (params.search) query.append('search', params.search);
    if (params.verified) query.append('verified', 'true');
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.sort) query.append('sort', params.sort);

    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/listings?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch listings from backend');
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, using rich local dataset:', err.message);
      // Client-side fallback
      let filtered = [...initialListings];
      if (params.category && params.category !== 'all') {
        filtered = filtered.filter(i => i.category === params.category);
      }
      if (params.area && params.area !== 'all') {
        filtered = filtered.filter(i => i.area.toLowerCase() === params.area.toLowerCase());
      }
      if (params.verified) {
        filtered = filtered.filter(i => i.verified);
      }
      if (params.maxPrice) {
        filtered = filtered.filter(i => i.price <= Number(params.maxPrice));
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(i =>
          i.title.toLowerCase().includes(s) ||
          i.description.toLowerCase().includes(s) ||
          i.theCatch.toLowerCase().includes(s) ||
          i.honestVerdict.toLowerCase().includes(s)
        );
      }
      if (params.sort === 'price-low') filtered.sort((a, b) => compareQuotedPrice(a, b, 1));
      else if (params.sort === 'price-high') filtered.sort((a, b) => compareQuotedPrice(a, b, -1));
      else if (params.sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      return filtered;
    }
  },

  async getListingById(id) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/listings/${id}`);
      if (!res.ok) throw new Error('Listing not found');
      return await res.json();
    } catch (e) {
      return initialListings.find(l => l.id === id) || null;
    }
  },

  async createListing(listingData) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/listings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(listingData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create listing');
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend error, creating locally:', err.message);
      const newLocal = {
        ...listingData,
        id: 'local-' + Date.now(),
        rating: 0,
        reviewCount: 0,
        verified: false,
        reviews: []
      };
      initialListings.unshift(newLocal);
      return newLocal;
    }
  },

  async addReview(listingId, reviewData) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/listings/${listingId}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });
      if (!res.ok) throw new Error('Failed to post review');
      return await res.json();
    } catch (err) {
      return {
        message: 'Review recorded',
        reviews: [
          { ...reviewData, createdAt: new Date() }
        ],
        rating: Number(reviewData.rating) || 0
      };
    }
  },

  // Scams API
  async getScams() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/scams`);
      if (!res.ok) throw new Error('Failed to fetch scams');
      return await res.json();
    } catch (err) {
      return initialScams;
    }
  },

  async createScam(scamData) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/scams`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(scamData)
      });
      if (!res.ok) throw new Error('Failed to report scam');
      return await res.json();
    } catch (err) {
      const localScam = {
        ...scamData,
        id: 'scam-local-' + Date.now(),
        upvotes: 1,
        dateReported: new Date().toISOString().split('T')[0]
      };
      initialScams.unshift(localScam);
      return localScam;
    }
  },

  async upvoteScam(scamId) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/scams/${scamId}/upvote`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to upvote');
      return await res.json();
    } catch (err) {
      const scam = initialScams.find(s => s.id === scamId);
      if (scam) scam.upvotes = (scam.upvotes || 0) + 1;
      return { upvotes: scam ? scam.upvotes : 1 };
    }
  },

  // Live Weather API
  async getWeather(lat = 12.9238, lng = 77.4987) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/weather?lat=${lat}&lng=${lng}`);
      if (!res.ok) throw new Error('Weather API failed');
      return await res.json();
    } catch (e) {
      // Direct browser fallback from Open-Meteo
      try {
        const direct = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`);
        const json = await direct.json();
        return {
          location: 'Mysore Road / Kengeri Campus Pocket',
          campusHub: 'RV University & Global Village Tech Park',
          temperature: Math.round(json.current.temperature_2m),
          feelsLike: Math.round(json.current.apparent_temperature),
          humidity: json.current.relative_humidity_2m,
          windSpeed: json.current.wind_speed_10m,
          condition: 'Partly Cloudy',
          iconType: 'CloudSun',
          studentAdvisory: 'Pleasant temperature. Great time for walking between lectures.',
          updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          source: 'direct-client'
        };
      } catch (err) {
        return {
          location: 'Mysore Road Campus Pocket',
          temperature: 25,
          feelsLike: 26,
          humidity: 65,
          condition: 'Clear Sky',
          iconType: 'Sun',
          studentAdvisory: 'Sunny weather around RV University and Kengeri.',
          updatedAt: 'Just now'
        };
      }
    }
  },

  // Transit & Fare API
  async getMetroInfo(from = 'Pattanagere', to = 'Nadaprabhu Kempegowda Stn (Majestic)') {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/transit/metro?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      if (!res.ok) throw new Error('Transit API failed');
      return await res.json();
    } catch (e) {
      return {
        stations: [
          { name: 'Challaghatta', distanceKm: 0 },
          { name: 'Kengeri Bus Terminal', distanceKm: 1.5 },
          { name: 'Kengeri', distanceKm: 2.7 },
          { name: 'Pattanagere', distanceKm: 4.1 },
          { name: 'Jnanabharathi (Bangalore University)', distanceKm: 5.6 },
          { name: 'Rajarajeshwari Nagar', distanceKm: 6.8 },
          { name: 'Mysuru Road', distanceKm: 9.5 },
          { name: 'Nadaprabhu Kempegowda Stn (Majestic)', distanceKm: 16.5 },
          { name: 'MG Road', distanceKm: 21.0 }
        ],
        lookup: {
          from,
          to,
          distanceKm: '12.4',
          tokenFare: 35,
          smartCardFare: 33,
          estimatedTravelTime: '26 mins'
        }
      };
    }
  },

  async getAutoFare(distance = 2.5, shared = 3) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/transit/auto-fare?distance=${distance}&shared=${shared}`);
      if (!res.ok) throw new Error('Auto fare failed');
      return await res.json();
    } catch (e) {
      const base = 30 + Math.max(0, distance - 2) * 15;
      return {
        distanceKm: distance,
        totalAutoFare: Math.round(base),
        passengerCount: shared,
        perPersonCost: Math.ceil(base / shared),
        studentTip: 'Standard meter rate: ₹30 for first 2 km, then ₹15/km.'
      };
    }
  },

  // Auth API
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('cs_token');
    if (!token) return null;
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }, 3000);
      if (!res.ok) throw new Error('Unauthorized');
      return await res.json();
    } catch (e) {
      const savedUser = localStorage.getItem('cs_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
  },

  async toggleBookmark(listingId) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/auth/bookmark/${listingId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Bookmark toggle failed');
      return await res.json();
    } catch (e) {
      // Local fallback
      const saved = JSON.parse(localStorage.getItem('cs_saved') || '[]');
      const idx = saved.indexOf(listingId);
      if (idx > -1) saved.splice(idx, 1);
      else saved.push(listingId);
      localStorage.setItem('cs_saved', JSON.stringify(saved));
      return { savedListings: saved };
    }
  }
};
