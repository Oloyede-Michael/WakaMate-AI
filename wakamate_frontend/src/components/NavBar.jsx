import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='absolute top-0'>
      <div className="w-full fixed top-0 z-50  text-white">
        <div className='flex justify-between items-center px-4 sm:px-5 py-4 sm:py-7'>
          {/* Logo */}
          <Link to="/" className='BigFont z-10 text-lg sm:text-xl md:text-3xl'>
            W.
          </Link>
          
          {/* Desktop Navigation */}
          <div className='hidden md:flex gap-4  pt-2 text-lg lg:text-xl SmallFont'>
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ backgroundColor: "#22c55e", color: "#000000" }}
              className="transition-colors py-2 transition-bg rounded-4xl"
            >
              <Link
                to="/about"
                className="border-2 backdrop-blur rounded-4xl py-2 px-3"
              >
                ABOUT US
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ backgroundColor: "#22c55e", color: "#000000" }}
              className="transition-colors py-2 transition-bg rounded-4xl"
            >
              <Link to="/contact" className='border-2 backdrop-blur rounded-4xl py-2 px-3'>
                CONTACT
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col z-10 justify-center items-center w-8 h-8 space-y-1"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white block transition-all"
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-white block transition-all"
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white block transition-all"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "110vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-zinc-900 absolute top-0 w-full   backdrop-blur-md border-t border-white/20"
            >
              <div className="flex flex-col border-2 space-y-4 px-4 py-40 SmallFont">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ backgroundColor: "#22c55e", color: "#000000" }}
                  className="transition-colors rounded-4xl"
                >
                  <Link
                    to="/about"
                    className="block border-2 backdrop-blur rounded-4xl py-3 px-4 text-center text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ABOUT US
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ backgroundColor: "#22c55e", color: "#000000" }}
                  className="transition-colors rounded-4xl"
                >
                  <Link
                    to="/contact"
                    className="block border-2 backdrop-blur rounded-4xl py-3 px-4 text-center text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CONTACT
                  </Link>
                  <div className="flex flex-col md:flex-row justify-center md:justify-between items-start gap-3 md:items-end px-8 py-4 text-lg font-sans">
                    <h2 className='text-start pt-30 '>©2025. All rights reserved.</h2>

                    <div className="flex pt-0 md:pt-30 gap-6 ">
                      <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-3xl hover:text-green-500 transition-colors duration-300"
                    >
                      <i className="bx bxl-twitter"></i>
                    </a>

                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-3xl hover:text-green-500 transition-colors duration-300"
                    >
                      <i className="bx bxl-github"></i>
                    </a>

                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-3xl hover:text-green-500 transition-colors duration-300"
                    >
                      <i className="bx bxl-youtube"></i>
                    </a>

                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-3xl hover:text-green-500 transition-colors duration-300"
                    >
                      <i className="bx bxl-linkedin"></i>
                    </a>
                  </div>
                </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NavBar