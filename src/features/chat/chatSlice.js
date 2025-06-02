import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: JSON.parse(localStorage.getItem('chatMessages')) || [],
  isOpen: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      localStorage.setItem('chatMessages', JSON.stringify(state.messages));
    },
    clearMessages: (state) => {
      state.messages = [];
      localStorage.removeItem('chatMessages');
    },
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { addMessage, clearMessages, openChat, closeChat, toggleChat } = chatSlice.actions;
export default chatSlice.reducer;