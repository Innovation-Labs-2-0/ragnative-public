import { createContext, useContext } from "react";

export const BotContext = createContext(null);

export const useBotContext = () => useContext(BotContext);

export const BotConfigTabContext = createContext();

export const useBotConfigTabContext = () => useContext(BotConfigTabContext);
