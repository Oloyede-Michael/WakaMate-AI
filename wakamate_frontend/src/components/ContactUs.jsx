import React from 'react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-secondary max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Have questions? Our team is here to help
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-30">
          <div>
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-gray-700 dark:text-gray-300">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-neutral-500 dark:border-neutral-600"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-neutral-500  dark:border-neutral-600"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 text-gray-700 dark:text-gray-300">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-neutral-500  dark:border-neutral-600"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn-primary px-6 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 dark:bg-purple-900/30">
                  <i className="fas fa-map-marker-alt text-purple-600"></i>
                </div>
                <div>
                  <h4 className="font-medium">Address</h4>
                  <p className="text-gray-600 dark:text-gray-300">123 Business Avenue, Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 dark:bg-blue-900/30">
                  <i className="fas fa-envelope text-blue-600"></i>
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600 dark:text-gray-300">support@wakamate.ai</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 dark:bg-green-900/30">
                  <i className="fas fa-phone-alt text-green-600"></i>
                </div>
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-gray-600 dark:text-gray-300">+234 800 123 4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;