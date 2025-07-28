import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "What is WakaMateAI?",
    answer:
      "WakaMateAI is an AI-powered delivery, logistics, and management tool designed specifically for small business owners. It helps optimize delivery routes, manage logistics, and streamline operations to save time and reduce costs.",
  },
  {
    question: "Is WakaMate AI free to use?",
    answer:
      "Yes, our core features are free for small business owners. Premium tools coming soon.",
  },
  {
    question: "Does it work on my small phone?",
    answer:
      "Yes! WakaMate AI is web-application for now but it works great on low-end devices.",
  },
  {
    question: "Is my business data secure?",
    answer:
      "Absolutely. We use bank-level encryption and never share your data with third parties. Your business information stays private.",
  },
  {
    question: "How does WakaMate AI help with delivery routes?",
    answer:
      "Our AI analyzes traffic patterns, delivery locations, and vehicle capacity to create the most efficient routes, saving you time and fuel costs. It also learns from your feedback to continuously improve its suggestions.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold mb-10 text-black font-black tracking-tight">
          Frequently Asked <span className="text-purple-600">Questions</span>
        </h2>
        <div className="divide-y divide-violet-200">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              className="py-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex justify-between items-center font-medium text-lg text-black focus:outline-none cursor-pointer hover:text-purple-600 transition-colors duration-200"
              >
                {faq.question}
                <motion.span
                  className="text-xl font-bold ml-4 cursor-pointer"
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 text-base text-gray-800 font-light"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;