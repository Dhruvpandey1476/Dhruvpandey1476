import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { io as socketIO } from 'socket.io-client';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

export default function Dashboard() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
  const [battery, setBattery] = useState<number>(35);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [77.5946, 12.9716],
      zoom: 12
    });

    const socket = socketIO('http://localhost:4000');
    socket.on('van:location:update', (p: { vanId: string; lat: number; lng: number }) => {
      const existing = markersRef.current[p.vanId];
      if (existing) {
        existing.setLngLat([p.lng, p.lat]);
      } else if (mapInstance.current) {
        const m = new mapboxgl.Marker({ color: '#1FBF7A' }).setLngLat([p.lng, p.lat]).addTo(mapInstance.current);
        markersRef.current[p.vanId] = m;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-full" />
          <h2 className="font-semibold">ChargeGo – User</h2>
        </div>
        <div className="text-sm text-gray-500">Green Score: 72</div>
      </header>
      <main className="grid md:grid-cols-[380px,1fr]">
        <div className="p-4 space-y-4">
          <div className="p-4 rounded-xl bg-white shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Battery</div>
                <div className="text-2xl font-semibold">{battery}%</div>
              </div>
              <input type="range" min={1} max={100} value={battery} onChange={(e) => setBattery(Number(e.target.value))} />
            </div>
          </div>
          <button className="w-full py-3 rounded-xl bg-primary text-white">Request Charging</button>
          <button className="w-full py-3 rounded-xl bg-gray-900 text-white">Schedule</button>
          <button className="w-full py-3 rounded-xl bg-ocean text-white">SOS Quick Charge</button>
        </div>
        <div className="relative">
          <div ref={mapRef} className="absolute inset-0" />
        </div>
      </main>
    </div>
  );
}