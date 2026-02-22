import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFamily } from '../../context/FamilyContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireFamily?: boolean;
}

export function ProtectedRoute({ children, requireFamily = true }: ProtectedRouteProps) {
  const { session, loading: authLoading } = useAuth();
  const { family, loading: familyLoading } = useFamily();

  if (authLoading || (session && familyLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-emerald-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requireFamily && !family) {
    return <Navigate to="/family-setup" replace />;
  }

  return <>{children}</>;
}
