import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  knowledgeBaseId: localStorage.getItem("knowledgeBaseId") || null,
};

const knowledgeBaseSlice = createSlice({
  name: "knowledgeBase",
  initialState,
  reducers: {
    setKnowledgeBaseId(state, action) {
      state.knowledgeBaseId = action.payload;
      localStorage.setItem("knowledgeBaseId", action.payload);
    },
    resetKnowledgeBase(state) {
      state.knowledgeBaseId = null;
      localStorage.removeItem("knowledgeBaseId");
    },
  },
});

export const { setKnowledgeBaseId, resetKnowledgeBase } = knowledgeBaseSlice.actions;
export default knowledgeBaseSlice.reducer;
