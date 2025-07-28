// App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/NavBar';
import AboutUs from './components/AboutUs';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from "./components/HowItWorks";
import Faq from './components/FAQ';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ContactSection from "./components/ContactUs";
import ScrollFeature from './components/ScrollFeature';
import LastSection from './components/LastSection';
import HeroBanner from './components/HeroBanner';
import Footer from './components/Footer';

// Component to apply useLocation inside Router
function AppContent() {
  const location = useLocation();
  const authRoutes = ['/register', '/login'];
  const hideNavFooter = authRoutes.includes(location.pathname);

  return (
    <div className="font-sans text-gray-800">
      {!hideNavFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>

      {!hideNavFooter && <Footer />}
    </div>
  );
}

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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
