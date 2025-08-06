import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Individual Code Input Component
const CodeInput = ({ index, value, onChange, onKeyDown, inputRefs }) => {
  return (
    <input
      ref={inputRefs[index]}
      type="text"
      maxLength="1"
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      className="w-16 h-16 text-center text-2xl font-bold bg-white border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all duration-300 hover:border-purple-300"
    />
  );
};

export default function EmailVerify() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes = 600 seconds

  const inputRefs = useRef([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || 'your-email@example.com';

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerify(e);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);
    const nextEmptyIndex = newCode.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:1050/api/user/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state?.email, code: verificationCode })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Verification failed');

      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state?.email })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Resend failed');

      setSuccess('New verification code sent to your email!');
      setCanResend(false);
      setCountdown(600);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
        <div className="flex w-full max-w-6xl mx-auto items-center justify-between gap-12">
          {/* Left Branding */}
          <div className="hidden lg:flex flex-col flex-1 max-w-md">
            <div className="mb-6">
              <span className="font-extrabold text-3xl text-green-500 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-brain text-white text-sm"></i>
                </div>
                WAKAMATE AI
              </span>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              "Verify your email to unlock the full potential of AI-powered sales. 
              Your journey to smarter customer engagement starts now."
            </p>
          </div>

          {/* Right Form */}
          <div className="flex-1 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-envelope-open-text text-xl text-green-500"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Confirm Email Verification
                </h1>
                <p className="text-gray-600 text-sm">
                  To verify new email, please enter the six-digit code we sent to
                </p>
                <p className="text-green-500 font-semibold text-sm mt-1">{email}</p>
              </div>

              {/* Input Form */}
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex justify-center gap-3" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <CodeInput
                      key={index}
                      index={index}
                      value={digit}
                      onChange={handleCodeChange}
                      onKeyDown={handleKeyDown}
                      inputRefs={inputRefs}
                    />
                  ))}
                </div>

                {error && (
                  <div className="text-center">
                    <p className="text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200 flex items-center justify-center gap-2">
                      <i className="fas fa-exclamation-circle"></i> {error}
                    </p>
                  </div>
                )}

                {success && (
                  <div className="text-center">
                    <p className="text-green-600 text-sm bg-green-50 p-2 rounded-md border border-green-200 flex items-center justify-center gap-2">
                      <i className="fas fa-check-circle"></i> {success}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || code.join('').length !== 6}
                  className={`w-full py-3 rounded-full font-semibold text-base transition-all duration-200 ${
                    loading || code.join('').length !== 6
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-spinner fa-spin"></i> Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-check"></i> Verify Email
                    </span>
                  )}
                </button>

                <div className="text-center pt-3">
                  <p className="text-gray-600 text-sm mb-2">
                    Didn't receive the code?
                  </p>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendLoading}
                      className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2 disabled:opacity-50"
                    >
                      {resendLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <i className="fas fa-spinner fa-spin"></i> Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <i className="fas fa-redo"></i> Resend Code
                        </span>
                      )}
                    </button>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Resend code in {formatCountdown(countdown)}
                    </p>
                  )}
                </div>

                <div className="text-center pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-gray-600 hover:text-purple-600 text-sm font-medium underline underline-offset-2 transition-colors"
                  >
                    ← Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}