import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: 'Welcome to People Power',
      description: 'A journey of leadership, community, and transformation through the power of collective action.',
    },
    {
      title: 'Build Your Influence',
      description: 'Complete missions, grow your network, and become a leader in your community.',
    },
    {
      title: 'Earn Real Rewards',
      description: 'Power tokens have real value. Earn, trade, and use them within the ecosystem.',
    },
    {
      title: 'Join the Movement',
      description: 'Be part of Africa\'s largest digital community dedicated to positive change.',
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Progress indicators */}
        <div className="flex justify-center mb-8 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-blue-500'
                  : index < currentStep
                  ? 'bg-blue-300'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-300 text-center leading-relaxed">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4">
          {currentStep > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevStep}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Previous
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStep}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </motion.button>
        </div>

        {/* Skip option */}
        {currentStep < steps.length - 1 && (
          <button
            onClick={onComplete}
            className="mt-4 text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            Skip onboarding
          </button>
        )}
      </motion.div>
    </div>
  );
};
