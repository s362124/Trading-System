// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store'; // Import RootState type from the store
import { Item } from '../../types/Item'; // Import Item type

// Define a type for the slice state
type FavoriteItemsState = {
  data: Item[]; // Array of favorite items
  loadingFavoriteItems: boolean; // Loading state for favorite items
  errorFavoriteItems: string | null; // Error message for favorite items
};

// Define the initial state using that type
const initialState: FavoriteItemsState = {
  data: [], // Initialize favorite items data as an empty array
  errorFavoriteItems: null, // Initialize error message as null
  loadingFavoriteItems: false, // Initialize loading state as false
};

// Create a slice of the Redux store for managing favorite items
export const favoriteItemsSlice = createSlice({
  name: 'favorites', // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer function to set favorite items in the state
    setFavoriteItems: (state, action: PayloadAction<Item[]>) => {
      state.data = action.payload; // Set favorite items data to the payload received
    },
    // Reducer function to set loading state for favorite items
    setLoadingFavoriteItems: (state, action: PayloadAction<boolean>) => {
      state.loadingFavoriteItems = action.payload; // Set loading state to the payload received
    },
    // Reducer function to set error message for favorite items
    setErrorFavoriteItems: (state, action: PayloadAction<string>) => {
      state.errorFavoriteItems = action.payload; // Set error message to the payload received
    },
  },
});

// Extract the action creators from the slice
export const { setErrorFavoriteItems, setFavoriteItems, setLoadingFavoriteItems } = favoriteItemsSlice.actions;

// Selector function to retrieve favorite items state from the Redux store
export const selectFavoriteItems = (state: RootState) => state.favorites;

// Define the favorite items reducer
const favoriteItemsReducer = favoriteItemsSlice.reducer;

// Export the favorite items reducer as the default export
export default favoriteItemsReducer;
