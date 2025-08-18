
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Testimonial = () => {
  const [translateX, setTranslateX] = useState(0);

const testimonials = [
  {
    id: 1,
    logo: "🛒",
    logoColor: "bg-green-600",
    quote:
      "Before WakaMate, I was wasting so much time figuring out delivery routes. Now I just ask the AI, and it gives me the fastest path. I save fuel and reach more customers in less time!",
    name: "Chinedu Okafor",
    title: "Market Vendor",
    company: "Alaba Market",
    hasReadMore: true,
  },
  {
    id: 2,
    logo: "📦",
    logoColor: "bg-yellow-400",
    logoTextColor: "text-black",
    quote:
      "WakaMate’s Trade Assistant helped me realize I was restocking too early and losing money. Now I know exactly when to restock and how much profit I’m making every week.",
    name: "Maryam Bello",
    title: "Small Business Owner",
    company: "Maryam’s Provisions",
    hasReadMore: true,
  },
  {
    id: 3,
    logo: "🚴‍♂️",
    logoColor: "bg-blue-500",
    logoTextColor: "text-white",
    quote:
      "As a delivery rider, the AI has been a lifesaver. No more confusion with multiple drop-offs. The route planner makes my work smoother and stress-free.",
    name: "Samuel Adeyemi",
    title: "Logistics Partner",
    company: "Lagos Delivery Hub",
    hasReadMore: true,
  },
  // Duplicate for seamless loop
  {
    id: 4,
    logo: "🛒",
    logoColor: "bg-green-600",
    quote:
      "Before WakaMate, I was wasting so much time figuring out delivery routes. Now I just ask the AI, and it gives me the fastest path. I save fuel and reach more customers in less time!",
    name: "Chinedu Okafor",
    title: "Market Vendor",
    company: "Alaba Market",
    hasReadMore: true,
  },
  {
    id: 5,
    logo: "📦",
    logoColor: "bg-yellow-400",
    logoTextColor: "text-black",
    quote:
      "WakaMate’s Trade Assistant helped me realize I was restocking too early and losing money. Now I know exactly when to restock and how much profit I’m making every week.",
    name: "Maryam Bello",
    title: "Small Business Owner",
    company: "Maryam’s Provisions",
    hasReadMore: true,
  },
  {
    id: 6,
    logo: "🚴‍♂️",
    logoColor: "bg-blue-500",
    logoTextColor: "text-white",
    quote:
      "As a delivery rider, the AI has been a lifesaver. No more confusion with multiple drop-offs. The route planner makes my work smoother and stress-free.",
    name: "Samuel Adeyemi",
    title: "Logistics Partner",
    company: "Lagos Delivery Hub",
    hasReadMore: true,
  },
];


  useEffect(() => {
    const interval = setInterval(() => {
      setTranslateX(prev => {
        const cardWidth = 384 + 32; // w-96 (384px) + mx-4 (32px)
        const maxTranslate = -(cardWidth * 3); // Half of the testimonials
        const newTranslate = prev - 1;
        return newTranslate <= maxTranslate ? 0 : newTranslate;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900 pt-16 pb-30 overflow-hidden">
        <div className='text-white'>
           <motion.div
            initial={{ opacity: 0, x: -120 }}
            whileInView={{ opacity: 1, x: 0}}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}>
           <h1 className='text-7xl text-start pl-10 uppercase  my-10'>What Our <br /> <span className='ml-15'>Users Say</span> </h1>
          </motion.div>
        </div>
      <div className="relative">
        {/* Continuous sliding container */}
        <div 
          className="flex transition-transform duration-75 ease-linear"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex-shrink-0 w-96 mt-9 mx-4 bg-zinc-800 rounded-2xl p-8 text-white relative group hover:bg-zinc-700 transition-colors duration-300"
            >
              {/* Logo */}
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${testimonial.logoColor}`}>
                  {testimonial.logo === "B" ? (
                    <span className="text-white font-bold text-xl">B</span>
                  ) : (
                    <span className={`font-bold text-xs ${testimonial.logoTextColor || 'text-white'}`}>
                      {testimonial.logo}
                    </span>
                  )}
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              {/* Quote */}
              <div className="mb-8">
                <p className="text-lg leading-relaxed mb-6">
                  {testimonial.quote}
                </p>
                
                {testimonial.hasReadMore && (
                  <button className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    <span className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center mr-2 text-xs">
                      +
                    </span>
                    READ MORE
                  </button>
                )}
              </div>

              {/* Author info */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="font-semibold text-lg mb-1">{testimonial.name}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {testimonial.title}
                </p>
                <p className="text-gray-400 text-sm">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
