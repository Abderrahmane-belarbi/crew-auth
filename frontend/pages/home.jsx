import { Link } from "react-router-dom";
import FeatureGrid from "../components/home/feature-grid";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import GradientButton from "../components/gradient-button";

export default function Home() {
  return (
    <div className="w-full max-w-2xl py-12 px-4">
      <div className="space-y-10 text-center">
        {/* HERO SECTION */}
        <div className="space-y-4">
          <h1 className="text-foreground text-5xl font-bold text-balance">
            MERN Auth System
          </h1>
          <p className="text-muted-foreground text-lg text-balance">
            Full-stack authentication system built with MongoDB, Express, React,
            and Node.js. Implements secure JWT-based authentication, email
            verification, password reset, and protected routes with a modern
            dark UI.
          </p>
        </div>
        {/* FEATURE GRID SECTION */}
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureGrid
            Icon={Lock}
            color="text-primary"
            title="Secure Auth"
            content="JWT Auth | Hashed Passwords"
          />
          <FeatureGrid
            Icon={Mail}
            color="text-secondary"
            title="Email Verification"
            content="Time-limited verification tokens"
          />
          <FeatureGrid
            Icon={User}
            color="text-accent"
            title="Route Protection"
            content="Middleware-based access control"
          />
        </div>
        {/* AUTH PAGES LINKS */}
        <div className="space-y-3 pt-2">
          <p className="text-sm text-muted-foreground">
            Preview the authentication flow
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/login"
              className="w-full h-11 rounded-lg border border-border/40 bg-muted/30 hover:bg-muted/70 text-foreground transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/register"
              className="w-full h-11 rounded-lg border border-border/40 bg-muted/30 hover:bg-muted/70 text-foreground transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/forgot-password"
              className="w-full h-11 rounded-lg border border-border/40 bg-muted/30 hover:bg-muted/70 text-foreground transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>Reset Password</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/verify-email"
              className="w-full h-11 rounded-lg border border-border/40 bg-muted/30 hover:bg-muted/70 text-foreground transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>Verify Email</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link to="/dashboard" className="sm:col-span-2">
              <GradientButton type="button">Dashboard</GradientButton>
            </Link>
          </div>
        </div>
        {/* Core Authentication Features */}
        <div className="space-y-3 rounded-xl border border-border/40 bg-muted/20 backdrop-blur-xl p-6 text-left">
          <h3 className="font-semibold text-foreground">
            Core Authentication Features
          </h3>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-secondary">→</span>
              <span>JWT-based stateless authentication</span>
            </li>

            <li className="flex gap-2">
              <span className="text-secondary">→</span>
              <span>Bcrypt password hashing with salt rounds</span>
            </li>

            <li className="flex gap-2">
              <span className="text-secondary">→</span>
              <span>Email verification with expiring tokens</span>
            </li>

            <li className="flex gap-2">
              <span className="text-secondary">→</span>
              <span>Password reset with secure token validation</span>
            </li>

            <li className="flex gap-2">
              <span className="text-secondary">→</span>
              <span>Middleware-based route protection</span>
            </li>

            <li className="flex gap-2">
              <span className="text-secondary">→</span>
              <span>HTTP-only cookie session handling</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
