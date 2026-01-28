import { createContext, useContext } from "react";

export const DynamicCardContext = createContext(null);

export const useDynamicCardContext = () => useContext(DynamicCardContext);
