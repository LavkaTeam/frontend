import { createBrowserRouter } from 'react-router';

import { NotFound } from '@/pages/NotFound';
import { Layout } from '@/Layout';
import { Register } from '@/pages/Register';
import { Cart } from '@/pages/Cart';
import { Product } from '@/pages/Product';
import { Login } from '@/pages/Login';
import { Home } from '@/pages/Home';

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
        path: '/login',
        element: <Login />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/product/:productId',
        element: <Product />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
