import React from 'react'
  import BlurText from "./BlurText";
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import michael from '../assets/michael.jpg'
import we from '../assets/team.jpg';
import wura from '../assets/wura.jpg';
import raphael from '../assets/raphael.jpg';
import joe from '../assets/joe.jpg';
import dami from '../assets/dami.jpg';
import dani from '../assets/dani.jpg';
import TiltedCard from './TiltedCard';
import { createLucideIcon } from "lucide-react";
export const GrowthZigZagArrow = createLucideIcon("GrowthZigZagArrow", [
  [

    "polyline",
    {
      points: "3 17 7 13 11 15 15 9 19 11 23 5", // zig-zag growth path
      key: "zigzag-path"
    }
  ],
  [
    "polyline",
    {
      points: "20 2 23 5 20 8", // arrowhead at the top
      key: "arrow-head"
    }
  ]
]);


const AboutUs = () => {
  return (
    <div className='bg-zinc-900 text-white'>
      <div className='flex flex-col'>
       <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-8xl font-semibold z-10 uppercase pt-[120px] px-7"
      >
        We transform <br /> hustle into lasting growth
      </motion.div>

        <GrowthZigZagArrow className="w-20 h-20 text-green-500" strokeWidth={3} />
        <div className='w-full'>
        <img src={we} alt="" className='w-25 absolute top-70 right-50 rotate-10' />
        </div>
      </div>
        <hr  className='text-white/70 mx-10 mt-20'/>
        <div className='flex gap-20 w-full justify-between py-20 px-10'>
           <h1 className='text-lg w-[30%] text-white/70'>WakaMate is your smart business companion, built to help vendors, riders, and small business owners work faster, sell more, and worry less.</h1>
            <h1 className="flex flex-col text-white pt-20 w-[70%] text-4xl">
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={5}
                blurStrength={15}
              >
                  We believe that technology should be simple, friendly, and built for real
                  life. That’s why WakaMate uses AI to handle the hard stuff — from planning
                  delivery routes, tracking stock, and suggesting restock dates, to creating
                  ready-made captions for your social media.
                
              </ScrollReveal>

              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={5}
                blurStrength={15}
              >
                  For us, growth is more than just profit — it’s about helping you connect
                  with your customers, deliver on time, and run your business with
                  confidence. We focus on tools that save you time, cut stress, and give you
                  insights you can trust.
            
              </ScrollReveal>

              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={5}
                blurStrength={15}
              >
                  Our approach combines real-time data, practical AI suggestions, and a deep
                  understanding of how vendors work. The result? A smarter way to hustle,
                  every single day.
              </ScrollReveal>
            </h1>

        </div>
        <div className='pt-40'>
          <h1 className='text-center font-semibold text-4xl'>OUR TEAM</h1>
          <div className="flex justify-center items-center min-h-screen">
            <div className="grid grid-cols-3 gap-20 px-10 py-10 max-w-6xl mx-auto">
              <div className=''>
                <TiltedCard
                  imageSrc={michael}
                  altText="Oloyede Michael"
                  captionText="Oloyede Michael"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text border-green-500 border-2 backdrop-blur-lg bg-black/60 rounded-2xl px-10">
                      Oloyede Michael
                    </p>
                  }
                />
               <h2 className="text-lg text-center pt-2 text-white pb-5">Team Leader and Full Stack Developer</h2>
               <div className="socials ">
                  <a href=" " className=""> <i className="bx px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-twitter text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=""><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-linkedin text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=" "><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bx-envelope text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" />
                  </a>
               </div>
              </div>
              <div className=''>
                <TiltedCard
                  imageSrc={wura}
                  altText="elizabeth"
                  captionText="Wuraola Omilabu"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                   <p className="tilted-card-demo-text border-green-500 border-2 backdrop-blur-lg bg-black/60 rounded-2xl px-10">
                     Wuraola Omilabu
                    </p>
                  }
                />
                <h2 className="text-lg text-center pt-2 text-white pb-5">Creative Developer and Frontend Engineer</h2>
               <div className="socials ">
                  <a href=" " className=""> <i className="bx px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-twitter text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=""><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-linkedin text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=" "><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bx-envelope text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" />
                  </a>
               </div>
              </div>
              <div className=''>
                <TiltedCard
                  imageSrc={raphael}
                  altText="raphael"
                  captionText="Raphael Eniaiyejuni"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                   <p className="tilted-card-demo-text border-green-500 border-2 backdrop-blur-lg bg-black/60 rounded-2xl px-10">
                      Raphael Eniaiyejuni
                    </p>
                  }
                />
                <h2 className="text-lg text-center pt-2 text-white pb-5">Smart-contract Developer and AI Engineer</h2>
               <div className="socials ">
                  <a href=" " className=""> <i className="bx px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-twitter text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=""><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-linkedin text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=" "><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bx-envelope text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" />
                  </a>
               </div>
              </div>
              <div className=''>
                <TiltedCard
                  imageSrc={joe}
                  captionText="Joseph Bassey"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text border-green-500 border-2 backdrop-blur-lg bg-black/60 rounded-2xl px-10">
                     Joseph Bassey
                    </p>
                  }
                />
                <h2 className="text-lg text-center pt-2 text-white pb-5">Progect Manager and UI/UX Designer</h2>
               <div className="socials ">
                  <a href=" " className=""> <i className="bx px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-twitter text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=""><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-linkedin text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=" "><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bx-envelope text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" />
                  </a>
               </div>
              </div>
              <div className=''>
                <TiltedCard
                  imageSrc={dani}
                  altText="daniella"
                  captionText="Daniella Abibi"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text border-green-500 border-2 backdrop-blur-lg bg-black/60 rounded-2xl px-10">
                      Daniella Abibi
                    </p>
                  }
                />
                <h2 className="text-lg text-center pt-2 text-white pb-5">Backend Engineer</h2>
               <div className="socials ">
                  <a href=" " className=""> <i className="bx px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-twitter text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=""><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-linkedin text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=" "><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bx-envelope text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" />
                  </a>
               </div>
              </div>
             
              <div className=''>
                <TiltedCard
                  imageSrc={dami}
                  altText="dami"
                  captionText="Damilola Emanuel"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text border-2 border-green-500 backdrop-blur-lg bg-black/60 rounded-2xl px-10">
                      Damilola Emanuel
                    </p>
                  }
                />
                <h2 className="text-lg text-center pt-2 text-white pb-5">LOGO Designer and UI/US Designer</h2>
               <div className="socials ">
                  <a href=" " className=""> <i className="bx px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-twitter text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=""><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bxl-linkedin text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" /></a>
                  <a href=" "><i className="bx  px-2 hover:border-green-500 mx-2 pt-2 border-2 border-white rounded-full w-10 h-10 bx-envelope text-white text-xl cursor-pointer transition-colors duration-300 hover:text-green-500" />
                  </a>
               </div>
              </div>
            </div>
          </div>
        </div>
         <div className=' pb-20 pt-30 bg-zinc-900'>
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
  )
}

export default AboutUs