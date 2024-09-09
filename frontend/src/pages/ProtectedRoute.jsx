import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../components/auth/isAuthenticated";

const ProtectedRoute = ({ element }) => {
  const location = useLocation();
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default ProtectedRoute;
