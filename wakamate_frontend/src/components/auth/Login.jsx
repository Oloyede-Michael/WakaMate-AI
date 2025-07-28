import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// 👇 FloatingInput Component (with eye toggle support)
const FloatingInput = ({
  id,
  label,
  type,
  name,
  value,
  onChange,
  icon,
  isPassword = false,
  required = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <input
        id={id}
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className="peer w-full px-4 pt-5 pb-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-purple-600"
      >
        <i className={`${icon} mr-2`}></i>
        {label}
      </label>

      {/* Eye icon for password toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
        >
          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
        </button>
      )}
    </div>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:1050/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        if (response.status === 404) {
          setError("User not found. Please check your email or register.");
        } else if (response.status === 401) {
          setError("Incorrect password. Please try again.");
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      const { token, user } = data;

      if (!token || !user) {
        console.error("Login response missing token or user:", data);
        setError("Login succeeded but incomplete data received. Contact support.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      alert("Login successful! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
        <div className="flex w-full max-w-7xl mx-auto items-center justify-between gap-12">
          {/* Left Side – Branding */}
          <div className="hidden lg:flex flex-col flex-1 max-w-md">
            <div className="mb-6">
              <span className="font-extrabold text-3xl text-purple-600 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-brain text-white text-sm"></i>
                </div>
                WAKAMATE AI
              </span>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              "Welcome back! Continue your journey to smarter sales. 
              Connect with your customers like never before."
            </p>
          </div>

          {/* Right Side – Form */}
          <div className="flex-1 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl p-10 w-full">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back to <br />
                smarter SALES.
              </h1>

              <div className="mt-2 mb-8">
                <span className="font-semibold text-purple-600 text-base block">Sign In</span>
                <span className="text-gray-600 text-sm">
                  Enter your credentials to access your account
                </span>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <FloatingInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  icon="fas fa-envelope"
                />
                
                <FloatingInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  isPassword
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>

                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-purple-600 hover:text-purple-500 underline underline-offset-2"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-6 py-3 rounded-full font-semibold text-base transition-all duration-200 cursor-pointer ${
                    loading
                      ? "bg-purple-300 text-white cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-spinner fa-spin"></i>
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className="text-center text-base pt-4">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-purple-700 underline underline-offset-2 hover:text-purple-500 font-medium"
                  >
                    Register here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}