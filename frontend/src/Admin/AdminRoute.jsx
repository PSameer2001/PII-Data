import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAdminAuthStore from "./Auth/useAdminAuthStore";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

const AdminRoute = () => {
  const { authAdminUser, checkAuth, isCheckingAuth } = useAdminAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log({ authAdminUser });

  if (isCheckingAuth && !authAdminUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );


  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/admin/" element={authAdminUser ? <HomePage /> : <Navigate to="/admin/signin" />} />
        <Route path="/admin/signin" element={!authAdminUser ? <LoginPage /> : <Navigate to="/admin/" />} />
      </Routes>

      <Toaster />
    </>
  );
};

export default AdminRoute;
