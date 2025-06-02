import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./features/user/AuthSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice"
import chatReducer from "./features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    wishlist: wishlistReducer,
    chat: chatReducer,
  },
})