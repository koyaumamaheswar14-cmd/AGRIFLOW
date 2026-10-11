import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const token = localStorage.getItem("token");

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    console.error(error);
  }

  if (!token || !user.userId) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;