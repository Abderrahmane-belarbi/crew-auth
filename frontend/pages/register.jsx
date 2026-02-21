import { Lock, Mail, User } from "lucide-react";
import { AuthCard } from "../components/auth/auth-card";
import InputField from "../components/shared/input-field";
import { useState } from "react";
import GradientButton from "../components/gradient-button";
import { Link } from "react-router-dom";

export default function Register() {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function handleRegister(e) {
    e.preventDefault();
    console.log("Register");
  }

  return (
    <AuthCard title="Create Account" subtitle="Join us to get started">
      <form onSubmit={handleRegister} className="space-y-5">
        <InputField
          type="text"
          name="name"
          Icon={User}
          placeholder="Full name"
          value={input.name}
          onChange={handleInputChange}
          autoComplete="name"
          autoCapitalize="words"
          required
        />
        <InputField
          type="email"
          name="email"
          Icon={Mail}
          placeholder="you@email.com"
          value={input.email}
          onChange={handleInputChange}
          autoComplete="email"
          required
        />
        <InputField
          type="password"
          name="password"
          Icon={Lock}
          placeholder="Register password"
          value={input.password}
          onChange={handleInputChange}
          autoComplete="new-password"
          required
        />
        <InputField
          type="password"
          name="confirmPassword"
          Icon={Lock}
          placeholder="Confirm password"
          value={input.confirmPassword}
          onChange={handleInputChange}
          autoComplete="new-password"
          required
        />
        <GradientButton>Create Account</GradientButton>
      </form>
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{" "}
        <Link
          to="/login"
          className="font-semibold text-primary hover:text-secondary transition-colors"
        >
          Sign in
        </Link>
      </div>
    </AuthCard>
  );
}
