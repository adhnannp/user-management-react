import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLogin from "./pages/Login/UserLogin";
import AdminLogin from "./pages/Login/AdminLogin";
import UserHome from "./pages/UserHome/UserHome";
import AdminHome from "./pages/AdminHome/AdminHome";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/admin-panel" element={<AdminHome />} />
      </Routes>
    </div>
  );
};

export default App;