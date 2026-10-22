import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/Layout';
import { Loader } from '@/components/ui/Loader';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';

const Home = lazy(() => import('@/pages/Home'));
const Register = lazy(() => import('@/pages/Register'));
const Login = lazy(() => import('@/pages/Login'));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Account = lazy(() => import('@/pages/Account'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const MockPayment = lazy(() => import('@/pages/MockPayment'));
const OrderDetails = lazy(() => import('@/pages/OrderDetails'));
const PaymentCancelled = lazy(() => import('@/pages/PaymentCancelled'));
const PaymentFailed = lazy(() => import('@/pages/PaymentFailed'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const Product = lazy(() => import('@/pages/Product'));
const Products = lazy(() => import('@/pages/Products'));
const SellerProductsPublic = lazy(() => import('@/pages/SellerProductsPublic'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin panel (role ADMIN only).
const AdminLayout = lazy(() => import('@/features/admin/shell/AdminLayout'));
const AdminDashboard = lazy(
  () => import('@/features/admin/dashboard/AdminDashboard'),
);
const AdminUsers = lazy(() => import('@/features/admin/users/AdminUsers'));
const AdminUserDetails = lazy(
  () => import('@/features/admin/users/AdminUserDetails'),
);
const AdminPayouts = lazy(() => import('@/features/admin/payouts/AdminPayouts'));
const AdminOrders = lazy(() => import('@/features/admin/orders/AdminOrders'));
const AdminOrderDetails = lazy(
  () => import('@/features/admin/orders/AdminOrderDetails'),
);
const AdminProducts = lazy(
  () => import('@/features/admin/products/AdminProducts'),
);
const AdminAudit = lazy(() => import('@/features/admin/audit/AdminAudit'));

// Dev-only screen previews at /dev/auth, open on localhost only.
// `import.meta.env.DEV` is false in production builds, so there the route and
// its chunk are dropped entirely; the hostname check also hides it on a dev
// server reachable from the network.
const isLocalDev =
  import.meta.env.DEV &&
  ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
const DevAuthPreview = isLocalDev
  ? lazy(() => import('@/pages/DevAuthPreview'))
  : null;
const devRoutes = DevAuthPreview
  ? [
      {
        path: '/dev/auth',
        element: (
          <Suspense fallback={<Loader />}>
            <DevAuthPreview />
          </Suspense>
        ),
      },
    ]
  : [];

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
        path: '/verify-email',
        element: (
          <Suspense fallback={<Loader />}>
            <VerifyEmail />
          </Suspense>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <Suspense fallback={<Loader />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: '/reset-password',
        element: (
          <Suspense fallback={<Loader />}>
            <ResetPassword />
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
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Suspense fallback={<Loader />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        ),
        // AdminLayout wraps each section in its own Suspense.
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'users/:userId', element: <AdminUserDetails /> },
          { path: 'payouts', element: <AdminPayouts /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'orders/:orderId', element: <AdminOrderDetails /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'audit', element: <AdminAudit /> },
        ],
      },
      {
        path: '/cart',
        element: (
          <Suspense fallback={<Loader />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute allowedRoles={['SELLER', 'BUYER']}>
            <Suspense fallback={<Loader />}>
              <Checkout />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/mock-payment/:batchId',
        element: (
          <ProtectedRoute allowedRoles={['SELLER', 'BUYER']}>
            <Suspense fallback={<Loader />}>
              <MockPayment />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/payment/success',
        element: (
          <ProtectedRoute allowedRoles={['SELLER', 'BUYER']}>
            <Suspense fallback={<Loader />}>
              <PaymentSuccess />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/payment/failed',
        element: (
          <ProtectedRoute allowedRoles={['SELLER', 'BUYER']}>
            <Suspense fallback={<Loader />}>
              <PaymentFailed />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/payment/cancel',
        element: (
          <ProtectedRoute allowedRoles={['SELLER', 'BUYER']}>
            <Suspense fallback={<Loader />}>
              <PaymentCancelled />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders/:orderId',
        element: (
          <ProtectedRoute allowedRoles={['SELLER', 'BUYER']}>
            <Suspense fallback={<Loader />}>
              <OrderDetails />
            </Suspense>
          </ProtectedRoute>
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
        path: '/sellerProducts/:sellerId',
        element: (
          <Suspense fallback={<Loader />}>
            <SellerProductsPublic />
          </Suspense>
        ),
      },
      ...devRoutes,
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
