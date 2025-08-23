import React from 'react';

export default function Provider() {
  return (
    <div className="min-h-screen p-4">
      <header className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">ChargeGo – Provider</h2>
        <div className="text-sm text-gray-500">Earnings: ₹2,430 today</div>
      </header>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold mb-3">Nearby Requests</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border flex items-center justify-between">
              <div>
                <div className="font-medium">Booking #1234</div>
                <div className="text-xs text-gray-500">2.4 km • DC • 45 min</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-primary text-white">Accept</button>
                <button className="px-3 py-2 rounded-lg bg-gray-200">Reject</button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold mb-3">Inventory</h3>
          <div className="text-sm">Available: 45/80 kWh</div>
          <div className="mt-2 h-2 rounded bg-gray-100">
            <div className="h-2 rounded bg-primary" style={{ width: '56%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}