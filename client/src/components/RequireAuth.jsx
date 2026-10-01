import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Wraps a page that needs a signed-in user, or an admin. This only decides
// what the browser shows; the API checks the session again on every request.
export default function RequireAuth({ admin = false, children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (admin && !user.isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
