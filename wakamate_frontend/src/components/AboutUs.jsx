import React from 'react';

const TeamAboutPage = () => {
  return (
    <div className="font-sans antialiased text-gray-800">
      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .wave-shape {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }
        .wave-shape svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 150px;
        }
        .wave-shape .shape-fill {
          fill: #FFFFFF;
        }
        .rotate-180 {
          transform: rotate(180deg);
        }
      `}</style>

      {/* Hero Section */}
      <div className="gradient-bg text-white relative">
        <div className="container mx-auto px-6 py-24 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Our Team</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We're a passionate group of creatives, developers, and strategists dedicated to building amazing digital experiences.
          </p>
          <div className="mt-12">
            <a 
              href="#team" 
              className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 inline-block"
            >
              Meet the Team
            </a>
          </div>
        </div>
        <div className="wave-shape">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2025, we started as a small team of five friends with a shared vision to create digital solutions that make a difference. What began in a university has now grown into a thriving startup with unlimited potential.
              </p>
              <p className="text-gray-600 mb-4">
                We believe in the power of collaboration, creativity, and cutting-edge technology to solve complex problems. Our approach combines strategic thinking with beautiful design and robust engineering.
              </p>
              <p className="text-gray-600">
                Today, we've worked with over 200 clients worldwide, delivering projects that range from mobile apps to enterprise software solutions.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-100 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Team working together" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-lightbulb text-indigo-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">We constantly push boundaries and explore new ideas to deliver cutting-edge solutions.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-users text-indigo-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
              <p className="text-gray-600">Great things happen when diverse minds work together towards a common goal.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300">
              <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-heart text-indigo-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Passion</h3>
              <p className="text-gray-600">We love what we do, and that enthusiasm shines through in every project we undertake.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div id="team" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">Meet Our Team</h2>
          
          {/* Top Row - 3 members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Team Member 1 */}
            <div className="team-card bg-white rounded-xl overflow-hidden shadow-md transition duration-500 ease-in-out">
              <div className="relative">
                <img 
                  src="/images/michael.jpg"
                  alt="Micheal Oloyede" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white text-xl font-bold">Micheal Oloyede</h3>
                  <p className="text-indigo-200">Team lead & Full stack Developer</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Visionary leader with 3+years of experience in digital transformation and business strategy.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-linkedin"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-github"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fas fa-envelope"></i></a>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="team-card bg-white rounded-xl overflow-hidden shadow-md transition duration-500 ease-in-out">
              <div className="relative">
                <img 
                  src="/images/wura.jpg" 
                  alt="Omilabu Wuraola" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white text-xl font-bold">Omilabu Wuraola</h3>
                  <p className="text-indigo-200">Front-end Developer</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Tech wizard specializing in scalable architectures and emerging technologies.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-linkedin"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-github"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fas fa-envelope"></i></a>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="team-card bg-white rounded-xl overflow-hidden shadow-md transition duration-500 ease-in-out">
              <div className="relative">
                <img 
                  src="/images/dani.jpg"
                  alt="Abibi Daniella" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white text-xl font-bold">Abibi Daniella</h3>
                  <p className="text-indigo-200">Backend Developer</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Award-winning designer with a passion for creating memorable brand experiences.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-linkedin"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-github"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fas fa-envelope"></i></a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - 3 members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 4 */}
            <div className="team-card bg-white rounded-xl overflow-hidden shadow-md transition duration-500 ease-in-out">
              <div className="relative">
                <img 
                  src="/images/raphael.jpg"
                  alt="Eniaiyejuni Raphael" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white text-xl font-bold">Eniaiyejuni Raphael</h3>
                  <p className="text-indigo-200">AI/ML Engineer</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Full-stack developer with expertise in JavaScript frameworks and cloud technologies.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-linkedin"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-github"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fas fa-envelope"></i></a>
                </div>
              </div>
            </div>

            {/* Team Member 5 */}
            <div className="team-card bg-white rounded-xl overflow-hidden shadow-md transition duration-500 ease-in-out">
              <div className="relative">
                <img 
                  src="/images/dami.jpg"
                  alt="Emmanuel Damilola" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white text-xl font-bold">Emmanuel Damilola</h3>
                  <p className="text-indigo-200">Product Designer</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Strategic marketing expert with a passion for building brand awareness and driving growth.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-linkedin"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fas fa-envelope"></i></a>
                </div>
              </div>
            </div>
            
            {/* Team Member 6 */}
            <div className="team-card bg-white rounded-xl overflow-hidden shadow-md transition duration-500 ease-in-out">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                  alt="Joseph Bassey " 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white text-xl font-bold">Joseph Bassey</h3>
                  <p className="text-indigo-200">Designer</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Infrastructure specialist focused on scalable cloud solutions and automation.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-linkedin"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fab fa-github"></i></a>
                  <a href="#" className="text-gray-500 hover:text-indigo-600 transition"><i className="fas fa-envelope"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Us CTA */}
      <div className="gradient-bg text-white py-20 relative">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to Join Our Team?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10">
            We're always looking for talented individuals to join our growing family. Check out our current openings.
          </p>
          <a 
            href="#" 
            className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 inline-block"
          >
            View Open Positions
          </a>
        </div>
        <div className="wave-shape rotate-180">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TeamAboutPage;