import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("foodieLoggedIn") === "true";

  const token = localStorage.getItem("foodieToken");

  const currentUser = JSON.parse(
    localStorage.getItem("foodieCurrentUser")
  );

  if (!isLoggedIn || !token) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser?.role !== "admin") {
    alert("❌ Admin access required!");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminProtectedRoute;