// App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import AnimatedRoutes from './routes/AnimatedRoutes'; // 👈 Dashboard routes

function LandingPage() {
  return (
    <>
      <HeroSection />
      <HeroBanner />
      <FeaturesSection />
      <HowItWorks />
      <ScrollFeature />
      <Faq />
      <ContactSection />
      <LastSection />
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

  // 🛠️ Hide navbar and footer on auth pages and dashboard
  const hideNavFooter =
    path.startsWith("/dashboard") ||
    path === "/Dashboard" ||
    path === "/register" ||
    path === "/login" ||
    path === "/verify";

  return (
    <div className="font-sans text-gray-800">
      {!hideNavFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<EmailVerify />} />
        <Route path="/about" element={<AboutUs />} />

        {/* ✅ Protected route for dashboard */}
        <Route
          path="/dashboard/*"
          element={isLoggedIn() ? <AnimatedRoutes /> : <Navigate to="/login" replace />}
        />
      </Routes>

      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default App;
