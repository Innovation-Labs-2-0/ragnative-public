import { createContext, useContext } from "react";

export const KnowledgeBaseContext = createContext(null);

export const useKnowledgeBaseContext = () => useContext(KnowledgeBaseContext);
