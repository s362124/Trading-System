// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store'; // Import RootState type from the store
import { User } from '../../types/User'; // Import User type

// Define a type for the slice state
type UserState = {
  data: User; // User object
  errorUser: string | null; // Error message for user
  isLoadingUser: boolean; // Loading state for user
};

// Define the initial state using that type
const initialState: UserState = {
  data: {
    id: '',
    name: '',
    surname: '',
    email: '',
    phoneNumber: 0,
    role: 1,
    gender: '',
    address: '',
    likedItems:[]
  }, // Default user data
  errorUser: null, // Initialize error message as null
  isLoadingUser: false // Initialize loading state as false
};

// Create a slice of the Redux store for managing a single user
export const userSlice = createSlice({
  name: 'user', // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer function to set a user in the state
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload; // Set user data to the payload received
    },
    // Reducer function to set an error message for a user
    setErrorUser: (state, action: PayloadAction<string>) => {
      state.errorUser = action.payload; // Set error message to the payload received
    },
    // Reducer function to set the loading state for a user
    setIsLoadingUser: (state, action: PayloadAction<boolean>) => {
      state.isLoadingUser = action.payload; // Set loading state to the payload received
    },
  },
});

// Extract the action creators from the slice
export const { setErrorUser, setUser, setIsLoadingUser } = userSlice.actions;

// Selector function to retrieve the user state from the Redux store
export const selectUser = (state: RootState) => state.user;

// Define the user reducer
const userReducer = userSlice.reducer;

// Export the user reducer as the default export
export default userReducer;
