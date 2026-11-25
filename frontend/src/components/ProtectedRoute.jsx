import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRoles
}) {
  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    if (user.role === "freelancer") {
      return (
        <Navigate
          to="/freelancer"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/client"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;