import { useTelegram as useTelegramContext } from '../context/TelegramContext';

export const useTelegram = () => {
  const telegram = useTelegramContext();
  return telegram;
};
