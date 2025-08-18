import React from 'react'
import "boxicons/css/boxicons.min.css"; 

const Footer = () => {
  return (
    <div className="flex flex-col h-screen justify-between  pt-30 items-between   bg-zinc-900 text-white">
        <div className='w-full'>
            <h1 className=' sm:text-[7em] text-[4em] md:text-[8em] lg:text-[11em] mx-auto BigFont text-center'>WAKAMATE AI</h1>
        </div>
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
    </div>
  )
}

export default Footer