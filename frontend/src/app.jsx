import AnimatedBackground from "../components/animated-background.jsx";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import VerifyEmail from "../pages/verify-email.jsx";
import { useAuth } from "../store/auth-store.js";
import { useEffect } from "react";
import Dashboard from "../pages/dashboard.jsx";

export default function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuth();
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <AnimatedBackground>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AnimatedBackground>
  );
}
