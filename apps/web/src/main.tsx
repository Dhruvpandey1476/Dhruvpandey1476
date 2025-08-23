import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './pages/App';
import Dashboard from './pages/Dashboard';
import Provider from './pages/Provider';
import Admin from './pages/Admin';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/user', element: <Dashboard /> },
  { path: '/provider', element: <Provider /> },
  { path: '/admin', element: <Admin /> }
]);

const root = createRoot(document.getElementById('root')!);
root.render(<RouterProvider router={router} />);