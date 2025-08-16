import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from './components/NavBar';
import AboutUs from './components/AboutUs';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from "./components/HowItWorks";
import Faq from './components/FAQ';
import Register from './components/auth/Register';
import EmailVerify from './components/auth/EmailVerify';
import Login from './components/auth/Login';
import ContactSection from "./components/ContactUs";
import ScrollFeature from './components/ScrollFeature';
import LastSection from './components/LastSection';
import HeroBanner from './components/HeroBanner';
import Footer from './components/Footer';
import AnimatedRoutes from './routes/AnimatedRoutes'; // Dashboard routes

// ✅ Updated LandingPage to accept and pass isDarkMode prop
function LandingPage({ isDarkMode }) {
  return (
    <>
      <HeroSection isDarkMode={isDarkMode} />
      <HeroBanner isDarkMode={isDarkMode} />
      <FeaturesSection isDarkMode={isDarkMode} />
      <HowItWorks isDarkMode={isDarkMode} />
      <ScrollFeature isDarkMode={isDarkMode} />
      <Faq isDarkMode={isDarkMode} />
      <ContactSection isDarkMode={isDarkMode} />
      <LastSection isDarkMode={isDarkMode} />
    </>
  );
}

// ✅ Simulated auth check — replace with your real auth logic later
const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

function App() {
  const location = useLocation();
  const path = location.pathname;

  // 🌓 Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync with <html> for Tailwind dark: classes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Hide navbar and footer on auth pages and dashboard
  const hideNavFooter =
    path.startsWith("/dashboard") ||
    path === "/Dashboard" ||
    path === "/register" ||
    path === "/login" ||
    path === "/verify";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    }`}>
      {!hideNavFooter && (
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      )}

      <Routes>
        {/* ✅ Pass isDarkMode to LandingPage */}
        <Route path="/" element={<LandingPage isDarkMode={isDarkMode} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<EmailVerify />} />
        {/* ✅ Pass isDarkMode to AboutUs if it needs it */}
        <Route path="/about" element={<AboutUs isDarkMode={isDarkMode} />} />

        {/* ✅ Protected route for dashboard */}
        <Route
          path="/dashboard/*"
          element={isLoggedIn() ? <AnimatedRoutes /> : <Navigate to="/login" replace />}
        />
      </Routes>

      {!hideNavFooter && <Footer isDarkMode={isDarkMode} />}
    </div>
  );
}

export default App;