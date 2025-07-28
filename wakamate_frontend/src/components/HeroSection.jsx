import React from 'react';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-primary text-purple-600">AI-Powered</span> Business Assistant for Nigerian Vendors
          </h1>
          <p className="text-secondary text-lg text-gray-600 mb-8 dark:text-gray-300">
            WakaMate AI helps small vendors in Nigeria plan smarter delivery routes, manage inventory, create engaging captions, and track finances — all in one easy-to-use app.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary px-8 py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition">
              Download Now
            </button>
            <button className="btn-secondary px-8 py-3 rounded-full bg-white text-gray-800 font-medium border border-gray-300 hover:bg-gray-700 transition dark:bg-gray-800 dark:text-white dark:border-gray-700">
              Start Trial <i className="fas fa-play-circle ml-2"></i>
            </button>
          </div>
          <div className="mt-8 flex items-center space-x-4">
            <div className="flex -space-x-2">
              <img src="https://randomuser.me/api/portraits/women/12.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
              <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
              <img src="https://randomuser.me/api/portraits/women/45.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
            </div>
            <div>
              <p className="text-sm font-medium">Trusted by 5,000+ vendors</p>
              <div className="flex text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
                <span className="text-gray-600 ml-2 dark:text-gray-300">4.8 (1.2k reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="floating">
            <img
              src="https://cdn.dribbble.com/users/1787505/screenshots/14137146/media/82b0a1a7f7e4d9f5d6c0d.png"
              alt="WakaMate App"
              className="w-full max-w-md mx-auto"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-100 rounded-full -z-10 dark:bg-purple-900/30"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-100 rounded-full -z-10 dark:bg-yellow-900/30"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
