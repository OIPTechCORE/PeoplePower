import React from 'react';
import { motion } from 'framer-motion';
import CharityDashboard from './CharityDashboard';
import CharityBrowser from './CharityBrowser';
import DonationFlow from './DonationFlow';
import TelegramCharityInterface from './TelegramCharityInterface';
import MobileCharityApp from './MobileCharityApp';

// Charity App Router Component
const CharityApp = ({ view = 'dashboard', charity = null }) => {
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <CharityDashboard />;
      case 'browser':
        return <CharityBrowser />;
      case 'donate':
        return <DonationFlow charity={charity} onClose={() => window.history.back()} />;
      case 'telegram':
        return <TelegramCharityInterface />;
      case 'mobile':
        return <MobileCharityApp />;
      default:
        return <CharityDashboard />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {renderView()}
    </motion.div>
  );
};

export default CharityApp;
