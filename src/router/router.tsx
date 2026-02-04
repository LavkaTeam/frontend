import { createBrowserRouter } from 'react-router';
import { Layout } from '@/Layout';
import { Loader } from '@/components/ui/Loader';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';

const Home = lazy(() => import('@/pages/Home'));
const Register = lazy(() => import('@/pages/Register'));
const Login = lazy(() => import('@/pages/Login'));
const Account = lazy(() => import('@/pages/Account'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Cart = lazy(() => import('@/pages/Cart'));
const Product = lazy(() => import('@/pages/Product'));
const Products = lazy(() => import('@/pages/Products'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<Loader />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: '/account',
        element: (
          <ProtectedRoute allowedRoles={['SELLER', 'BUYER']}>
            <Suspense fallback={<Loader />}>
              <Account />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      // {
      //   path: '/admin',
      //   element: (
      //     <ProtectedRoute allowedRoles={['admin']}>
      //       <Suspense fallback={<Loader />}>
      //         Адмін-панель
      //       </Suspense>
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: '/cart',
        element: (
          <Suspense fallback={<Loader />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: '/favorites',
        element: (
          <Suspense fallback={<Loader />}>
            <Favorites />
          </Suspense>
        ),
      },
      {
        path: '/product/:productId',
        element: (
          <Suspense fallback={<Loader />}>
            <Product />
          </Suspense>
        ),
      },
      {
        path: '/products',
        element: (
          <Suspense fallback={<Loader />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: '/products/:category',
        element: (
          <Suspense fallback={<Loader />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: '/products/:category/:subcategory',
        element: (
          <Suspense fallback={<Loader />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Loader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);
