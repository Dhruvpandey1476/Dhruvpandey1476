import React from 'react';

export default function Admin() {
  return (
    <div className="min-h-screen p-4">
      <header className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">ChargeGo – Admin</h2>
        <div className="text-sm text-gray-500">Demand Index: 1.12x</div>
      </header>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="text-xs text-gray-500">Revenue (7d)</div>
          <div className="text-2xl font-semibold">₹4.2L</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="text-xs text-gray-500">Orders</div>
          <div className="text-2xl font-semibold">1,284</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="text-xs text-gray-500">Users</div>
          <div className="text-2xl font-semibold">9,842</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="text-xs text-gray-500">CO₂ Saved</div>
          <div className="text-2xl font-semibold">21.3 t</div>
        </div>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold mb-3">Fleet Management</h3>
          <div className="space-y-2">
            <div className="p-3 rounded-lg border flex items-center justify-between">
              <div>VAN-001 • 80 kWh</div>
              <button className="px-3 py-2 rounded-lg bg-gray-200">Manage</button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold mb-3">Dynamic Pricing</h3>
          <div className="flex items-center gap-3">
            <input type="range" min={0.8} max={2} step={0.05} defaultValue={1.1} />
            <div className="text-sm text-gray-500">Surge Multiplier</div>
          </div>
        </div>
      </div>
    </div>
  );
}