import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div>Carregando...</div>;

  if (!isAuthenticated) return <Navigate to="/login/" replace />;

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/loja/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
