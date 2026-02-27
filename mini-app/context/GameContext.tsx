import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Temporary Player interface until shared module is properly linked
interface Player {
  id: string;
  telegramId: number;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  rank: string;
  experience: number;
  influence: number;
  supporters: number;
  powerTokens: number;
  totalEarned: number;
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
  communityId?: string;
  isActive: boolean;
  lastActiveAt: Date;
  joinedAt: Date;
  generation: string;
  permanentBonus: number;
  titles: string[];
  badges: any[];
  seasonalAchievements: any[];
}

interface GameState {
  player: Player | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

type GameAction =
  | { type: 'SET_PLAYER'; payload: Player }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_PLAYER'; payload: Partial<Player> };

const initialState: GameState = {
  player: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, player: action.payload, isLoading: false, isInitialized: true };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'UPDATE_PLAYER':
      return {
        ...state,
        player: state.player ? { ...state.player, ...action.payload } : null,
      };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  updatePlayer: (updates: Partial<Player>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const updatePlayer = (updates: Partial<Player>) => {
    dispatch({ type: 'UPDATE_PLAYER', payload: updates });
  };

  return (
    <GameContext.Provider value={{ state, dispatch, updatePlayer }}>
      {children}
    </GameContext.Provider>
  );
};
