import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import './index.css';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Books from './components/Books/Books';

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
        element: (
          <div className='container'>
            <h1>Egzemplarze</h1>
            <p>Wkrótce...</p>
          </div>
        ),
      },
      {
        path: '/czytelnicy',
        element: (
          <div className='container'>
            <h1>Czytelnicy</h1>
            <p>Wkrótce...</p>
          </div>
        ),
      },
      {
        path: '/wypozyczenia',
        element: (
          <div className='container'>
            <h1>Wypożyczenia</h1>
            <p>Wkrótce...</p>
          </div>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
