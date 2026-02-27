import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { TelegramProvider } from '../context/TelegramContext';
import { GameProvider } from '../context/GameContext';
import '../styles/globals.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  // Get loading and error states from contexts
  const { isLoading, error } = useQuery('peoplePowerJourney', {
    queryKey: ['appState'],
    queryFn: async () => {
      // Simulate initial app loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, data: { initialized: true } };
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <GameProvider>
          <div className="telegram-webapp">
            <Component {...pageProps} />
            
            {/* Lazy Loading State */}
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <div className="loading-text">Loading People Power Journey...</div>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="error-overlay">
                <div className="error-message">Error: {error.message}</div>
              </div>
            )}
            
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#f9fafb',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </GameProvider>
      </TelegramProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default MyApp;
