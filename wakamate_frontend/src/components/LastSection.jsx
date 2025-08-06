import React from 'react';

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of Nigerian vendors growing their businesses with WakaMate AI
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 rounded-full bg-white text-purple-600 font-medium hover:bg-purple-50 transition">
            Download Now
          </button>
          <button className="px-8 py-3 rounded-full bg-transparent text-white font-medium border border-white hover:bg-white/10 transition">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;