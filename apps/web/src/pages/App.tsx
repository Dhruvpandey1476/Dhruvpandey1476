import React from 'react';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-green-50">
      <div className="max-w-xl w-full p-8 bg-white rounded-xl shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary" />
          <h1 className="text-2xl font-semibold">ChargeGo</h1>
        </div>
        <p className="text-gray-600 mb-6">On-demand mobile EV charging. Clean, fast, and 100% renewable.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/user" className="px-4 py-3 rounded-xl bg-primary text-white text-center">User</Link>
          <Link to="/provider" className="px-4 py-3 rounded-xl bg-ocean text-white text-center">Provider</Link>
          <Link to="/admin" className="px-4 py-3 rounded-xl bg-gray-900 text-white text-center">Admin</Link>
        </div>
      </div>
      <p className="mt-6 text-xs text-gray-500">100% renewable powered charging</p>
    </div>
  );
}