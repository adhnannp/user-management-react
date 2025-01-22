import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ element }) => {
  const { isAuthenticated, authToken, user, isAdmin } = useSelector((state) => state.auth);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (isAuthenticated && authToken && user) {
      const redirectTo = isAdmin ? "/admin-panel" : "/home";
      setShouldRedirect(true);
    }
  }, [isAuthenticated, authToken, user, isAdmin]);

  if (shouldRedirect) {
    return <Navigate to={isAdmin ? "/admin-panel" : "/home"} replace />;
  }

  return element;
};

export default PublicRoute;
