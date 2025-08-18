import React from 'react'
import BlurText from "./BlurText";
import ScrollReveal from './ScrollReveal';
import { motion } from 'framer-motion';
import PhoneSection from './PhoneSection';
import Testimonial from './Testimonial';
import FAQ from './FAQ';
import dashboard from '../assets/dashboard.png';

const Home = () => {
  return (
    <div className='bg-zinc-900'>
      <div className='flex items-center pb-20 flex-col  pt-30 text-white'>
        
       <motion.div
        initial={{ opacity: 0, scale: -0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className=' sm:text-[7em] text-[4em] md:text-[9em] lg:text-[12em] BigFont item-center mx-auto'>WAKAMATE
        </motion.div>
        <h2 className=' items-center text-center'>Plan routes, track sales, restock on time and boost your business all in one  smart AI,<br /> for small vendors and everyday hustlers </h2>
       <a 
          href="/register"
          className="relative group overflow-hidden border-2 font-semibold text-black rounded-br-3xl rounded-tl-3xl text-xl border-green-500 py-4 mt-5 px-9 bg-green-500 transition-transform duration-300 hover:scale-105"
        >
          <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
            Get Started
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </a>
      </div>
      <div className='md:px-0 px-4'>
        <img src={dashboard} alt=""  className='w-200  mx-auto  rounded-2xl'/>
      </div>
      <div className='px-10 pb-20 pt-45'>
        <h1 className='text-lg text-white/70'>Your Everyday Business Assistant</h1>
        <h1 className='text-white text-5xl pt-4 md:w-[75%]'>
         <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={5}
                blurStrength={15}
              >We combine delivery route planning, business advice, and marketing captions in one AI platform. WakaMate AI makes sure you deliver faster, sell smarter, and grow your business without wasting time or money.</ScrollReveal> </h1>
      </div>
      <div className='pt-30 pb-10'>
        <PhoneSection />
      </div>
      <div className='flex flex-col items-center gap-5 px-10 py-20'>
         <div className=' flex flex-col md:flex-row gap-4 '>
           <h1 className='border text-center border-white text-2xl text-white rounded-full px-10 py-5'>Profit Tracking</h1>
            <h1 className='border text-center border-white text-2xl text-white rounded-full px-10 py-5'>Smart Restocking</h1>
             <h1 className='border text-center border-white text-2xl text-white rounded-full px-10 py-5'>Customer Engagement</h1>
              
         </div>
         <div className='flex flex-col md:flex-row gap-4'>
          <h1 className='border text-center border-white text-2xl text-white rounded-full px-10 py-5'>Inventory Management</h1>
               <h1 className='border text-center border-white text-2xl text-white rounded-full px-10 py-5'>Route Planning</h1>
         </div>
      </div>
      <hr className='text-white/70 mx-10 mt-10'/>
       <div className='pt-20'>
            <Testimonial />
          </div>
        <div className='h-[200h]'>
          <div className=' buttom-0'>
            <FAQ />
          </div>
          <div className='  py-30 bg-zinc-900'>
            <div className='flex flex-col items-center justify-center h-full  gap-5'>
              <h1 className=' text-white px-25 items-center text-center text-5xl'>
                              
              <BlurText
                text=" Your customers are waiting. Let Wakamate deliver, sell and grow with you."
                delay={150}
                animateBy="words"
                direction="top"
                className="text-center flex justify-center"
              />
                </h1>
              <a 
                href="/register"
                className="relative group overflow-hidden border-2 font-semibold text-black rounded-br-3xl rounded-tl-3xl text-xl border-green-500 py-4 mt-4 px-9 bg-green-500 transition-transform duration-300 hover:scale-105"
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                 Try Wakamate Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </a>
            </div>
             <hr className='text-white/70 mx-10 mt-20 '/>
          </div>
        </div>
    </div>
  )
}

export default Home