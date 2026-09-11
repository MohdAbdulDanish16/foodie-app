import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("foodieLoggedIn") === "true";

  const token = localStorage.getItem("foodieToken");

  if (!isLoggedIn || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;