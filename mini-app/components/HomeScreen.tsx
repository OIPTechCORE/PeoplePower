import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export const HomeScreen: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">People Power Journey</h1>
          <p className="text-gray-300">Please authenticate to continue</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-900 min-h-screen"
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome, {user?.firstName || 'Player'}!
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Stats</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Level:</span>
              <span className="font-semibold">1</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Power Tokens:</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Influence:</span>
              <span className="font-semibold">0</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Start Journey
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            View Story
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
