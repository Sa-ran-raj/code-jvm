import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from "./AuthProvider";

const RuralSupportPlatform = () => {
  const { loginWithGoogle } = useAuth();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.2 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Rural Support Hub</h1>
            <button
              onClick={loginWithGoogle}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Empowering Rural Communities
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            whileHover={hoverScale}
            {...fadeInUp}
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-3">Rural Schemes</h3>
            <p className="text-gray-600">Access government programs and financial support for agriculture, housing, and education.</p>
            <motion.button 
              className="mt-4 flex items-center text-green-600 hover:text-green-700"
              whileHover={{ x: 5 }}
            >
              Explore <span className="ml-2">→</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            whileHover={hoverScale}
            {...fadeInUp}
          >
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">AI Assistant</h3>
            <p className="text-gray-600">Get instant guidance on schemes and application processes through our AI helper.</p>
            <motion.button 
              className="mt-4 flex items-center text-blue-600 hover:text-blue-700"
              whileHover={{ x: 5 }}
            >
              Chat Now <span className="ml-2">→</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            whileHover={hoverScale}
            {...fadeInUp}
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-3">Volunteer Support</h3>
            <p className="text-gray-600">Connect with local volunteers for personalized assistance and guidance.</p>
            <motion.button 
              className="mt-4 flex items-center text-purple-600 hover:text-purple-700"
              whileHover={{ x: 5 }}
            >
              Connect <span className="ml-2">→</span>
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default RuralSupportPlatform;