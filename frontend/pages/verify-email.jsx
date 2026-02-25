import { useEffect, useState } from "react";
import { AuthCard } from "../components/auth/auth-card";
import GradientButton from "../components/gradient-button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import OTPCodeInput from "../components/otp-code-input";
import { useAuth } from "../store/auth-store";

const RESEND_COOLDOWN_SECONDS = 60;
const RESEND_COOLDOWN_KEY = "verify-email-resend-cooldown-expires-at";

function getRemainingCooldownSeconds() {
  const savedCooldownExpiresAt = window.sessionStorage.getItem(RESEND_COOLDOWN_KEY);
  if (!savedCooldownExpiresAt) return 0;

  const secondsLeft = Math.max(
    0,
    Math.ceil((Number(savedCooldownExpiresAt) - Date.now()) / 1000),
  );

  if (secondsLeft <= 0) {
    window.sessionStorage.removeItem(RESEND_COOLDOWN_KEY);
    return 0;
  }

  return secondsLeft;
}

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(() =>
    getRemainingCooldownSeconds(),
  );
  const {
    isLoading,
    verifyEmail,
    resendVerificationEmail,
    clearAuthFeedback,
    message,
    error,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    clearAuthFeedback();
  }, [clearAuthFeedback]);

  useEffect(() => {
    if (cooldownSecondsLeft <= 0) {
      window.sessionStorage.removeItem(RESEND_COOLDOWN_KEY);
      return;
    }

    const intervalId = window.setInterval(() => {
      setCooldownSecondsLeft(getRemainingCooldownSeconds());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldownSecondsLeft]);

  function handleCodeChange(codeValue) {
    setCode(codeValue);
  }

  async function handleCodeComplete(completedCode) {
    setCode(completedCode);
    try {
      await verifyEmail(completedCode, email);
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    } catch (verifyError) {
      console.log(verifyError);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (code.length !== 6) return;

    try {
      await verifyEmail(code, email);
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    } catch (verifyError) {
      console.log(verifyError);
    }
  }

  async function handleResend() {
    //if (cooldownSecondsLeft > 0) return;

    try {
      await resendVerificationEmail(email, RESEND_COOLDOWN_SECONDS);
      const cooldownExpiresAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
      window.sessionStorage.setItem(RESEND_COOLDOWN_KEY, String(cooldownExpiresAt));
      setCooldownSecondsLeft(getRemainingCooldownSeconds());
    } catch (resendError) {
      console.log(resendError);
    }
  }

  return (
    <AuthCard
      title="Verify Email"
      subtitle="Enter the 6-digit code sent to your email"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <GradientButton
          type="submit"
          isLoading={isLoading}
          disabled={code.length !== 6 || (!error && !!message)}
        >
          Verify Email
        </GradientButton>
      </form>

      <div className="mt-6 space-y-3 text-center text-sm">
        <p className="text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={isLoading }
            className="text-primary hover:text-secondary transition-colors cursor-pointer disabled:cursor-default disabled:text-muted-foreground disabled:opacity-50"
          >
            {cooldownSecondsLeft > 0
              ? `Resend in ${cooldownSecondsLeft}s`
              : "Resend"}
          </button>
        </p>
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
