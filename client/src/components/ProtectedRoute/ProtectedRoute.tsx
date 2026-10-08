import { useAuth } from "../../contexts/AuthContext";
import { Outlet, useLocation, useOutletContext } from "react-router";
import { Navigate } from "react-router";

type MobileContext = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
};

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const context = useOutletContext<MobileContext>();
  if (isLoading) return null;
  return isAuthenticated ? <Outlet context={context}/> 
  : <Navigate to="/login" replace state={{ from: location }} />;
}

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/knowledge" replace /> : <Outlet />;
}