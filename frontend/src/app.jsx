import AnimatedBackground from "../components/animated-background.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import VerifyEmail from "../pages/verify-email.jsx";
import { useAuth } from "../store/auth-store.js";
import { useEffect } from "react";
import Dashboard from "../pages/dashboard.jsx";
import LoadingSpinner from "../components/shared/loading-spinner.jsx";

function RedirectAuthenticatedUser({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function ProtectRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (isAuthenticated && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
}

export default function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) return <LoadingSpinner />


  return (
    <AnimatedBackground>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <RedirectAuthenticatedUser>
            <Login />
          </RedirectAuthenticatedUser>
        } />
        <Route path="/register" element={
          <RedirectAuthenticatedUser>
            <Register />
          </RedirectAuthenticatedUser>
        } />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={
          <ProtectRoute>
            <Dashboard />
          </ProtectRoute>
        } />
      </Routes>
    </AnimatedBackground>
  );
}
