import { useState } from 'react';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!formData.terms) {
      alert('Please accept the terms and conditions');
      return;
    }
    
    alert('Account created successfully! (This is a demo)');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
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
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="relative h-40 sm:h-48 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
          <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce">
              <i className="fas fa-user-plus text-2xl sm:text-3xl text-indigo-600"></i>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center px-4">
            Get Started by creating your account
          </h1>
        </div>
        
        {/* Form Section */}
        <div className="pt-12 sm:pt-16 px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FloatingInput
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <FloatingInput
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
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
            
            {/* Confirm Password Field */}
            <FloatingInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />
            
            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
                className="w-4 h-4 mt-1 text-indigo-600 rounded focus:ring-indigo-500 focus:ring-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 hover:underline font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 hover:underline font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Account
            </button>
            
            {/* Sign In Link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 font-semibold hover:underline">
                Sign In
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