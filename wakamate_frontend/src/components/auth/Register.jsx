import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// FloatingInput component with password toggle support
const FloatingInput = ({
  id,
  name,
  type,
  label,
  value,
  onChange,
  required,
  icon,
  iconColor = "text-gray-500",
  isPassword = false,
}) => {
  const [show, setShow] = useState(false);
  const inputType = isPassword && !show ? "password" : "text";

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none transition-colors duration-300 peer placeholder-transparent bg-white text-sm"
        placeholder={label}
      />
      <label
        htmlFor={id}
        className="absolute left-10 -top-2.5 bg-white px-1 text-gray-500 transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-500"
      >
        {label}
      </label>
      {icon && (
        <div className={`absolute left-3 top-3 ${iconColor}`}>
          <i className={icon}></i>
        </div>
      )}
      {isPassword && (
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={() => setShow(!show)}
        >
          <i className={`fas ${show ? "fa-eye-slash" : "fa-eye"}`}></i>
        </button>
      )}
    </div>
  );
};

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:1050/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
      } else {
        navigate("/verify", {
          state: {
            email: formData.email,
            message:
              "Registration successful! Please check your email for a 6-digit verification code.",
          },
        });
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-900">
        <div className="flex w-full max-w-7xl mx-auto items-center justify-between gap-12">
          <div className="hidden lg:flex flex-col flex-1 max-w-md">
            <div className="mb-6">
              <span className="font-extrabold text-3xl text-green-500 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-brain text-white text-sm"></i>
                </div>
                WAKAMATE AI
              </span>
            </div>
            <p className="text-gray-100 text-base leading-relaxed">
              "Step into a world where smarter sales is no longer a privilege — it's a mission.
              Sell smarter. Connect faster. Thrive together."
            </p>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl p-10 w-full">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Start your journey <br /> to smarter SALES.
              </h1>

              <div className="mt-2 mb-8">
                <span className="font-semibold text-green-500 text-base block">Sign Up</span>
                <span className="text-gray-600 text-sm">
                  Enter your details to create an account
                </span>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FloatingInput
                    id="firstName"
                    name="firstName"
                    type="text"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    icon="fas fa-user"
                  />
                  <FloatingInput
                    id="lastName"
                    name="lastName"
                    type="text"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    icon="fas fa-user"
                  />
                </div>

                <FloatingInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  icon="fas fa-envelope"
                />

                <FloatingInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  icon="fas fa-lock"
                  isPassword
                />

                <FloatingInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  icon="fas fa-lock"
                  isPassword
                />

                <div className="text-sm text-green-600 mt-2">
                  * Use uppercase, lowercase, numbers & special characters
                </div>

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-6 py-3 rounded-full font-semibold text-base transition-all duration-200 ${
                    loading
                      ? "bg-purple-500 text-white cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-spinner fa-spin"></i>
                      Registering...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>

                <div className="text-center text-base pt-4">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-green-700 underline underline-offset-2 hover:text-green-500 font-medium"
                  >
                    Login
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