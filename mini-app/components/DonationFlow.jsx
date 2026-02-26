import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, CreditCard, Calendar, Users, Globe, Shield,
  CheckCircle, AlertCircle, Lock, Eye, EyeOff,
  ArrowRight, Sparkles, Gift, Target
} from 'lucide-react';

const DonationFlow = ({ charity, onClose }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PWR_TOKEN');
  const [cause, setCause] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('MONTHLY');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const predefinedAmounts = [10, 25, 50, 100, 250, 500, 1000];
  const causes = [
    { id: 'EDUCATION', name: 'Education', icon: '🎓', color: 'blue' },
    { id: 'HEALTHCARE', name: 'Healthcare', icon: '🏥', color: 'green' },
    { id: 'ENVIRONMENT', name: 'Environment', icon: '🌍', color: 'emerald' },
    { id: 'POVERTY', name: 'Poverty', icon: '🤝', color: 'orange' }
  ];

  const frequencies = [
    { id: 'WEEKLY', name: 'Weekly', multiplier: 4.33 },
    { id: 'MONTHLY', name: 'Monthly', multiplier: 1 },
    { id: 'QUARTERLY', name: 'Quarterly', multiplier: 0.33 },
    { id: 'YEARLY', name: 'Yearly', multiplier: 0.083 }
  ];

  const getImpactDescription = (amount, causeCategory) => {
    const impacts = {
      'EDUCATION': {
        10: 'Provides school supplies for 1 student',
        50: 'Funds 1 week of education for 1 student',
        100: 'Provides 1 month of education for 1 student',
        500: 'Funds 1 semester of education for 1 student',
        1000: 'Provides 1 year of education for 1 student'
      },
      'HEALTHCARE': {
        10: 'Provides basic medical supplies',
        50: 'Funds 1 medical consultation',
        100: 'Provides vaccination for 5 children',
        500: 'Funds 1 minor surgery',
        1000: 'Provides life-saving treatment'
      },
      'ENVIRONMENT': {
        10: 'Plants 1 tree',
        50: 'Plants 5 trees',
        100: 'Protects 1 acre of forest',
        500: 'Funds renewable energy project',
        1000: 'Protects 10 acres of wildlife habitat'
      },
      'POVERTY': {
        10: 'Provides 1 meal for a family',
        50: 'Provides food for 1 week',
        100: 'Provides food for 1 month',
        500: 'Provides housing support for 1 month',
        1000: 'Funds vocational training'
      }
    };

    const causeImpacts = impacts[causeCategory] || impacts['POVERTY'];
    let description = 'Makes a positive impact';
    
    for (const [threshold, desc] of Object.entries(causeImpacts)) {
      if (amount >= parseInt(threshold)) {
        description = desc;
      }
    }

    return description;
  };

  const handleDonate = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success
      setStep(5);
    } catch (error) {
      console.error('Donation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Make a Donation
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Your generosity makes a real difference
        </p>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Select Donation Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => { setIsRecurring(false); setStep(2); }}
            className={`p-4 rounded-lg border-2 transition-all ${
              !isRecurring 
                ? 'border-pink-500 bg-pink-50' 
                : `${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`
            }`}
          >
            <Gift className="h-8 w-8 mx-auto mb-2 text-pink-500" />
            <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              One-Time Donation
            </h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Make a single donation now
            </p>
          </button>

          <button
            onClick={() => { setIsRecurring(true); setStep(2); }}
            className={`p-4 rounded-lg border-2 transition-all ${
              isRecurring 
                ? 'border-pink-500 bg-pink-50' 
                : `${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`
            }`}
          >
            <Calendar className="h-8 w-8 mx-auto mb-2 text-pink-500" />
            <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recurring Donation
            </h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Set up automatic giving
            </p>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Choose Amount
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Every contribution makes a difference
        </p>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        {/* Predefined Amounts */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-6">
          {predefinedAmounts.map((preAmount) => (
            <button
              key={preAmount}
              onClick={() => setAmount(preAmount.toString())}
              className={`p-3 rounded-lg border-2 transition-all ${
                amount === preAmount.toString()
                  ? 'border-pink-500 bg-pink-50 text-pink-600'
                  : `${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-gray-700'}`
              }`}
            >
              {preAmount}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Custom Amount
          </label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              PWR
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            />
          </div>
        </div>

        {/* Impact Preview */}
        {amount && cause && (
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Impact
              </span>
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {getImpactDescription(parseInt(amount), cause)}
            </p>
          </div>
        )}

        {/* Recurring Options */}
        {isRecurring && (
          <div className="mt-6">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Frequency
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {frequencies.map((freq) => (
                <button
                  key={freq.id}
                  onClick={() => setFrequency(freq.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    frequency === freq.id
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : `${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-gray-700'}`
                  }`}
                >
                  {freq.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Select Cause
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Choose the cause you want to support
        </p>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {causes.map((causeOption) => (
            <button
              key={causeOption.id}
              onClick={() => setCause(causeOption.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                cause === causeOption.id
                  ? 'border-pink-500 bg-pink-50'
                  : `${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{causeOption.icon}</span>
                <div className="text-left">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {causeOption.name}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Support {causeOption.name.toLowerCase()} initiatives
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Impact Preview */}
        {amount && cause && (
          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Expected Impact
              </span>
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {getImpactDescription(parseInt(amount), cause)}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Personalize Your Donation
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Add a personal touch to your contribution
        </p>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-6`}>
        {/* Anonymous Option */}
        <div>
          <label className={`flex items-center space-x-3 cursor-pointer`}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
            />
            <div className="flex items-center space-x-2">
              {isAnonymous ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {isAnonymous ? 'Anonymous Donation' : 'Public Donation'}
              </span>
            </div>
          </label>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {isAnonymous 
              ? 'Your name will not be displayed publicly'
              : 'Your name will appear in the donation feed'
            }
          </p>
        </div>

        {/* Personal Message */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Personal Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share why this cause matters to you..."
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-pink-500`}
          />
        </div>

        {/* Summary */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Donation Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Amount:</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {amount} PWR
              </span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Cause:</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {causes.find(c => c.id === cause)?.name}
              </span>
            </div>
            {isRecurring && (
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Frequency:</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {frequencies.find(f => f.id === frequency)?.name}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Type:</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {isAnonymous ? 'Anonymous' : 'Public'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep5 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-10 w-10 text-white" />
      </div>
      
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Thank You for Your Donation!
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Your generosity will make a real difference
        </p>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {amount} PWR donated
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-500" />
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {getImpactDescription(parseInt(amount), cause)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {isRecurring ? 'Recurring donation set up' : 'One-time donation complete'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onClose}
          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Done
        </button>
        <button
          onClick={() => { setStep(1); setAmount(''); setCause(''); setMessage(''); }}
          className={`flex-1 border-2 border-pink-500 text-pink-500 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors ${darkMode ? 'hover:bg-gray-700' : ''}`}
        >
          Donate Again
        </button>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}
              >
                <ArrowRight className="h-5 w-5 text-gray-400 rotate-180" />
              </button>
              <h1 className="text-xl font-bold text-pink-600">Donation Flow</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Step {step} of {isRecurring ? 4 : 4}
            </span>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {step === 1 ? 'Donation Type' :
               step === 2 ? 'Amount' :
               step === 3 ? 'Cause' :
               step === 4 ? 'Personalize' : 'Complete'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-2xl mx-auto">
          {renderContent()}
          
          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  step === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={() => {
                  if (step === 2 && !amount) return;
                  if (step === 3 && !cause) return;
                  if (step === 4) {
                    handleDonate();
                  } else {
                    setStep(step + 1);
                  }
                }}
                disabled={(step === 2 && !amount) || (step === 3 && !cause) || loading}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                  (step === 2 && !amount) || (step === 3 && !cause) || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{step === 4 ? 'Complete Donation' : 'Next'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DonationFlow;
