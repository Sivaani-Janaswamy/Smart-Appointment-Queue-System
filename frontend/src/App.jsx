import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';


// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';

// Pages
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import JoinQueue from './pages/JoinQueue';
import TokenStatus from './pages/TokenStatus';
import Scanner from './pages/Scanner';
import NotFound from './pages/NotFound';

// --- New Components for Routing ---

// Redirects from the root path based on auth status
const RootRedirect = () => {
  const { isAuthenticated } = useAuthStore();
  // If authenticated, go to the main app. If not, go to login.
  return isAuthenticated ? <Navigate to="/app/join-queue" replace /> : <Navigate to="/login" replace />;
};

// Protects routes that should only be accessible to unauthenticated users (e.g., login page)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  // If user is logged in, redirect them away from the login page.
  return isAuthenticated ? <Navigate to="/app/join-queue" replace /> : children;
};

// --- Main ProtectedRoute ---
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    // If a non-admin tries to access an admin route, send them to their dashboard
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};


// --- New Router Configuration ---
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      </PublicRoute>
    ),
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'join-queue', element: <JoinQueue /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'scanner', element: <Scanner /> },
      { path: 'token/:id', element: <TokenStatus /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly={true}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminPanel /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);


function App() {
  React.useEffect(() => {
    useThemeStore.getState().initTheme();
  }, []);

  return (
    <div className="min-h-screen bg-deep-space text-light-grey font-body">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;