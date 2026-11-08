import express from 'express';

const router = express.Router();

// BMRCL Purple Line Stations around campus
const purpleLineStations = [
  { name: 'Challaghatta', distanceKm: 0, fromRVU: '2.5 km', travelMins: 5 },
  { name: 'Kengeri Bus Terminal', distanceKm: 1.5, fromRVU: '1.2 km', travelMins: 3 },
  { name: 'Kengeri', distanceKm: 2.7, fromRVU: '1.0 km', travelMins: 0 },
  { name: 'Pattanagere', distanceKm: 4.1, fromRVU: '450m (Closest to RVU)', travelMins: 2 },
  { name: 'Jnanabharathi (Bangalore University)', distanceKm: 5.6, fromRVU: '1.8 km', travelMins: 5 },
  { name: 'Rajarajeshwari Nagar', distanceKm: 6.8, fromRVU: '3.0 km', travelMins: 7 },
  { name: 'Nayandahalli', distanceKm: 8.2, fromRVU: '4.5 km', travelMins: 9 },
  { name: 'Mysuru Road', distanceKm: 9.5, fromRVU: '6.0 km', travelMins: 12 },
  { name: 'Nadaprabhu Kempegowda Stn (Majestic)', distanceKm: 16.5, fromRVU: '14 km', travelMins: 24 },
  { name: 'MG Road', distanceKm: 21.0, fromRVU: '18 km', travelMins: 32 }
];

// Fare Calculation: BMRCL fare slabs
const calculateMetroFare = (startStation, destStation) => {
  const start = purpleLineStations.find(s => s.name.toLowerCase() === startStation.toLowerCase());
  const dest = purpleLineStations.find(s => s.name.toLowerCase() === destStation.toLowerCase());

  if (!start || !dest) {
    return { fare: 25, tokenFare: 30, discount: '5% with Smart Card / NCMC' };
  }

  const dist = Math.abs(dest.distanceKm - start.distanceKm);
  let fare = 10;
  if (dist > 15) fare = 45;
  else if (dist > 10) fare = 35;
  else if (dist > 5) fare = 25;
  else if (dist > 2) fare = 18;
  else fare = 10;

  return {
    from: start.name,
    to: dest.name,
    distanceKm: dist.toFixed(1),
    tokenFare: fare,
    smartCardFare: Math.round(fare * 0.95),
    estimatedTravelTime: `${Math.round(dist * 1.8 + 4)} mins`
  };
};

// Auto Fare Calculator (Bengaluru Traffic Police Tariff)
// Base fare: ₹30 for first 2 km, then ₹15 per additional km
const calculateAutoFare = (distanceKm, sharedPassCount = 1) => {
  const dist = Math.max(0.5, Number(distanceKm) || 1);
  let fare = 30;
  if (dist > 2) {
    fare += (dist - 2) * 15;
  }
  const perPerson = Math.ceil(fare / Math.max(1, Number(sharedPassCount)));

  return {
    distanceKm: dist,
    totalAutoFare: Math.round(fare),
    passengerCount: sharedPassCount,
    perPersonCost: perPerson,
    studentTip: sharedPassCount > 1 ? `Shared ride saves ₹${fare - perPerson} per person!` : 'Tip: Ask meter before boarding near campus gate'
  };
};

router.get('/metro', (req, res) => {
  const { from = 'Pattanagere', to = 'Nadaprabhu Kempegowda Stn (Majestic)' } = req.query;
  const fareResult = calculateMetroFare(from, to);
  res.json({
    stations: purpleLineStations,
    lookup: fareResult
  });
});

router.get('/auto-fare', (req, res) => {
  const { distance = 2.5, shared = 3 } = req.query;
  const result = calculateAutoFare(distance, shared);
  res.json(result);
});

export default router;
