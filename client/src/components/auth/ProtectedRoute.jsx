import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020202] text-[#EEEEEE] font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-1 bg-[#FE6A00] animate-pulse" />
          <p className="text-xs uppercase tracking-widest text-[#717171]">
            AUTHENTICATING...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center font-mono">
        <div className="w-10 h-10 border border-[#E7000B] flex items-center justify-center text-[#F2554F] font-bold text-lg mb-4">
          !
        </div>
        <h2 className="font-display text-4xl uppercase tracking-wider text-[#F2554F] mb-2">
          403 / ACCESS RESTRICTED
        </h2>
        <p className="text-xs text-[#717171] max-w-sm mb-6 leading-relaxed">
          You do not have administrative privileges to access this area.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center h-11 px-6 bg-[#060606] border border-[#EEEEEE]/20 text-[#EEEEEE] text-xs font-mono uppercase tracking-widest hover:border-[#FE6A00] hover:text-[#FE6A00] transition-colors"
        >
          RETURN TO DASHBOARD
        </a>
      </div>
    );
  }

  return children;
}

export function AdminRoute({ children }) {
  return <ProtectedRoute requiredRole="ADMIN">{children}</ProtectedRoute>;
}
