import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields!');
      return;
    }
    
    alert('Login successful! (This is a demo)');
    setFormData({
      email: '',
      password: '',
      rememberMe: false
    });
  };

  const FloatingInput = ({ 
    id, 
    name, 
    type, 
    label, 
    value, 
    onChange, 
    required = false, 
    icon = null,
    showPassword = null,
    onTogglePassword = null 
  }) => (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent peer transition-all duration-300"
        placeholder=" "
        required={required}
      />
      <label 
        htmlFor={id}
        className={`absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-300 origin-left ${
          value ? 'transform -translate-y-6 scale-85 text-indigo-600' : ''
        } peer-focus:transform peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-indigo-600`}
      >
        {label}
      </label>
      {icon && (
        <div className="absolute right-3 top-3 text-gray-400">
          <i className={icon}></i>
        </div>
      )}
      {onTogglePassword && (
        <div 
          onClick={onTogglePassword}
          className="absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors duration-300"
        >
          <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="relative h-40 sm:h-48 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
          <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
              <i className="fas fa-sign-in-alt text-2xl sm:text-3xl text-indigo-600"></i>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center px-4">
            Welcome Back
          </h1>
        </div>
        
        {/* Form Section */}
        <div className="pt-12 sm:pt-16 px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <FloatingInput
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              icon="fas fa-envelope"
            />
            
            {/* Password Field */}
            <FloatingInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 focus:ring-2"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-indigo-600 hover:underline font-medium">
                Forgot Password?
              </a>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign In
            </button>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            {/* Social Buttons */}
            <div className="space-y-3">
                 {/* Google Login */}
                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700 font-medium">Continue with Google</span>
                </button>
            </div>
           
            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="text-indigo-600 font-semibold hover:underline">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Font Awesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
      />
    </div>
  );
}