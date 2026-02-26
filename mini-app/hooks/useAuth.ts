import { useState, useEffect } from 'react';
import { useTelegram } from './useTelegram';

export const useAuth = () => {
  const { user, webApp } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && webApp) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [user, webApp]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
