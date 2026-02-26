// ========================================
// TELEGRAM WEB APP TYPES
// ========================================

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
    };
    receiver?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    chat?: {
      id: number;
      type: string;
      title: string;
      username?: string;
      first_name?: string;
      last_name?: string;
      photo?: {
        small_file_id: string;
        big_file_id: string;
      };
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportWidth: number;
  headerHeight: number;
  isVerticalSwipesEnabled: boolean;
  isIframe: boolean;

  // Methods
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData?: (data: string) => void;
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  webApp: TelegramWebApp;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramChat {
  id: number;
  type: string;
  title: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  chat?: TelegramChat;
  auth_date: number;
  hash: string;
}
