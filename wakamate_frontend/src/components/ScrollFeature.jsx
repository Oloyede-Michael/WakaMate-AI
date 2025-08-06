import React, { useEffect } from "react";

const featuresRow1 = [
  { icon: "🤖", title: "Smart Route Planning", desc: "AI-powered delivery route optimization that saves time and fuel costs for Nigerian vendors." },
  { icon: "📊", title: "Inventory Management", desc: "Track stock levels, predict demand, and get alerts when items are running low." },
  { icon: "🔁", title: "Caption Generator", desc: "Create engaging social media captions that attract customers and boost sales." },
  { icon: "🧠", title: "Financial Tracking", desc: "Monitor expenses, revenue, and profit margins with intelligent financial insights." },
];

const featuresRow2 = [
  { icon: "🎙️", title: "Voice Commands", desc: "Hands-free operation while managing your business on the go." },
  { icon: "🖼️", title: "Product Analytics", desc: "Visual analysis of your best-selling products and customer preferences." },
  { icon: "⚠️", title: "Market Insights", desc: "Real-time market trends and pricing recommendations for competitive advantage." },
  { icon: "📁", title: "Customer Management", desc: "Keep track of customer preferences, orders, and communication history." },
];

const featuresRow3 = [
  { icon: "🔐", title: "Secure Data", desc: "Your business data is encrypted and protected with enterprise-grade security." },
  { icon: "📱", title: "Mobile First", desc: "Designed specifically for mobile use by busy Nigerian entrepreneurs." },
  { icon: "🎯", title: "Personalized AI", desc: "AI learns your business patterns to provide increasingly relevant suggestions." },
  { icon: "🌍", title: "Offline Support", desc: "Core features work offline, syncing when you have internet connection." },
];

const Feature = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }

      @keyframes scrollLeft {
        0% { transform: translateX(0); }
        100% { transform: translateX(-100%); }
      }

      @keyframes scrollRight {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(0); }
      }

      .carousel-track {
        width: max-content;
      }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const track = entry.target.querySelector(".carousel-track");
        if (track) {
          track.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
        }
      });
    }, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    document.querySelectorAll(".carousel-row").forEach((row) => observer.observe(row));

    return () => {
      document.querySelectorAll(".carousel-row").forEach((row) => observer.unobserve(row));
    };
  }, []);

  const handleRipple = (e) => {
    const card = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(147, 51, 234, 0.3);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      animation: ripple 0.8s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;

    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  };

  const renderRow = (data, direction = 'left', slower = false) => (
    <div className="carousel-row relative overflow-hidden w-full mb-8">
      <div
        className="carousel-track flex gap-6"
        style={{
          animation: `${direction === "left" ? "scrollLeft" : "scrollRight"} ${slower ? "50s" : "30s"} linear infinite`,
          width: `${(data.length * 2) * 260}px`
        }}
      >
        {[...data, ...data, ...data].map((item, i) => (
          <div
            key={i}
            onClick={handleRipple}
            className="flex-shrink-0 w-[240px] h-[220px] p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{item.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced gradient fade sides */}
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
    </div>
  );

  return (
    <div className="w-full px-6 md:px-12 py-16 bg-white overflow-hidden">
      <h1 className="text-4xl md:text-5xl font-black mb-16 text-center text-black">
        Benefits of <span className="text-green-500">WakaMate AI</span>
      </h1>
      {renderRow(featuresRow1, "left")}
      {renderRow(featuresRow2, "right")}
      {renderRow(featuresRow3, "left", true)}
    </div>
  );
};

export default Feature;