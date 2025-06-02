import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiHandler from '../../utils/apiHandler';

// Thunk to fetch user data
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, thunkAPI) => {
    try {
      const res = await apiHandler("/users/dashboard", "GET");
      if (res.success) {
        return res.data;
      } else {
        return thunkAPI.rejectWithValue(res.message || 'Fetch failed');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Fetch failed');
    }
  }
);

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: '',
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = '';
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = '';
    },
    loading: (state) => {
      state.loading = true;
      state.error = '';
    },
    userData: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = ''; 
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = '';
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user';
      });
  },
});

export const { authUser, logout, loading, userData } = userSlice.actions;
export default userSlice.reducer;
