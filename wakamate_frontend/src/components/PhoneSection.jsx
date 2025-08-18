"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, BarChart3, MessageSquare } from "lucide-react";

// 📱 Phone Display with Smooth Animation
function AnimatedPhone({ feature }) {
  const featureContent = {
    delivery: {
      icon: <MapPin className="h-12 w-12 text-blue-500" />,
      text: "Optimized Route",
      bgColor: "bg-blue-50",
    },
    trade: {
      icon: <BarChart3 className="h-12 w-12 text-emerald-500" />,
      text: "Price Analytics",
      bgColor: "bg-emerald-50",
    },
    caption: {
      icon: <MessageSquare className="h-12 w-12 text-purple-500" />,
      text: "New Caption!",
      bgColor: "bg-purple-50",
    },
  };

  const currentContent = featureContent[feature];
  if (!currentContent) return null;

  return (
    <motion.div
      className={`w-58 h-106 rounded-3xl flex items-center justify-center shadow-xl border-4 border-green-500 overflow-hidden`}
      // ✅ smooth background color transition
      animate={{ backgroundColor: getTailwindColor(currentContent.bgColor) }}
        initial={{ opacity: 0, scale: -0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={feature} // ensures exit/enter animation triggers
          className="flex flex-col items-center  justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {currentContent.icon}
          <p className="mt-4 text-lg font-semibold   text-white">
            {currentContent.text}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// 🛠 Helper: Map Tailwind bg colors → real hex codes for framer-motion
function getTailwindColor(colorClass) {
  const map = {
    "bg-blue-50": "#00000",
    "bg-emerald-50": "#00000",
    "bg-purple-50": "#00000",
  };
  return map[colorClass] || "#00000";
}

// 📌 Main Section
export default function PhoneSection() {
  const [currentFeature, setCurrentFeature] = useState("delivery");

  const features = [
    {
      id: "delivery",
      title: "Smart Delivery",
      description: "Plan optimized routes and deliver faster.",
      color: "green",
      icon: MapPin,
    },
    {
      id: "trade",
      title: "Smart Trade",
      description: "Track prices, analyze trends, and boost sales.",
      color: "green",
      icon: BarChart3,
    },
    {
      id: "caption",
      title: "AI Caption",
      description: "Generate engaging captions instantly.",
      color: "green",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-25 md:gap-0 justify-center   items-center">
      {/* Phone Animation */}
      <motion.div
        className="relative md:flex-col flex justify-center h-96 md:pl-50 pl-0 "
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <AnimatedPhone feature={currentFeature} />
      </motion.div>

      {/* Features List */}
      <div className="space-y-8 md:mr-30 ">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isActive = currentFeature === feature.id;

          return (
            <motion.div
              key={feature.id}
              className={`p-6 rounded-xl  transition-all duration-500 cursor-pointer ${
                isActive
                  ? `border-${feature.color}-500 bg-${feature.color}-50 shadow-lg`
                  : "border-zinc-700  border-4 hover:border-green-500 bg-zinc-700"
              }`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setCurrentFeature(feature.id)}
            >
              <div className="flex  items-start gap-4">
                <div className={`p-3  rounded-lg bg-${feature.color}-100`}>
                  <Icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl  font-bold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-black leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
