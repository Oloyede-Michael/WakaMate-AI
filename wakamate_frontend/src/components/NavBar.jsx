import React from 'react'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const NavBar = () => {
  return (
    <div className=''>
      <div className="fixed top-0 z-50 w-full   text-white">
          <div className='flex justify-between px-5 py-7'>
              <Link to="/" className=' BigFont text-2xl'>WAKAMATE</Link>
              <div className='flex gap-4 pt-2 text-xl SmallFont'>
                <motion.div
                  initial={{ opacity: 0, x: 0 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 , delay: 0.1 }}
                  whileHover={{ backgroundColor: "#22c55e", color: "#000000" }}
                  className="transition-colors py-2  transition-bg rounded-4xl"
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
                  className="transition-colors py-2  transition-bg rounded-4xl"
                >
                 <Link to="/contact" className=' border-2 backdrop-blur rounded-4xl py-2 px-3'>CONTACT</Link>
                </motion.div>
              </div>
        </div>
      </div>
  </div>
  )
}

export default NavBar