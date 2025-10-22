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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-[0_8px_32px_rgba(49,104,64,0.16)] border border-[#d9e8e0] overflow-hidden">
        {/* Close/Back Button */}
        <button
          onClick={step === "verify" ? handleBack : handleClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-sage-light hover:bg-sage-medium transition-all duration-[180ms] text-primary z-10"
          aria-label={step === "verify" ? "Go back" : "Close modal"}
        >
          {step === "verify" ? <ArrowLeft size={20} /> : <X size={20} />}
        </button>

        {/* Header */}
        <div className="px-8 pt-24 pb-6">
          <h2 className="text-[28px] leading-tight font-bold text-primary mb-3">
            {step === "email" ? "Welcome to TcoEFS" : "Verify Your Email"}
          </h2>
          <p className="text-[17px] leading-relaxed text-secondary">
            {step === "email"
              ? "Sign in to like articles, leave comments, and join the conversation."
              : `We sent a verification code to ${email}`}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[15px] text-red-600">{error}</p>
            </div>
          )}

          {step === "email" ? (
            <>
              {/* Email Form */}
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-[15px] font-medium text-primary"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full h-[56px] px-4 bg-white border-2 border-[#d9e8e0] rounded-lg text-[17px] text-text placeholder:text-primary/40 focus:border-accent focus:bg-[#f8fbf9] focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all duration-[180ms]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[56px] bg-accent hover:bg-accent-dark text-white text-[17px] font-medium rounded-lg transition-all duration-[180ms] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(49,104,64,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Sending code...</span>
                    </>
                  ) : (
                    "Continue with Email"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#d9e8e0]"></div>
                </div>
                <div className="relative flex justify-center text-[15px]">
                  <span className="px-4 bg-background text-secondary">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-[56px] bg-white border-2 border-[#d9e8e0] hover:border-accent hover:bg-[#f8fbf9] text-primary text-[17px] font-medium rounded-lg transition-all duration-[180ms] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-[#d9e8e0]">
                <p className="text-[13px] text-secondary text-center leading-relaxed">
                  By continuing, you agree to our{" "}
                  <a
                    href="#"
                    className="text-accent hover:text-accent-dark transition-colors duration-[180ms]"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-accent hover:text-accent-dark transition-colors duration-[180ms]"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* OTP Verification Form */}
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="block text-[15px] font-medium text-primary"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    maxLength={6}
                    placeholder="000000"
                    className="w-full h-[64px] px-4 bg-white border-2 border-[#d9e8e0] rounded-lg text-[28px] text-center text-text placeholder:text-primary/40 focus:border-accent focus:bg-[#f8fbf9] focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all duration-[180ms] tracking-widest font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full h-[56px] bg-accent hover:bg-accent-dark text-white text-[17px] font-medium rounded-lg transition-all duration-[180ms] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(49,104,64,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Verify & Sign In"
                  )}
                </button>
              </form>

              {/* Resend Code */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-[15px] text-accent hover:text-accent-dark transition-colors duration-[180ms] disabled:opacity-50 font-medium"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
