import { createSlice } from '@reduxjs/toolkit';

// Load wishlist from localStorage if exists
const loadWishlist = () => {
  try {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Failed to load wishlist:", err);
    return [];
  }
};

const initialState = {
  items: loadWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const alreadyExists = state.items.some(item => item.id === action.payload.id);
      if (!alreadyExists) {
        state.items.push(action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.items)); // Update localStorage
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items)); // Update localStorage
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    }
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
