import { createBrowserRouter } from 'react-router';

import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';
import { Layout } from '../Layout';
import { Register } from '../pages/Register';
import { Cart } from '../pages/Cart';

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
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
