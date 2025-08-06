import React from 'react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How WakaMate AI Works</h2>
          <p className="text-secondary max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Get started in just a few simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6 dark:bg-purple-900/30">
              <span className="text-purple-600 font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create an account & Sign In</h3>
            <p className="text-secondary text-gray-600 dark:text-gray-300">
              create your account in minutes and get fast access to these amazing features.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 dark:bg-blue-900/30">
              <span className="text-blue-600 font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Set Up Your Business</h3>
            <p className="text-secondary text-gray-600 dark:text-gray-300">
              Add your products, suppliers, and delivery areas to customize your experience.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 dark:bg-green-900/30">
              <span className="text-green-600 font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Start Growing</h3>
            <p className="text-secondary text-gray-600 dark:text-gray-300">
              Use WakaMate's AI tools to optimize your operations and increase profits.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="btn-primary px-8 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition">
            Watch Full Tutorial <i className="fas fa-play-circle ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
