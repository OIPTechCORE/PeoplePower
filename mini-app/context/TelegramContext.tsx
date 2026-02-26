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
    // Initialize Telegram Web App
    if (typeof window !== 'undefined' && (window as any).Telegram) {
      setIsLoading(true);
      const telegramWebApp = (window as any).Telegram.WebApp;
      telegramWebApp.ready();
      
      setWebApp(telegramWebApp);
      setUser(telegramWebApp.initDataUnsafe?.user || null);
      setInitData(telegramWebApp.initData || null);
      setIsReady(true);
      setIsLoading(false);

      // Configure Web App
      telegramWebApp.expand();
      telegramWebApp.setHeaderColor('#1f2937');
      telegramWebApp.setBackgroundColor('#111827');
    } else {
      setIsLoading(false);
    }
  }, []);

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
