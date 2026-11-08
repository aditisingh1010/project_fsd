import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Crosshair, Layers, Star, AlertTriangle } from 'lucide-react';

export default function CampusMap({ listings = [], onSelectListing, userCoordinates = null }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(userCoordinates);
  const [detectingLoc, setDetectingLoc] = useState(false);

  // RV University / Mysore Road coordinates
  const defaultCenter = [12.9238, 77.4987];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 14,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Markers Layer Group
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when listings change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Campus Landmark Marker (RV University)
    const rvuIcon = L.divIcon({
      className: 'custom-rvu-marker',
      html: `
        <div style="background-color: #4f46e5; color: white; padding: 6px 10px; border-radius: 9999px; font-weight: 800; font-size: 11px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4); display: flex; align-items: center; gap: 4px; border: 2px solid white; white-space: nowrap;">
          🎓 RV University
        </div>
      `,
      iconSize: [110, 30],
      iconAnchor: [55, 15]
    });
    L.marker([12.9238, 77.4987], { icon: rvuIcon }).addTo(markersLayerRef.current)
      .bindPopup("<b>RV University Campus</b><br/>Central Hub for Student Connections");

    // Metro Marker
    const metroIcon = L.divIcon({
      className: 'custom-metro-marker',
      html: `
        <div style="background-color: #7c3aed; color: white; padding: 5px 8px; border-radius: 9999px; font-weight: bold; font-size: 10px; box-shadow: 0 2px 8px rgba(124, 58, 237, 0.4); display: flex; align-items: center; gap: 3px; border: 2px solid white; white-space: nowrap;">
          🚇 Pattanagere Metro
        </div>
      `,
      iconSize: [120, 26],
      iconAnchor: [60, 13]
    });
    L.marker([12.9255, 77.4998], { icon: metroIcon }).addTo(markersLayerRef.current)
      .bindPopup("<b>Pattanagere Metro Station</b><br/>BMRCL Purple Line (450m from RVU)");

    // Add listing pins
    listings.forEach(item => {
      if (!item.coordinates || !item.coordinates.lat) return;

      const markerColor = item.category === 'food' ? '#f97316' : (item.category === 'fix' ? '#06b6d4' : '#6366f1');
      const categoryEmoji = item.category === 'food' ? '🍲' : (item.category === 'fix' ? '🔧' : '🏠');

      const pinIcon = L.divIcon({
        className: 'custom-listing-pin',
        html: `
          <div style="background-color: ${markerColor}; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.25); cursor: pointer; transition: transform 0.2s;">
            ${categoryEmoji}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const popupContent = document.createElement('div');
      popupContent.style.maxWidth = '220px';
      popupContent.innerHTML = `
        <div style="font-family: system-ui, sans-serif; padding: 2px;">
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">${item.title}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">${item.area} • ₹${item.price.toLocaleString('en-IN')}/${item.pricePeriod}</p>
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 5px; font-size: 10px; color: #92400e; margin-bottom: 6px;">
            <b>The Catch:</b> ${item.theCatch.substring(0, 75)}...
          </div>
          <button id="view-listing-${item.id || item._id}" style="width: 100%; background: #4f46e5; color: white; border: none; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
            View Honest Details
          </button>
        </div>
      `;

      const marker = L.marker([item.coordinates.lat, item.coordinates.lng], { icon: pinIcon })
        .addTo(markersLayerRef.current)
        .bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-listing-${item.id || item._id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectListing) onSelectListing(item);
          };
        }
      });
    });
  }, [listings, onSelectListing]);

  // Geolocation detector
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setDetectingLoc(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 15);

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const userIcon = L.divIcon({
              className: 'user-location-pin',
              html: `
                <div style="position: relative; width: 20px; height: 20px;">
                  <div style="position: absolute; width: 20px; height: 20px; background: rgba(59, 130, 246, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                  <div style="position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; background: #2563eb; border: 2px solid white; border-radius: 50%;"></div>
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup("<b>You are here!</b><br/>Showing nearest student picks")
              .openPopup();
          }
        }
      },
      (err) => {
        setDetectingLoc(false);
        alert('Could not access current location. Showing campus area.');
      },
      { timeout: 8000 }
    );
  };

  const handleResetToCampus = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(defaultCenter, 14);
    }
  };

  return (
    <div className="relative w-full h-80 md:h-96 rounded-3xl overflow-hidden glass-card shadow-card border border-slate-200/80 dark:border-slate-700/80">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Controls */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2">
        <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-md backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
          <span>Interactive Campus Radar</span>
        </div>

        <button
          onClick={handleDetectLocation}
          disabled={detectingLoc}
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
          title="Find places near my GPS position"
        >
          <Crosshair className={`w-3.5 h-3.5 ${detectingLoc ? 'animate-spin' : ''}`} />
          <span>{detectingLoc ? 'Locating...' : 'Near Me'}</span>
        </button>

        <button
          onClick={handleResetToCampus}
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 shadow-md hover:bg-slate-100 transition-all"
        >
          Reset to RVU
        </button>
      </div>

      {/* Legend Badge Bottom-Left */}
      <div className="absolute bottom-3 left-3 z-[400] px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md border border-slate-200/60 dark:border-slate-700/60 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hidden sm:flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> PG
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Food
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Fix
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Metro
        </span>
      </div>
    </div>
  );
}
