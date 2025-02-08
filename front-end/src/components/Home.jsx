import React from 'react';
import Navbar from './Navbar';
import image from "./image.webp";
import hand from "./hand.jpg"
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { FaHandsHelping, FaComments, FaCheckCircle, FaUserPlus } from 'react-icons/fa';
const Home = () => {
    const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-purple-800 animate-slide-up">
              Empowering Women
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed animate-slide-up delay-100">
              "When women rise, we all rise. Progress in women's development isn't just about equality – it's about unleashing the full potential of humanity. Every step forward for women is a leap forward for society."
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full 
              transform transition duration-300 hover:scale-105 animate-bounce">
              Learn More
            </button>
          </div>
          <div className="md:w-1/2 animate-fade-in delay-200">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl transform transition duration-300 hover:scale-105">
              <img
                src={image}
                alt="Women in leadership"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
            </div>
          </div>

        </div>
      </main>
      <div className="absolute bottom-12 right-12 animate-float">
  <Link to="/chatbot">
    <div className="relative w-16 h-16 rounded-full overflow-hidden">
      <img 
        src={hand} 
        alt="Hand illustration" 
        className="w-full h-full object-cover" 
      />
      <button
      onClick={()=>navigate('/chatbot')}
      >
        <span>+</span>
      </button>
    </div>
  </Link>
</div>
<div className="flex flex-wrap justify-around items-center gap-6 p-6">
      <div className="flex flex-col items-center cursor-pointer justify-center p-4 border rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
        <FaHandsHelping className="text-4xl text-purple-600 mb-2" />
        <span className="font-semibold text-lg" onClick={()=>navigate('/home/vol-req')}>Volunteer Request</span>
      </div>
      <div className="flex flex-col items-center cursor-pointer justify-center p-4 border rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
        <FaComments className="text-4xl text-green-600 mb-2" />
        <span className="font-semibold text-lg" onClick={()=>navigate('/home/discussion_forum')}>Discussion Forum</span>
      </div>
      <div className="flex flex-col items-center cursor-pointer justify-center p-4 border rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
        <FaCheckCircle className="text-4xl text-blue-600 mb-2" />
        <span className="font-semibold text-lg" onClick={()=>navigate('/home/link-verify')}>Link Verification</span>
      </div>
      <div className="flex flex-col items-center cursor-pointer justify-center p-4 border rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
        <FaUserPlus className="text-4xl text-red-600 mb-2" />
        <span className="font-semibold text-lg" onClick={()=>navigate('/home/vol')}>Volunteering</span>
      </div>
    </div>
    </div>
  );
};
export default Home;
const style = {
  ["@keyframes slide-up"]: {
    "0%": { transform: "translateY(100px)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" }
  },
  ["@keyframes fade-in"]: {
    "0%": { opacity: "0" },
    "100%": { opacity: "1" }
  },
  ["@keyframes float"]: {
    "0%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-15px)" },
    "100%": { transform: "translateY(0)" }
  }
};
