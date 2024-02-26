// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store'; // Import RootState type from the store
import { Item } from '../../types/Item'; // Import Item type

// Define a type for the slice state
type ItemsState = {
  data: Item[]; // Array of items
  loadingItems: boolean; // Loading state for items
  errorItems: string | null; // Error message for items
};

// Define the initial state using that type
const initialState: ItemsState = {
  data: [], // Initialize items data as an empty array
  errorItems: null, // Initialize error message as null
  loadingItems: false, // Initialize loading state as false
};

// Create a slice of the Redux store for managing items
export const ItemsSlice = createSlice({
  name: 'items', // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer function to set items in the state
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.data = action.payload; // Set items data to the payload received
    },
    // Reducer function to set loading state for items
    setLoadingItems: (state, action: PayloadAction<boolean>) => {
      state.loadingItems = action.payload; // Set loading state to the payload received
    },
    // Reducer function to set error message for items
    setErrorItems: (state, action: PayloadAction<string>) => {
      state.errorItems = action.payload; // Set error message to the payload received
    },
  },
});

// Extract the action creators from the slice
export const { setItems, setErrorItems, setLoadingItems } = ItemsSlice.actions;

// Selector function to retrieve items state from the Redux store
export const selectItems = (state: RootState) => state.item;

// Define the items reducer
const itemReducer = ItemsSlice.reducer;

// Export the items reducer as the default export
export default itemReducer;
