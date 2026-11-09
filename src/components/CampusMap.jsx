import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Crosshair } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function CampusMap({ listings = [], onSelectListing, userCoordinates = null }) {
  const { isDark } = useTheme();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const tileRef = useRef(null);
  const labelRef = useRef(null);
  const tilePack = {
    light: {
      base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      labels: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
    },
    dark: {
      base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      labels: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
    }
  };
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
      const pack = document.documentElement.classList.contains('dark') ? tilePack.dark : tilePack.light;
      const tiles = L.tileLayer(pack.base, {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 16
      }).addTo(map);
      const labels = L.tileLayer(pack.labels, { maxZoom: 16 }).addTo(map);
      tileRef.current = tiles;
      labelRef.current = labels;

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

  useEffect(() => {
    const pack = isDark ? tilePack.dark : tilePack.light;
    if (tileRef.current) tileRef.current.setUrl(pack.base);
    if (labelRef.current) labelRef.current.setUrl(pack.labels);
  }, [isDark]);

  // Update Markers when listings change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Campus Landmark Marker (RV University)
    const stamp = (label) => L.divIcon({
      className: 'scout-pin',
      html: `<div class="scout-pin-face">${label}</div>`,
      iconSize: [64, 26],
      iconAnchor: [32, 13]
    });
    L.marker([12.9238, 77.4987], { icon: stamp('RVU'), zIndexOffset: 800 }).addTo(markersLayerRef.current)
      .bindPopup("<b>RV University</b>");
    L.marker([12.9206, 77.5016], { icon: stamp('METRO'), zIndexOffset: 700 }).addTo(markersLayerRef.current)
      .bindPopup("<b>Pattanagere Metro</b><br/>Purple Line");

    // Add listing pins
    listings.forEach(item => {
      if (!item.coordinates || !item.coordinates.lat) return;

      const words = { pg: 'PG', food: 'EAT', fix: 'FIX', study: 'STUDY', essentials: 'PRINT' };
      const pinIcon = L.divIcon({
        className: 'scout-pin',
        html: `<div class="scout-pin-face">${words[item.category] || 'PIN'}</div>`,
        iconSize: [52, 26],
        iconAnchor: [26, 13]
      });

      const safe = (value) => String(value ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const popupContent = document.createElement('div');
      popupContent.style.maxWidth = '220px';
      popupContent.innerHTML = `
        <div style="font-family: Segoe UI, system-ui, sans-serif; color: #1a1204;">
          <h4 style="margin: 0; font-family: Impact, sans-serif; font-size: 18px; font-weight: 400;">${safe(item.title)}</h4>
          <p style="margin: 4px 0; font-size: 12px;">${safe(item.area)} · ₹${item.price.toLocaleString('en-IN')}</p>
          <div style="background: #ffe14a; padding: 6px; font-size: 12px; font-weight: 650; margin-bottom: 6px;">${safe(item.theCatch)}</div>
          <button id="view-listing-${item.id || item._id}" style="width: 100%; background: #1a1204; color: #ffe14a; border: none; padding: 6px 8px; font-size: 12px; font-weight: 800; cursor: pointer;">Full details</button>
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
                <div style="width: 16px; height: 16px; background: #ffe14a; border: 2px solid #1a1204;"></div>
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
    <div className="relative w-full h-80 md:h-[28rem] overflow-hidden border-2 border-ink dark:border-yell/40">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Controls */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2">
        <button
          onClick={handleDetectLocation}
          disabled={detectingLoc}
          className="px-3 py-1.5 text-xs font-extrabold bg-yell text-ink border-2 border-ink flex items-center gap-1.5 disabled:opacity-50"
        >
          <Crosshair className={`w-3.5 h-3.5 ${detectingLoc ? 'animate-spin' : ''}`} />
          <span>{detectingLoc ? 'Locating...' : 'Near me'}</span>
        </button>

        <button
          onClick={handleResetToCampus}
          className="px-3 py-1.5 text-xs font-extrabold bg-white text-ink border-2 border-ink"
        >
          Reset to RVU
        </button>
      </div>

      {/* Legend Badge Bottom-Left */}
      <div className="absolute bottom-3 left-3 z-[400] px-3 py-1.5 bg-white text-ink border-2 border-ink text-[10px] font-extrabold hidden sm:block">
        PG · EAT · FIX · STUDY · PRINT · METRO · RVU
      </div>
    </div>
  );
}
