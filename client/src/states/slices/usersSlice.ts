// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store'; // Import RootState type from the store
import { User } from '../../types/User'; // Import User type

// Define a type for the slice state
type UsersState = {
  data: User[]; // Array of User objects
  errorUsers: string | null; // Error message for users
  isLoadingUsers: boolean; // Loading state for users
};

// Define the initial state using that type
const initialState: UsersState = {
  data: [], // Initialize data as an empty array
  errorUsers: null, // Initialize error message as null
  isLoadingUsers: false, // Initialize loading state as false
};

// Create a slice of the Redux store for users
export const usersSlice = createSlice({
  name: 'users', // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer function to set users in the state
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.data = action.payload; // Set users to the payload received
    },
    // Reducer function to set error message for users
    setErrorUsers: (state, action: PayloadAction<string>) => {
      state.errorUsers = action.payload; // Set error message to the payload received
    },
    // Reducer function to set loading state for users
    setIsLoadingUsers: (state, action: PayloadAction<boolean>) => {
      state.isLoadingUsers = action.payload; // Set loading state to the payload received
    },
  },
});

// Extract the action creators from the slice
export const { setErrorUsers, setUsers, setIsLoadingUsers } = usersSlice.actions;

// Selector function to retrieve users state from the Redux store
export const selectUsers = (state: RootState) => state.users;

// Define the users reducer
const usersReducer = usersSlice.reducer;

// Export the users reducer as the default export
export default usersReducer;
