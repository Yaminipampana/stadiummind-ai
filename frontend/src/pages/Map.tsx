// src/pages/Map.tsx
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Mock stadium locations (latitude, longitude)
const stadiums = [
  { name: "Stadium A", lat: 38.8977, lng: -77.0365 }, // Washington DC (example)
  { name: "Stadium B", lat: 34.0522, lng: -118.2437 }, // Los Angeles
  { name: "Stadium C", lat: 51.5074, lng: -0.1278 }, // London
  { name: "Stadium D", lat: 35.6895, lng: 139.6917 }, // Tokyo
];

const Map: React.FC = () => {
  useEffect(() => {
    // Initialize map only once
    const map = L.map("map", {
      center: [20, 0], // Center of the world
      zoom: 2,
      worldCopyJump: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add markers for each mock stadium
    stadiums.forEach((stadium) => {
      L.marker([stadium.lat, stadium.lng])
        .addTo(map)
        .bindPopup(`<b>${stadium.name}</b>`);
    });

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <section className="p-4 bg-fifa-dark min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-fifa-gold">
        Interactive Stadium Map
      </h1>
      <div id="map" className="map-container rounded-lg shadow-lg" />
    </section>
  );
};

export default Map;
