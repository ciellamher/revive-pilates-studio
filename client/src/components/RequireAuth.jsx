import { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Wraps a page that needs a signed-in user, or an admin. This only decides
// what the browser shows; the API checks the session again on every request.
export default function RequireAuth({ admin = false, children }) {
  const { user } = useAuth();
  const location = useLocation();
  const from = location.pathname + location.search;
  // The same object on every render: <Navigate> redirects again whenever its
  // state changes, and the page transition re-renders this many times while
  // it animates, which would otherwise redirect in an endless loop.
  const redirectState = useMemo(() => ({ from }), [from]);

  if (!user) {
    // Opening a class while signed out: remember which class, so checkout
    // can pick it up again once the visitor is back from the sign-in link.
    if (location.pathname === '/checkout' && location.state?.classId) {
      try {
        localStorage.setItem('revive:checkout', JSON.stringify(location.state));
      } catch {
        // Without storage they will pick the class again after signing in.
      }
    }
    return <Navigate to="/login" replace state={redirectState} />;
  }
  if (admin && !user.isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
