import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLogin from "./pages/Login/UserLogin";
import AdminLogin from "./pages/Login/AdminLogin";
import UserHome from "./pages/UserHome/UserHome";
import AdminHome from "./pages/AdminHome/AdminHome";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PublicRoute restricted={true} element={<UserLogin />} />} />
        <Route path="/admin" element={<PublicRoute restricted={true} element={<AdminLogin />} />} />
        <Route path="/home" element={<PrivateRoute element={<UserHome />} />} />
        <Route path="/admin-panel" element={<PrivateRoute element={<AdminHome />} />} />
      </Routes>
    </div>
  );
};

export default App;
