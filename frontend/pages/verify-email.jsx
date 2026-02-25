import { useEffect, useState } from "react";
import { AuthCard } from "../components/auth/auth-card";
import GradientButton from "../components/gradient-button";
import { Link, useNavigate, useLocation} from "react-router-dom";
import OTPCodeInput from "../components/otp-code-input";
import { useAuth } from "../store/auth-store";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const { isLoading, verifyEmail, resendVerificationEmail, clearAuthFeedback, message, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    clearAuthFeedback();
  }, [clearAuthFeedback])

  function handleCodeChange(codeValue) {
    setCode(codeValue);
  }

  async function handleCodeComplete(completedCode) {
    setCode(completedCode);
    try {
      await verifyEmail(completedCode, email);
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (code.length !== 6) return;
    try {
      await verifyEmail(code, email);
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleResend() {
    try {
      await resendVerificationEmail(email);
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
          <p
            className="text-red-500 text-sm text-center"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && message && (
          <p
            className="text-green-500 text-sm text-center"
            role="status"
          >
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
          <button onClick={handleResend} disabled={isLoading} className="text-primary hover:text-secondary transition-colors
          cursor-pointer disabled:cursor-default disabled:text-muted-foreground disabled:opacity-50">
            Resend
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
