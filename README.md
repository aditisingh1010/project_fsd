# Campus Scout — Student Connections (Bengaluru)

> **The zero-BS peer city guide for college students around Mysore Road, Pattanagere, and Kengeri.**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Express.js-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green.svg)](https://www.mongodb.com/atlas)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet%20%2B%20OpenStreetMap-brightgreen.svg)](https://leafletjs.com/)

---

## 🌟 What is Campus Scout?

College students moving to areas like **Pattanagere**, **Kengeri**, and **RR Nagar** (near RV University, RVCE, PES University, and Global Village Tech Park) get hit with broker markups, hidden maintenance fees, and online deposit scams.

Campus Scout is a peer-driven guide built on **honesty**:
- **Stay**: Verified PGs and flats with direct owner contact (no broker fees).
- **Eat**: Pocket-friendly student meals and canteens.
- **Fix**: Chip-level laptop and phone hardware repair shops.
- **Scam Radar**: Live community ledger flagging QR-code booking scams and deposit deductions.
- **The Catch**: Every single place prominently displays the peer-flagged downside (curfews, slow Wi-Fi peak hours, water pressure).

---

## 🚀 Key Features

1. **Complete Modern UI & Dark Mode**:
   - Modern glassmorphic cards, responsive mobile drawer, and seamless Dark/Light mode toggle.
2. **Live Meteorological & Campus Weather Feed**:
   - Real-time weather at RV University coordinates via Open-Meteo with student commuter advisories.
3. **Interactive Campus Map & GPS Radar**:
   - Interactive Leaflet map with custom markers for PGs, food hubs, tech fix shops, and Metro stations.
   - "Near Me" GPS Geolocation button for proximity discovery.
4. **BMRCL Purple Line & Auto Fare Estimator**:
   - Station-to-station metro transit fare and travel duration calculator (Pattanagere/Kengeri to Majestic/MG Road).
   - Auto-rickshaw pooling cost-per-student calculator.
5. **The Signature "The Catch" Reviews**:
   - Every listing highlights honest student verdicts and downsides.
   - Interactive modal to submit peer reviews.
6. **Community Fraud & Scam Ledger**:
   - Active registry tracking OLX deposit fraud and phantom broker fees with an upvote verification system.
7. **Full-Stack Authentication & Bookmarks**:
   - Express + JWT auth with bcrypt password hashing and saved bookmarks.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS, Lucide Icons, Leaflet.js
- **Backend**: Node.js, Express.js, JWT, bcryptjs, CORS
- **Database**: MongoDB Atlas (with resilient in-memory dual-mode fallback)
- **APIs**: Open-Meteo Meteorology API, BMRCL Purple Line transit engine
- **Deployment**: Netlify (Frontend) + Render (Backend API)

---

## 💻 Quick Start (Local Run)

### 1. Start the Backend API (Port 5000)
```bash
npm run server
```
*Health check available at [http://localhost:5000/api/health](http://localhost:5000/api/health)*

### 2. Start the Frontend Client (Port 5173)
```bash
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 📄 License & Credits

Built for the Full-Stack Web Development Course Project (CS3301). Guaranteed 100% broker-free editorial honesty.
