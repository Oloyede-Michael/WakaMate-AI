import React from 'react'
import "boxicons/css/boxicons.min.css"; 

const Footer = () => {
  return (
    <div className="flex flex-col h-screen justify-between  py-30 items-between   bg-zinc-900 text-white">
        <div className='w-full'>
            <h1 className='text-[11em] mx-auto BigFont text-center'>WAKAMATE AI</h1>
        </div>
         <div className="flex justify-between items-end px-8 py-4 text-lg font-sans">
          <h2 className='text-start pt-30 '>©2025. All rights reserved.</h2>

          <div className="flex pt-30 gap-6 ">
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