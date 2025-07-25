import { Routes, Route } from "react-router-dom";
import Navbar from './components/NavBar';
import AboutUs from './components/AboutUs'
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from "./components/HowItWorks";
import Faq from './components/FAQ';
import ContactSection from "./components/ContactUs";
import ScrollFeature from './components/ScrollFeature';
import LastSection from './components/LastSection';
import HeroBanner from './components/HeroBanner';
import Footer from './components/Footer';

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
    <div className="font-sans text-gray-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} /> 
      </Routes>
      <Footer />
    </div>
  );
}

export default App;