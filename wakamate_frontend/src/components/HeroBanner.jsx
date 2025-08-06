import React from 'react';

const HeroBanner = () => {
  return (
    <section className="py-20 px-6 bg-green-100 dark:bg-green-900/30">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-800 dark:text-white">
            WakaMate AI is a AI assistant companion that helps small scale vendors
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium mb-12">
            Take the First Step into AI powered Business Revolution
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <button className="px-8 py-4 rounded-full bg-green-500 text-white font-medium text-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
            Check it Out
          </button>
        </div>

        {/* Decorative elements */}
        <div className="relative">
          <div className="absolute -top-16 left-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-60 dark:bg-purple-700/40"></div>
          <div className="absolute -top-8 right-1/3 w-12 h-12 bg-pink-200 rounded-full opacity-50 dark:bg-pink-700/40"></div>
          <div className="absolute -bottom-8 left-1/3 w-20 h-20 bg-blue-200 rounded-full opacity-40 dark:bg-blue-700/40"></div>
          <div className="absolute -bottom-4 right-1/4 w-8 h-8 bg-purple-300 rounded-full opacity-70 dark:bg-purple-600/40"></div>
        </div>

        {/* Subtle breathing animation for the main content */}
        <div className="mt-8 opacity-80">
          <div className="inline-block animate-pulse">
            <div className="w-2 h-2 bg-purple-400 rounded-full mx-1 inline-block"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full mx-1 inline-block" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full mx-1 inline-block" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;