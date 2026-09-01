# Campus Scout
**Student Connections** — a student city guide for places around campus.

Phase I frontend prototype.  
Domain: Full-Stack Web Application (RV University / Mysore Road pocket, Bengaluru).

---

## What this is

College students moving to areas like Pattanagere, Kengeri, and RR Nagar get hit with broker markup, hidden PG fees, and QR-code deposit scams. Lists live in dead WhatsApp threads.

Campus Scout is a peer guide for:

- **Stay** — PGs, hostels, flats
- **Eat** — cheap meals near campus
- **Fix** — laptop / phone repair
- **More** — print, gyms, essentials

The product idea is honesty: every place should have a short verdict and **the catch** (the downside), not fake 4.9 stars.

This repo is the **UI prototype** for Project Phase I. Backend auth, listings API, and the scam ledger are planned next.

---

## Current status

| Feature | Now | Later |
|---|---|---|
| Landing page (hero, search bar, categories, cards) | Yes | — |
| Sign up / Sign in pages | Yes (demo) | Real JWT auth |
| Search | Visual only | Filter listings |
| Map | Static image | Interactive map |
| Location filters (Pattanagere, Kengeri, RR Nagar…) | Not built | Phase 2 |
| Review blocks with “the catch” | Not built | Phase 2 |
| Scam alert sidebar / ledger | Not built | Phase 2 |
| Database | No | MongoDB / PostgreSQL |

Sign up stores a demo user in `localStorage` and sends you back to the home page. There is no real account system yet.

---

## Tech used in this prototype

- HTML
- CSS
- Vanilla JavaScript
- Google Fonts: Oswald, Manrope, DM Mono

## Planned stack (Phase I document)

- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB or PostgreSQL
- Auth: bcrypt + JWT

---

## How to run

No install. No server.

1. Keep these files in the same folder:
   - `index.html`
   - `signup.html`
   - `styles.css`
   - `script.js`
   - `map-placeholder.png`
2. Open `index.html` in a browser  
   or right-click the folder → Open with Live Server if you use VS Code.

`Sign in` and `Join the community` go to `signup.html`.

---

## File structure

```
campus-scout/
├── index.html              # Home / landing
├── signup.html             # Sign up + sign in
├── styles.css              # Full visual system
├── script.js               # Auth page tabs + demo submit
├── map-placeholder.png     # Static map for the hero
└── README.md
```

---

## Pages

**Home (`index.html`)**
- Hero heading + search bar
- Category cards: Stay, Eat, Fix, More
- Discovery cards
- Food places row
- Community banner
- Footer

**Auth (`signup.html`)**
- Sign up form (default): name, email, campus, password
- Sign in tab: email, password
- Demo save to `localStorage`
- Link back to home

---

## Design

- Paper cream `#f4f1e8`
- Ink `#141412`
- Lime accent `#d9f53a`
- Large Oswald headlines, Manrope body, DM Mono labels
- Mobile: category and card rows scroll sideways

---

## Team note for the presentation

This Phase I demo shows the interface and flow.

- Hero + search exist
- Location filter grid, catch-style review blocks, and scam sidebar are **specified**, not implemented in this UI yet

Suggested line if asked:

> Current build is the frontend prototype. Auth, listings, and the scam ledger are the next phase against the documented 3-tier architecture.

---

## Next build (Phase 2)

1. React pages using this layout
2. Express API: auth, listings, reviews, scam reports
3. Database collections: User, Listing, Review, ScamReport
4. Verified flag + admin workflow
5. Replace the map image with a real map
6. Location chips for Pattanagere, Kengeri, RR Nagar, Banashankari
