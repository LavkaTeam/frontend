import { createBrowserRouter } from 'react-router';

import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';
import { Layout } from '../layout';
import { Register } from '../pages/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
