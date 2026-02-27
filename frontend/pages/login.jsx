import { Lock, Mail } from "lucide-react";
import { AuthCard } from "../components/auth/auth-card";
import InputField from "../components/shared/input-field";
import GradientButton from "../components/gradient-button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../store/auth-store";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { login, error, message, isLoading, clearAuthFeedback } = useAuth();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    clearAuthFeedback();
  }, [clearAuthFeedback]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login(input.email, input.password);
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <p className="text-red-500 text-sm text-center" role="alert">
            {error}
          </p>
        )}
        {!error && message && (
          <p className="text-green-500 text-sm text-center" role="status">
            {message}
          </p>
        )}
        <InputField
          type="email"
          name="email"
          Icon={Mail}
          placeholder="example@email.com"
          value={input.email}
          onChange={handleInputChange}
          autoComplete="email"
          required
        />
        <InputField
          type="password"
          name="password"
          Icon={Lock}
          placeholder="Password"
          value={input.password}
          onChange={handleInputChange}
          autoComplete="current-password"
          required
        />

        <GradientButton
          type="submit"
          onClick={handleLogin}
          isLoading={isLoading}
          disabled={isLoading}
        >
            Sign in
        </GradientButton>
      </form>
      <div className="mt-6 space-y-4 text-center text-sm">
        <Link
          href="/forgot-password"
          className="block text-muted-foreground hover:text-primary transition-colors"
        >
          Forgot your password?
        </Link>
        <div className="flex items-center justify-center gap-1">
          <span className="text-muted-foreground">
            Don&apos;t have an account?
          </span>
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-secondary transition-colors"
          >
            Sign up
          </Link>
        </div>
        <Link
          to="/"
          className="block text-muted-foreground hover:text-primary transition-colors"
        >
          Back to home
        </Link>
      </div>
    </AuthCard>
  );
}
