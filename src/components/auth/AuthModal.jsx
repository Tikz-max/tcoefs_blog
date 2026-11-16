import { useState } from "react";
import { X, Mail, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AuthModal = ({ isOpen, onClose }) => {
  const { sendOTP, verifyOTP, signInWithGoogle } = useAuth();
  const [step, setStep] = useState("email"); // "email" | "verify"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await sendOTP(email);

    if (result.success) {
      setStep("verify");
    } else {
      setError(result.error || "Failed to send verification code");
    }

    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await verifyOTP(email, otp);

    if (result.success) {
      handleClose();
    } else {
      setError(result.error || "Invalid verification code");
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const result = await signInWithGoogle();
    if (!result.success && result.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setError("");
    onClose();
  };

  const handleBack = () => {
    setStep("email");
    setOtp("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="animate-fade fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="animate-fade-in relative w-full max-w-[420px] overflow-hidden rounded-xl border border-line bg-surface shadow-pop" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={step === "verify" ? handleBack : handleClose}
          className="icon-btn absolute right-3 top-3"
          aria-label={step === "verify" ? "Go back" : "Close"}
        >
          {step === "verify" ? <ArrowLeft size={18} /> : <X size={18} />}
        </button>

        <div className="px-7 pb-7 pt-9">
          <img src="/tcoefs-logo.png" alt="" className="h-11 w-auto" />
          <h2 id="auth-title" className="mt-5 font-serif text-[28px] font-semibold leading-tight tracking-tight">
            {step === "email" ? "Sign in to TCoEFS Blog" : "Check your email"}
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
            {step === "email"
              ? "Like stories and join the discussion. No password needed."
              : `We sent a verification code to ${email}.`}
          </p>

          {error && (
            <p role="alert" className="mt-5 rounded-md bg-danger-soft px-3.5 py-2.5 text-[13.5px] text-danger">
              {error}
            </p>
          )}

          {step === "email" ? (
            <>
              <form onSubmit={handleSendOTP} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="auth-email" className="field-label">Email address</label>
                  <input id="auth-email" type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.org" disabled={loading} className="field !h-11" />
                </div>
                <button type="submit" disabled={loading || !email} className="btn btn-primary !h-11 w-full">
                  {loading ? <Loader2 size={17} className="animate-spin" /> : <Mail size={17} />}
                  Send verification code
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-[12px] uppercase tracking-wider text-ink-3">
                <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
              </div>

              <button onClick={handleGoogleSignIn} disabled={loading} className="btn btn-secondary !h-11 w-full">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            </>
          ) : (
            <form onSubmit={handleVerifyOTP} className="mt-6 space-y-4">
              <div>
                <label htmlFor="auth-code" className="field-label">Verification code</label>
                <input id="auth-code" inputMode="numeric" autoComplete="one-time-code" required autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="000000" maxLength={8} disabled={loading} className="field !h-14 text-center font-serif !text-[26px] tracking-[0.3em]" />
              </div>
              <button type="submit" disabled={loading || otp.length < 6} className="btn btn-primary !h-11 w-full">
                {loading && <Loader2 size={17} className="animate-spin" />}
                Verify and sign in
              </button>
              <button type="button" onClick={handleSendOTP} disabled={loading} className="w-full text-center text-[13.5px] font-semibold text-brand hover:underline disabled:opacity-50">
                Send a new code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
