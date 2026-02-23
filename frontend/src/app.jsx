import AnimatedBackground from "../components/animated-background.jsx";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home.jsx";
import Login from "../pages/login.jsx";
import Register from "../pages/register.jsx";
import VerifyEmail from "../pages/verify-email.jsx";

export default function App() {
  return (
    <AnimatedBackground>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </AnimatedBackground>
  );
}
