import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import './index.css';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Books from './components/Books/Books';
import Copies from './components/Copies/Copies';
import Readers from './components/Readers/Readers';
import Loans from './components/Loans/Loans';
import Libraries from './components/Libraries/Libraries';
import Workers from './components/Workers/Workers';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/ksiazki',
        element: <Books />,
      },
      {
        path: '/egzemplarze',
        element: <Copies />,
      },
      {
        path: '/czytelnicy',
        element: <Readers />,
      },
      {
        path: '/wypozyczenia',
        element: <Loans />,
      },
      {
        path: '/biblioteki',
        element: <Libraries />,
      },
      {
        path: '/pracownicy',
        element: <Workers />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
