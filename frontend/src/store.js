import { configureStore } from "@reduxjs/toolkit";
import chatbotReducer from "./slices/chatbotSlice";
import authReducer from "./slices/authSlice";
import knowledgeBaseReducer from "./slices/knowledgeBaseSlice";

const store = configureStore({
  reducer: {
    bot: chatbotReducer,
    auth: authReducer,
    knowledgeBase: knowledgeBaseReducer,
  },
});

export default store;
