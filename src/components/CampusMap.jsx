import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Crosshair } from 'lucide-react';
import { priceLabel } from '../utils/priceLabel.js';

const CAMPUS_POINT = [12.922521, 77.500907];
const MAP_OPEN = [12.92329, 77.49975];
const STREETS = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export default function CampusMap({ listings = [], onSelectListing, userCoordinates = null }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(userCoordinates);
  const [detectingLoc, setDetectingLoc] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MAP_OPEN,
        zoom: 16,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer(STREETS, {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
        className: 'scout-basemap'
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

  const onSelectRef = useRef(onSelectListing);
  onSelectRef.current = onSelectListing;
  const framedRef = useRef(false);

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

    L.marker(CAMPUS_POINT, { icon: pinIcon('RVU'), zIndexOffset: 500 })
      .addTo(layer)
      .bindPopup('<b>RV University</b><br/>Middle of the grounds. The metro pin is the station at the Mysore Road gate.');

    const points = [];
    listings.forEach((item) => {
      if (item.pinned === false) return;
      const lat = Number(item.coordinates?.lat);
      const lng = Number(item.coordinates?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const words = { pg: 'PG', food: 'EAT', fix: 'FIX', study: 'STUDY', essentials: 'PRINT' };
      const label = item.pinLabel || words[item.category] || 'PIN';
      const safe = (value) => String(value ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const priceText = priceLabel(item).main;
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

      L.marker([lat, lng], { icon: pinIcon(label) })
        .addTo(layer)
        .bindPopup(popupContent);
      points.push(L.latLng(lat, lng));
    });

    const frame = requestAnimationFrame(() => {
      map.invalidateSize();
      if (!points.length) return;
      const span = L.latLngBounds(points).getSouthWest().distanceTo(L.latLngBounds(points).getNorthEast());
      let focus = points;
      if (span > 4000) {
        const campus = L.latLng(CAMPUS_POINT);
        const near = [campus];
        points.forEach((point) => {
          if (campus.distanceTo(point) < 1500) near.push(point);
        });
        focus = near;
      }
      const animate = framedRef.current;
      if (focus.length === 1) map.setView(focus[0], 16, { animate });
      else map.fitBounds(L.latLngBounds(focus).pad(0.4), { maxZoom: 16, animate });
      framedRef.current = true;
    });

    return () => {
      cancelAnimationFrame(frame);
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
      mapInstanceRef.current.flyTo(CAMPUS_POINT, 16);
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
