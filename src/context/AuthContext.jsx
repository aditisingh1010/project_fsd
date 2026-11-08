import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('cs_token') || null);
  const [savedListings, setSavedListings] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const profile = await api.getCurrentUser();
          if (profile) {
            setUser(profile);
            if (profile.savedListings) {
              setSavedListings(profile.savedListings);
              localStorage.setItem('cs_saved', JSON.stringify(profile.savedListings));
            }
          }
        } catch {
          // Token expired or server unreachable
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('cs_token', res.token);
    localStorage.setItem('cs_user', JSON.stringify(res.user));
    if (res.user.savedListings) {
      setSavedListings(res.user.savedListings);
      localStorage.setItem('cs_saved', JSON.stringify(res.user.savedListings));
    }
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('cs_token', res.token);
    localStorage.setItem('cs_user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
  };

  const toggleSaveListing = async (listingId) => {
    let updated;
    if (savedListings.includes(listingId)) {
      updated = savedListings.filter(id => id !== listingId);
    } else {
      updated = [...savedListings, listingId];
    }
    setSavedListings(updated);
    localStorage.setItem('cs_saved', JSON.stringify(updated));

    if (token) {
      try {
        await api.toggleBookmark(listingId);
      } catch (e) {
        console.warn('Bookmark sync delayed:', e.message);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      savedListings,
      login,
      register,
      logout,
      toggleSaveListing,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
