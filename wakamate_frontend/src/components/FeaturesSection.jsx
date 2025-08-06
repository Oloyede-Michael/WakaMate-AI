import React from 'react';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Your <span className="text-green-500">Business</span>
          </h2>
          <p className="text-secondary max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            WakaMate AI provides everything you need to grow your business efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="card p-6 rounded-xl shadow-sm bg-gray-100 border-2 border-gray-300 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-gray-400 dark:border-gray-700 dark:hover:border-green-500 group cursor-pointer">
            <div className="feature-icon w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-route text-purple-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-green-500 transition-colors duration-300">Smart Route Planning</h3>
            <p className="text-secondary text-gray-600 dark:text-gray-300">
              AI-powered delivery route optimization to save time and fuel costs.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card p-6 rounded-xl shadow-sm bg-gray-100 border-2 border-gray-300 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-gray-400 dark:border-gray-700 dark:hover:border-green-500 group cursor-pointer">
            <div className="feature-icon w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-boxes text-purple-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors duration-300">Inventory Management</h3>
            <p className="text-secondary text-gray-600 dark:text-gray-300">
              Track stock levels, get restock alerts, and manage suppliers easily.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card p-6 rounded-xl shadow-sm bg-gray-100 border-2 border-gray-300 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-gray-400 dark:border-gray-700 dark:hover:border-green-500 group cursor-pointer">
            <div className="feature-icon w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-comment-dots text-purple-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors duration-300">Caption Generator</h3>
            <p className="text-secondary text-gray-600 dark:text-gray-300">
              Create engaging social media captions to boost your online sales.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card p-6 rounded-xl shadow-sm bg-gray-100 border-2 border-gray-300 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-gray-400 dark:border-gray-700 dark:hover:border-green-500 group cursor-pointer">
            <div className="feature-icon w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-chart-line text-purple-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors duration-300">Profit Tracking</h3>
            <p className="text-secondary text-gray-600 dark:text-gray-300">
              Simple profit & loss reports to help you understand your business finances.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;