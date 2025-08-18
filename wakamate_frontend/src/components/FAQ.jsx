import React, { useState } from "react";
import { motion } from "framer-motion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is WakaMate AI?",
      answer:
        "WakaMate is a smart assistant designed for vendors, riders, and small business owners. It helps you plan delivery routes, track and restock inventory, calculate profit and loss, and even generate social media captions to promote your business.",
    },
    {
      question: "Who can use WakaMate?",
      answer:
        "Anyone running a small or growing business can use it — market sellers, delivery vendors, food suppliers, riders, and even online sellers who deliver to customers.",
    },
    {
      question: "How does the Delivery Assistant work?",
      answer:
        "You simply tell WakaMate the locations you want to deliver to, and it calculates the fastest and most cost-effective route. This saves you time, fuel, and stress.",
    },
    {
      question: "What can the Trade Assistant do for me?",
      answer:
        "The Trade Assistant tracks your stock, suggests when to restock based on sales patterns, and shows you if you’re making profit or loss. It also gives tips on how to increase profit and cut losses.",
    },
    {
      question: "How does the AI Captions feature work?",
      answer:
        "You tell WakaMate what you’re selling or promoting, and it instantly generates engaging captions you can post on WhatsApp, Instagram, or Facebook to attract more customers.",
    },
    {
      question: "Do I need technical knowledge to use WakaMate?",
      answer:
        "Not at all. WakaMate is designed to be as simple as chatting with a friend. You type in your question or task, and the AI gives you clear answers.",
    },
    {
      question: "How do I get started?",
      answer:
        "Just sign up, create an account, and start chatting with the AI. No setup or complicated process required.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-10 pb-20 my-10 rounded-4xl bg-green-500">
      <div className="flex flex-col md:flex-row justify-between ">
        <div>
          <h1 className="md:text-8xl text-5xl text-black text-start pl-10 uppercase my-10">
            FAQ
          </h1>
          <h2 className="pl-10 w-100">
            Got any question?, We've got answer! In this section we address the
            most inquiries about Wakamate AI.
          </h2>
        </div>

        {/* FAQ List */}
        <div className="p-4  md:w-[55%] pt-25">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4 border rounded-xl shadow-md p-4 bg-white/80"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }} // 👈 stagger effect
            >
              {/* Question */}
              <button
                className="flex justify-between w-full text-left font-semibold text-lg"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span>{openIndex === index ? "-" : "+"}</span>
              </button>

              {/* Answer with transition */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "max-h-40 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
