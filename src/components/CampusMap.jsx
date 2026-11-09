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

  const onSelectRef = useRef(onSelectListing);
  onSelectRef.current = onSelectListing;

  // Update Markers when listings change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const pinIcon = (label) => {
      const width = Math.max(40, label.length * 8 + 14);
      const height = 28;
      return L.divIcon({
        className: 'scout-pin',
        html: `<div class="scout-pin-face">${label}</div>`,
        iconSize: [width, height],
        iconAnchor: [width / 2, height]
      });
    };

    const entries = [];
    const addPin = (latlng, label, marker) => {
      marker.addTo(layer);
      entries.push({ marker, latlng: L.latLng(latlng) });
    };

    addPin(
      [12.9238, 77.4987],
      'RVU',
      L.marker([12.9238, 77.4987], { icon: pinIcon('RVU'), zIndexOffset: 500 }).bindPopup('<b>RV University</b>')
    );
    addPin(
      [12.9206, 77.5016],
      'METRO',
      L.marker([12.9206, 77.5016], { icon: pinIcon('METRO'), zIndexOffset: 480 }).bindPopup('<b>Pattanagere Metro</b><br/>Purple Line')
    );

    listings.forEach((item) => {
      const lat = Number(item.coordinates?.lat);
      const lng = Number(item.coordinates?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const words = { pg: 'PG', food: 'EAT', fix: 'FIX', study: 'STUDY', essentials: 'PRINT' };
      const label = words[item.category] || 'PIN';
      const safe = (value) => String(value ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const price = Number(item.price);
      const priceText = Number.isFinite(price) ? `₹${price.toLocaleString('en-IN')}` : '';
      const popupContent = document.createElement('div');
      popupContent.style.maxWidth = '220px';
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Full details';
      button.style.cssText = 'width:100%;background:#1a1204;color:#ffe14a;border:none;padding:6px 8px;font-size:12px;font-weight:800;cursor:pointer;';
      button.onclick = () => onSelectRef.current?.(item);
      popupContent.innerHTML = `
        <div style="font-family: Segoe UI, system-ui, sans-serif; color: #1a1204;">
          <h4 style="margin: 0; font-family: Impact, sans-serif; font-size: 18px; font-weight: 400;">${safe(item.title)}</h4>
          <p style="margin: 4px 0; font-size: 12px;">${safe(item.area)}${priceText ? ` · ${priceText}` : ''}</p>
          <div style="background: #ffe14a; padding: 6px; font-size: 12px; font-weight: 650; margin-bottom: 6px;">${safe(item.theCatch)}</div>
        </div>
      `;
      popupContent.querySelector('div').appendChild(button);

      addPin(
        [lat, lng],
        label,
        L.marker([lat, lng], { icon: pinIcon(label) }).bindPopup(popupContent)
      );
    });

    const layout = () => {
      const placed = [];
      const gap = 48;
      entries.forEach((entry) => {
        const origin = map.latLngToLayerPoint(entry.latlng);
        let point = origin;
        let i = 0;
        while (placed.some((p) => Math.hypot(p.x - point.x, p.y - point.y) < gap) && i < 20) {
          const ring = Math.floor(i / 8) + 1;
          const angle = (i * Math.PI) / 4;
          point = L.point(
            origin.x + Math.cos(angle) * gap * ring * 0.85,
            origin.y + Math.sin(angle) * gap * ring * 0.85
          );
          i += 1;
        }
        placed.push(point);
        entry.marker.setLatLng(map.layerPointToLatLng(point));
      });
    };

    layout();
    map.on('zoomend', layout);
    map.on('resize', layout);
    const frame = requestAnimationFrame(() => {
      map.invalidateSize();
      layout();
    });

    return () => {
      cancelAnimationFrame(frame);
      map.off('zoomend', layout);
      map.off('resize', layout);
      layer.clearLayers();
    };
  }, [listings]);

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
              html: '<div class="you-pin"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8]
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
