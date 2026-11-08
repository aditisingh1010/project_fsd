import express from 'express';

const router = express.Router();

// WMO weather code translation
const weatherCodeMap = {
  0: { label: 'Clear Sky', icon: 'Sun', advisory: 'Great weather to walk or cycle to campus.' },
  1: { label: 'Mainly Clear', icon: 'Sun', advisory: 'Pleasant morning ahead. High visibility.' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', advisory: 'Mild breeze across Mysore Road pocket.' },
  3: { label: 'Overcast', icon: 'Cloud', advisory: 'Cloudy skies. Good time for outdoor chai breaks.' },
  45: { label: 'Foggy Morning', icon: 'CloudFog', advisory: 'Low visibility on NICE Road / Mysore Road.' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', advisory: 'Brisk cool air.' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', advisory: 'Carry a windbreaker or light umbrella.' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', advisory: 'Roads may be slick near Kengeri bus stop.' },
  61: { label: 'Slight Rain', icon: 'CloudRain', advisory: 'Keep your laptop in a waterproof bag.' },
  63: { label: 'Moderate Rain', icon: 'CloudRain', advisory: 'Metro commute strongly recommended over bikes.' },
  65: { label: 'Heavy Rain', icon: 'CloudRain', advisory: 'Waterlogging alert near Pattanagere underpass!' },
  80: { label: 'Rain Showers', icon: 'CloudRain', advisory: 'Passing showers expected around noon.' },
  95: { label: 'Thunderstorm', icon: 'Zap', advisory: 'Stay indoors; avoid standing under trees on campus.' }
};

// In-memory cache for 10 minutes
let cachedWeather = null;
let lastFetchTime = 0;

router.get('/', async (req, res) => {
  const now = Date.now();
  if (cachedWeather && (now - lastFetchTime < 10 * 60 * 1000)) {
    return res.json({ ...cachedWeather, source: 'cache' });
  }

  // RV University / Kengeri / Mysore Road Coordinates: 12.9238° N, 77.4987° E
  const lat = req.query.lat || 12.9238;
  const lng = req.query.lng || 77.4987;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;
    
    const response = await fetch(url, { headers: { 'User-Agent': 'CampusScout/2.0' } });
    if (!response.ok) {
      throw new Error(`Weather API returned status: ${response.status}`);
    }
    const data = await response.json();
    const current = data.current;

    const codeInfo = weatherCodeMap[current.weather_code] || {
      label: 'Pleasant',
      icon: 'CloudSun',
      advisory: 'Moderate Bengaluru weather around campus.'
    };

    const weatherPayload = {
      location: 'Mysore Road / Kengeri Campus Pocket',
      campusHub: 'RV University & Global Village Tech Park',
      coordinates: { lat: Number(lat), lng: Number(lng) },
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      precipitation: current.precipitation,
      condition: codeInfo.label,
      iconType: codeInfo.icon,
      studentAdvisory: codeInfo.advisory,
      isDay: current.is_day === 1,
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    cachedWeather = weatherPayload;
    lastFetchTime = now;

    return res.json({ ...weatherPayload, source: 'live' });
  } catch (error) {
    console.warn('Weather live fetch failed, serving fallback:', error.message);
    // Reliable fallback Bengaluru weather
    const fallback = {
      location: 'Mysore Road / Kengeri Campus Pocket',
      campusHub: 'RV University & Global Village Tech Park',
      coordinates: { lat: 12.9238, lng: 77.4987 },
      temperature: 26,
      feelsLike: 27,
      humidity: 58,
      windSpeed: 12,
      precipitation: 0,
      condition: 'Partly Cloudy',
      iconType: 'CloudSun',
      studentAdvisory: 'Pleasant breeze. Excellent weather for walking to classes.',
      isDay: true,
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      source: 'offline-fallback'
    };
    return res.json(fallback);
  }
});

export default router;
