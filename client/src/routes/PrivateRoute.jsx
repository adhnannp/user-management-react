import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFromToken } from "../features/authSlice";

const PrivateRoute = ({ element }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, authToken, isAdmin } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (authToken) {
      dispatch(fetchUserFromToken(authToken));
    }
  }, [authToken, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/"} />;
  }

  return element;
};

export default PrivateRoute;
