import { Lock, Mail } from "lucide-react";
import { AuthCard } from "../components/auth/auth-card";
import InputField from "../components/shared/input-field";
import GradientButton from "../components/gradient-button";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    console.log({ input });
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={handleLogin} className="space-y-5">
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

        <GradientButton>Sign in</GradientButton>
      </form>
      <div className="mt-6 space-y-4 text-center text-sm">
        <Link
          href="/forgot-password"
          className="block text-muted-foreground hover:text-primary transition-colors"
        >
          Forgot your password?
        </Link>
        <div className="flex items-center justify-center gap-1">
          <span className="text-muted-foreground">Don&apos;t have an account?</span>
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
