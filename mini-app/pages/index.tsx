import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../components/LoadingScreen';
import { HomeScreen } from '../components/HomeScreen';
import { OnboardingScreen } from '../components/OnboardingScreen';

export default function HomePage() {
  const router = useRouter();
  const { webApp, isLoading: telegramLoading } = useTelegram();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Initialize Telegram Web App
    if (webApp && !telegramLoading) {
      webApp.ready();
      webApp.expand();
      webApp.setHeaderColor('#1f2937');
      webApp.setBackgroundColor('#111827');
      
      // Set main button for navigation
      if (webApp.MainButton) {
        webApp.MainButton.setText('Start Playing');
        webApp.MainButton.onClick(() => {
          setShowOnboarding(true);
        });
        webApp.MainButton.show();
      }
    }
  }, [webApp, telegramLoading]);

  useEffect(() => {
    // Check if user needs onboarding
    if (isAuthenticated && user) {
      if (!user.hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated, user]);

  // Show loading screen while initializing
  if (telegramLoading || authLoading) {
    return <LoadingScreen />;
  }

  // Show onboarding for new users
  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  // Show main home screen
  return <HomeScreen />;
}
