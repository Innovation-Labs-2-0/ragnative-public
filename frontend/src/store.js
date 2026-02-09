import { configureStore } from "@reduxjs/toolkit";
import chatbotReducer from "./slices/chatbotSlice";
import authReducer from "./slices/authSlice";
import knowledgeBaseReducer from "./slices/knowledgeBaseSlice";
import licenseReducer from "./slices/licenseSlice";

const store = configureStore({
  reducer: {
    bot: chatbotReducer,
    auth: authReducer,
    knowledgeBase: knowledgeBaseReducer,
    license: licenseReducer,
  },
});

export default store;
