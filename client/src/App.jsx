import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute, AdminRoute } from './components/auth/ProtectedRoute.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { RouteErrorBoundary } from './components/layout/RouteErrorBoundary.jsx';
import { Toaster } from './components/ui/Toaster.jsx';
import { Skeleton } from './components/ui/Skeleton.jsx';

// Code-split routes with React.lazy to keep initial bundle compact
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const LeadsPage = lazy(() => import('./pages/LeadsPage.jsx'));
const LeadDetailPage = lazy(() => import('./pages/LeadDetailPage.jsx'));
const UsersPage = lazy(() => import('./pages/UsersPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Loading fallback skeleton
function PageLoadingFallback() {
  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto font-mono">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <Skeleton className="h-72 w-full mt-6" />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <RouteErrorBoundary>
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                {/* Public Marketing Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated Application Shell */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/leads/:id" element={<LeadDetailPage />} />
                  <Route
                    path="/users"
                    element={
                      <AdminRoute>
                        <UsersPage />
                      </AdminRoute>
                    }
                  />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </RouteErrorBoundary>
        </BrowserRouter>
        {/* Global Restyled Sonner Toaster */}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
