import React, { createContext, useContext, useEffect, useState } from 'react';

// Temporary WebApp interface until SDK is properly linked
interface WebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  initDataUnsafe?: {
    user?: any;
  };
  initData?: string;
  MainButton: {
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
}

interface TelegramContextType {
  webApp: WebApp | null;
  user: any | null;
  initData: string | null;
  isReady: boolean;
  isLoading: boolean;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: React.ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [initData, setInitData] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Telegram Web App with lazy loading
    if (typeof window !== 'undefined' && (window as any).Telegram) {
      setIsLoading(true);
      
      // Create WebApp instance
      const telegramWebApp = (window as any).Telegram.WebApp;
      
      // Initialize with loading state
      telegramWebApp.ready().then(() => {
        console.log('Telegram WebApp initialized');
        
        // Set WebApp instance
        setWebApp(telegramWebApp);
        
        // Set user data
        setUser(telegramWebApp.initDataUnsafe?.user || null);
        setInitData(telegramWebApp.initData || null);
        
        // Configure Web App
        telegramWebApp.expand();
        telegramWebApp.setHeaderColor('#1f2937');
        telegramWebApp.setBackgroundColor('#111827');
        
        // Set ready state
        setIsReady(true);
        setIsLoading(false);
      }).catch((error) => {
        console.error('Failed to initialize Telegram WebApp:', error);
        setIsLoading(false);
      });
    } else {
      // Handle case where Telegram is not available
      setIsLoading(false);
      console.warn('Telegram WebApp not available');
    }
  }, [webApp, setWebApp, user, setUser, setInitData, isReady, isLoading, setIsLoading]);

  const value: TelegramContextType = {
    webApp,
    user,
    initData,
    isReady,
    isLoading,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};
