# Campus Scout — React

Vite + React + Tailwind CSS v3 + React Router. Converted from the static
index.html / login.html / signup.html mockup, keeping the exact same
design tokens (colors, spacing, fonts, shadows) as the original script.js
Tailwind config.

## Setup

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Structure

```
src/
  main.jsx             React root + BrowserRouter
  App.jsx               Routes: / , /login , /signup
  index.css              Tailwind directives + your custom classes
                          (.editorial-border, .btn-primary, .sticker-badge, etc.)
  components/
    Header.jsx            Top app bar (shared by Home)
    Footer.jsx              Site footer (shared by Home)
    BottomNav.jsx             Mobile bottom nav (shared by Home)
  pages/
    Home.jsx                 Landing page (hero, areas, picks, methodology, traps)
    Login.jsx                  Sign-in screen
    Signup.jsx                   Create-account screen

tailwind.config.js       Full design system extracted from the original script.js
                          (colors, spacing, fontFamily, fontSize, boxShadow)
```

## Routing

- /        -> Home
- /login   -> Login
- /signup  -> Signup

Internal links use React Router's <Link> so navigation doesn't reload the
page. External/placeholder links (#) are left as plain <a> tags -- wire
those up to real routes or handlers as you build out more screens.

## Notes / next steps

- Forms (Login.jsx, Signup.jsx) currently just preventDefault() on
  submit -- no backend wired up. Hook them up to your auth API/service.
- Images still point at the original external URLs
  (lh3.googleusercontent.com) -- swap in your own assets under src/assets
  or public/ when ready.
- Material Symbols icons render via the Google Font ligature technique (the
  span's text content, e.g. location_on, is the icon) -- same as the
  original HTML.
- Build for production: npm run build -> outputs to dist/.
