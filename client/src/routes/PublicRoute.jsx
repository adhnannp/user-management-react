import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFromToken } from "../features/authSlice";

const PublicRoute = ({ element, restricted }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, authToken, isAdmin } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (authToken) {
      dispatch(fetchUserFromToken(authToken));
    }
  }, [authToken, dispatch]);

  if (isAuthenticated && restricted) {
    return <Navigate to={isAdmin ? "/admin-panel" : "/home"} />;
  }

  return element;
};

export default PublicRoute;
