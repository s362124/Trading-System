// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store'; // Import RootState type from the store

// Define a type for the slice state
type AuthState = {
  data: any; // Data related to authentication
  errorAuth: string | null; // Error message related to authentication
  isLoadingAuth: boolean; // Loading state related to authentication
};

// Define the initial state using that type
const initialState: AuthState = {
  data: null, // Initialize authentication data as null
  errorAuth: null, // Initialize error message as null
  isLoadingAuth: false, // Initialize loading state as false
};

// Create a slice of the Redux store for managing authentication
export const authSlice = createSlice({
  name: 'auth', // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer function to set authentication data in the state
    setAuthData: (state, action: PayloadAction<any>) => {
      state.data = action.payload; // Set authentication data to the payload received
    },
    // Reducer function to set error message related to authentication
    setErrorAuth: (state, action: PayloadAction<string>) => {
      state.errorAuth = action.payload; // Set error message to the payload received
    },
    // Reducer function to set loading state related to authentication
    setIsLoadingAuth: (state, action: PayloadAction<boolean>) => {
      state.isLoadingAuth = action.payload; // Set loading state to the payload received
    },
  },
});

// Extract the action creators from the slice
export const { setErrorAuth, setAuthData, setIsLoadingAuth } = authSlice.actions;

// Selector function to retrieve authentication state from the Redux store
export const selectAuth = (state: RootState) => state.auth;

// Define the authentication reducer
const authReducer = authSlice.reducer;

// Export the authentication reducer as the default export
export default authReducer;
