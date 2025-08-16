import React, { useState, useEffect } from 'react';

const HeroBanner = ({ isDarkMode }) => {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const phrases = [
    'AI assistant companion',
    'Business growth partner', 
    'Smart vendor helper',
    'Digital business advisor'
  ];

  // Typing animation effect
  useEffect(() => {
    const currentPhrase = phrases[currentIndex];
    
    if (isTyping) {
      if (typedText.length < currentPhrase.length) {
        const timeout = setTimeout(() => {
          setTypedText(currentPhrase.slice(0, typedText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (typedText.length > 0) {
        const timeout = setTimeout(() => {
          setTypedText(typedText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
        setIsTyping(true);
      }
    }
  }, [typedText, isTyping, currentIndex, phrases]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-green-900/20' 
        : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'
    }`}>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-bounce ${
              isDarkMode ? 'bg-green-400/20' : 'bg-green-500/10'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Interactive Glow Effect */}
      <div 
        className="absolute pointer-events-none transition-all duration-300"
        style={{
          left: mousePosition.x - 250,
          top: mousePosition.y - 250,
          width: '500px',
          height: '500px',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-20 w-16 h-16 rotate-45 animate-spin transition-all duration-500 ${
          isDarkMode ? 'bg-gradient-to-br from-green-400/20 to-emerald-500/20' : 'bg-gradient-to-br from-green-200/40 to-emerald-300/40'
        }`} style={{ animationDuration: '20s' }}></div>
        
        <div className={`absolute top-32 right-32 w-12 h-12 rounded-full animate-pulse transition-all duration-500 ${
          isDarkMode ? 'bg-gradient-to-br from-purple-400/20 to-pink-500/20' : 'bg-gradient-to-br from-purple-200/40 to-pink-300/40'
        }`}></div>
        
        <div className={`absolute bottom-32 left-32 w-20 h-20 rounded-full animate-bounce transition-all duration-500 ${
          isDarkMode ? 'bg-gradient-to-br from-blue-400/20 to-cyan-500/20' : 'bg-gradient-to-br from-blue-200/40 to-cyan-300/40'
        }`} style={{ animationDuration: '3s' }}></div>
        
        <div className={`absolute bottom-20 right-20 w-14 h-14 rotate-12 animate-spin transition-all duration-500 ${
          isDarkMode ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20' : 'bg-gradient-to-br from-yellow-200/40 to-orange-300/40'
        }`} style={{ animationDuration: '15s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        
        {/* Animated Badge */}
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-sm mb-8 animate-pulse transition-all duration-500 ${
          isDarkMode ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-white/30'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-ping ${
            isDarkMode ? 'bg-green-400' : 'bg-green-500'  
          }`}></div>
          <span className={`text-sm font-medium transition-colors duration-500 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            🚀 Now Powered by Advanced AI
          </span>
        </div>

        {/* Main Heading with Gradient Text */}
        <h1 className={`text-5xl md:text-7xl font-black leading-tight mb-6 transition-colors duration-500 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <span className="block">WakaMate</span>
          <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent">
            AI
          </span>
        </h1>

        {/* Dynamic Typing Subtitle */}
        <div className="h-20 flex items-center justify-center mb-8">
          <h2 className={`text-2xl md:text-4xl font-bold transition-colors duration-500 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Your{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                {typedText}
              </span>
              <span className={`animate-blink text-3xl ${
                isDarkMode ? 'text-green-400' : 'text-green-500'
              }`}>
                |
              </span>
            </span>
          </h2>
        </div>

        {/* Description */}
        <p className={`text-xl md:text-2xl font-medium mb-12 max-w-4xl mx-auto leading-relaxed transition-colors duration-500 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Revolutionize your small business with AI-powered insights, automation, and growth strategies.
          <span className="block mt-2 text-lg opacity-80">
            Take the first step into the future of business intelligence.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="group relative px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/40">
            <span className="relative z-10 flex items-center space-x-2">
              <span>🚀</span>
              <span>Start Your Journey</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          <button className={`group px-8 py-4 border-2 font-bold text-lg rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105 ${
            isDarkMode 
              ? 'border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-400 hover:bg-green-400/5'
              : 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50'
          }`}>
            <span className="flex items-center space-x-2">
              <span>▶️</span>
              <span>Watch Demo</span>
            </span>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: '🤖', title: 'AI-Powered', desc: 'Smart automation for your business' },
            { icon: '📈', title: 'Growth Focus', desc: 'Strategies that drive real results' },
            { icon: '🔒', title: 'Secure & Private', desc: 'Your data stays protected' }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`group p-6 rounded-2xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                isDarkMode 
                  ? 'bg-gray-800/20 border-gray-700/30 hover:bg-gray-700/30 hover:border-green-500/50'
                  : 'bg-white/20 border-gray-200/30 hover:bg-white/40 hover:border-green-500/50'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className={`font-bold text-lg mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm transition-colors duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className={`w-6 h-10 border-2 rounded-full flex justify-center transition-colors duration-500 ${
            isDarkMode ? 'border-gray-400' : 'border-gray-500'
          }`}>
            <div className={`w-1 h-3 rounded-full mt-2 animate-pulse transition-colors duration-500 ${
              isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Custom CSS for blinking cursor */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;