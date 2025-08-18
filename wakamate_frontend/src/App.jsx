

// App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from './components/Navbar';
import About from './components/AboutUs';
import Register from './components/auth/Register';
import EmailVerify from './components/auth/EmailVerify';
import Login from './components/auth/Login';
import Contact from "./components/ContactUs";
import Footer from './components/Footer';
import AnimatedRoutes from './routes/AnimatedRoutes'; // Dashboard routes
import PageTransition from "./components/PageTransition"; 
import Landing from "./components/Home"; // Landing page component


// ✅ Landing Page Routes with animation
function LandingPage() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition direction="vertical">
              <Landing />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition direction="vertical">
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition direction="vertical">
              <Contact />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition direction="vertical">
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition direction="vertical">
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="/verify"
          element={
            <PageTransition direction="vertical">
              <EmailVerify />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
// ✅ Simulated auth check — replace with your real auth logic later
const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};


function App() {
  const location = useLocation();
  const path = location.pathname;

  // Hide navbar and footer on auth pages + dashboard
  const hideNavFooter =
    path.startsWith("/dashboard") ||
    path === "/Dashboard" ||
    path === "/register" ||
    path === "/login" ||
    path === "/verify";

  return (
    <div className="">
      <div className="relative">
         {!hideNavFooter && <Navbar />}
       </div>
      <Routes>
        {/* Landing + Auth routes */}
        <Route path="/*" element={<LandingPage />} />

        {/* Dashboard (protected + horizontal transition inside AnimatedRoutes) */}
        <Route
          path="/dashboard/*"
          element={
            isLoggedIn() ? (
              <PageTransition direction="horizontal">
                <AnimatedRoutes />
              </PageTransition>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default App;
