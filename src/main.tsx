import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from 'virtual:generated-pages-react';
import Layout from './components/layout';
import './index.css';

// Function to process routes and handle nested paths
const processRoutes = (routes: any[]) => {
  return routes.map(route => {
    // Add Layout to all routes
    return {
      ...route,
      element: <Layout>{route.element}</Layout>
    };
  });
};

const router = createBrowserRouter(processRoutes(routes), {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
