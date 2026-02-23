import { useState } from "react";
import { AuthCard } from "../components/auth/auth-card";
import GradientButton from "../components/gradient-button";
import { Link, useNavigate } from "react-router-dom";
import OTPCodeInput from "../components/otp-code-input";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleCodeChange(code) {
    setCode(code);
  }

  function handleCodeComplete(completedCode) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  return (
    <AuthCard
      title="Verify Email"
      subtitle="Enter the 6-digit code sent to your email"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/*error && <AlertMessage type="error" message={error} />*/}
        {/*success && <AlertMessage type="success" message={success} />*/}

        <div>
          <label className="sr-only">Verification Code</label>
          <OTPCodeInput
            onChange={handleCodeChange}
            onComplete={handleCodeComplete}
          />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Code will auto-verify when all digits are entered
          </p>
        </div>

        {code.length === 6 && (
          <GradientButton type="submit" isLoading={isLoading}>
            Verify Email
          </GradientButton>
        )}

        {code.length < 6 && (
          <button
            type="button"
            disabled
            className="h-12 w-full rounded-lg font-semibold bg-muted text-muted-foreground opacity-50"
          >
            Enter Code
          </button>
        )}
      </form>

      <div className="mt-6 space-y-3 text-center text-sm">
        <p className="text-muted-foreground">
          Didn't receive the code?{" "}
          <button className="text-primary hover:text-secondary transition-colors cursor-pointer">
            Resend
          </button>
        </p>
        <Link
          to="/login"
          className="block text-muted-foreground hover:text-primary transition-colors"
        >
          Back to login
        </Link>
      </div>
    </AuthCard>
  );
}
