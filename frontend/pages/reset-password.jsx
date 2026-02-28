import { useState } from "react";
import { FeedbackAlert } from "../components/shared/feedback-alert";
import GradientButton from "../components/gradient-button";
import { Link, useParams } from "react-router-dom";
import { AuthCard } from "../components/auth/auth-card";
import InputField from "../components/shared/input-field";
import { Lock } from "lucide-react";
import { useAuth } from "../store/auth-store";
import { resetPasswordSchema } from "../lib/validation/password-schema";
import { z } from "zod";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputErrors, setInputErrors] = useState({
    password: undefined,
    confirmPassword: undefined
  });
  const { resetPassword, error, message, isLoading } = useAuth();

  function extractFieldErrors(error) {
    const flattenError = z.flattenError(error).fieldErrors;
    return {
      password: flattenError.password?.[0],
      confirmPassword: flattenError.confirmPassword?.[0]
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validatedInput = resetPasswordSchema.safeParse({password, confirmPassword})
    if(!validatedInput.success) {
      const errors = extractFieldErrors(validatedInput.error);
      setInputErrors(errors);
      return;
    }
    try {
      await resetPassword(token, password);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (message) {
    return (
      <AuthCard
        title="Password Reset"
        subtitle="Your password has been updated"
      >
        <div className="space-y-6">
          <FeedbackAlert
            type="success"
            message={message}
          />

          <Link to="/login">
            <GradientButton type="button">Sign In</GradientButton>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create New Password"
      subtitle="Enter a new password for your account"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <FeedbackAlert type="error" message={error} />}
        <div>
          <label htmlFor="password" className="sr-only">
            New Password
          </label>
          <InputField
            id="password"
            type="password"
            name="password"
            Icon={Lock}
            placeholder="New password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setInputErrors((prev) => { return { ...prev, password: undefined } })
            }}
            setError={inputErrors.password}
            autoComplete="current-password"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <InputField
            id="confirmPassword"
            type="password"
            name="password"
            Icon={Lock}
            placeholder="New password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setInputErrors((prev) => { return { ...prev, confirmPassword: undefined } })
            }}
            setError={inputErrors.confirmPassword}
            autoComplete="new-password"
            required
          />
        </div>

        <GradientButton type="submit" isLoading={isLoading}>
          Reset Password
        </GradientButton>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to login
        </Link>
      </div>
    </AuthCard>
  );
}
