import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatbotId: localStorage.getItem("chatbotId") || null,
  botVersionId: localStorage.getItem("botVersionId") || null,
};

const chatbotSlice = createSlice({
  name: "bot",
  initialState,
  reducers: {
    setChatbotId(state, action) {
      state.chatbotId = action.payload;
      localStorage.setItem("chatbotId", action.payload);
    },
    setBotVersionId(state, action) {
      state.botVersionId = action.payload;
      localStorage.setItem("botVersionId", action.payload);
    },
    resetChatbot(state) {
      state.chatbotId = null;
      localStorage.removeItem("chatbotId");
      localStorage.removeItem("botVersionId");
    },
  },
});

export const { setChatbotId, setBotVersionId, resetChatbot } = chatbotSlice.actions;
export default chatbotSlice.reducer;
