import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element, isAdminRequired }) => {
  const { isAuthenticated, isAdmin, authToken, user } = useSelector((state) => state.auth);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !authToken || !user) {
      setShouldRedirect(true);
    }

    if (isAdminRequired && !isAdmin) {
      setShouldRedirect(true);
    }

    if (!isAdminRequired && isAdmin) {
      setShouldRedirect(true);
    }
  }, [isAuthenticated, authToken, user, isAdmin, isAdminRequired]);

  if (shouldRedirect) {
    if (!isAuthenticated || !authToken || !user) {
      return <Navigate to="/" replace />;
    }

    if (isAdminRequired && !isAdmin) {
      return <Navigate to="/home" replace />;
    }

    if (!isAdminRequired && isAdmin) {
      return <Navigate to="/admin-panel" replace />;
    }
  }

  return element;
};

export default PrivateRoute;
