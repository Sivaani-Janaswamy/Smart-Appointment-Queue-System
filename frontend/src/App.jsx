import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
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

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <JoinQueue /> },
      { path: 'token/:id', element: <TokenStatus /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'scanner', element: <Scanner /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Dashboard /> }],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly={true}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <AdminPanel /> }],
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
