

import React from "react";

const Footer = () => {

  return (
    <footer className="relative bg-zinc-900 SmallFont text-white overflow-hidden pt-20 pb-8 px-5">
      
      <div className="max-w-6xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand Section */}
          <div>
            <h2 className="text-4xl BigFont mb-3">WAKAMATE</h2>
            <p className="text-[#ffffff] text-lg SmallFont leading-relaxed mb-5">
              Your everyday business assistant. Plan routes, track sales, and
              grow your business with smart AI technology designed for small
              vendors and hustlers.
            </p>

            <div className="flex gap-4 mt-4">
              {[
                // Facebook
                <path
                  key="facebook"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 
                  5.373-12 12c0 5.99 4.388 10.954 
                  10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 
                  1.792-4.669 4.533-4.669 1.312 0 2.686.235 
                  2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 
                  1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 
                  23.027 24 18.062 24 12.073z"
                />,
                // Twitter
                <path
                  key="twitter"
                  d="M23.953 4.57a10 10 0 01-2.825.775 
                  4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 
                  1.184a4.92 4.92 0 00-8.384 4.482C7.69 
                  8.095 4.067 6.13 1.64 3.162a4.822 4.822 
                  0 00-.666 2.475c0 1.71.87 3.213 2.188 
                  4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 
                  4.923 0 003.946 4.827 4.996 4.996 
                  0 01-2.212.085 4.936 4.936 0 004.604 
                  3.417 9.867 9.867 0 01-6.102 
                  2.105c-.39 0-.779-.023-1.17-.067a13.995 
                  13.995 0 007.557 2.209c9.053 0 
                  13.998-7.496 13.998-13.985 
                  0-.21 0-.42-.015-.63A9.935 9.935 0 
                  0024 4.59z"
                />,
                // Instagram
                <path
                  key="instagram"
                  d="M12 0C8.74 0 8.333.015 7.053.072 
                  5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 
                  1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 
                  7.053.012 8.333 0 8.74 0 12s.015 3.667.072 
                  4.947c.06 1.277.261 2.148.558 2.913.306.788.717 
                  1.459 1.384 2.126.667.666 1.336 1.079 2.126 
                  1.384.766.296 1.636.499 2.913.558C8.333 
                  23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 
                  2.148-.262 2.913-.558.788-.306 1.459-.718 
                  2.126-1.384.666-.667 1.079-1.335 
                  1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 
                  1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z"
                />,
              ].map((path, i) => (
                <div
                  key={i}
                  className="w-[45px] h-[45px] rounded-full border-2 border-green-500  flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#00ff66] hover:border-[#00ff66] hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(0,255,102,0.4)]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[#ffffff] hover:text-black transition-colors duration-300"
                  >
                    {path}
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-green-500 uppercase tracking-widest text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-lg">
              {["Home", "Features", "About Us", "Testimonials", "FAQ", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-[#ffffff] hover:text-green-500 transition-all duration-300 hover:pl-1"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-green-500 uppercase tracking-widest text-lg font-semibold mb-4">
              Features
            </h3>
            <ul className="space-y-2 text-lg">
              {[
                "Route Planning",
                "Trade Assistant",
                "AI Captions",
                "Profit Tracking",
                "Inventory Management",
                "Smart Restocking",
              ].map((feature) => (
                <li key={feature}>
                  <a
                    href={`#${feature.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-[#ffffff] hover:text-green-500 transition-all duration-300 hover:pl-1"
                  >
                    {feature}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-green-500 uppercase tracking-widest text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3 text-lg text-[#ffffff]">
              <div className="flex items-center gap-2">
                 <span>Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                 <span>+234 800 000 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <span>wakamateai@gmail.com</span>
              </div>
            </div>

            
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-lg text-[#ffffff]">
          <p>© 2025 WakaMate AI. All rights reserved.</p>
          <ul className="flex gap-5 flex-wrap justify-center">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-[#00ff66] transition-colors duration-300"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
