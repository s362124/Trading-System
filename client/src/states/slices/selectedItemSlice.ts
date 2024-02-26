// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store'; // Import RootState type from the store
import { Item } from '../../types/Item'; // Import Item type

// Define a type for the slice state
type SelectedItemState = {
  data: Item | null; // Selected item data or null if none selected
};

// Define the initial state using that type
const initialState: SelectedItemState = {
  data: null, // Initialize selected item data as null
};

// Create a slice of the Redux store for managing the selected item
export const selectedItemSlice = createSlice({
  name: 'selectedItem', // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer function to set the selected item in the state
    setSelectedItem: (state, action: PayloadAction<Item>) => {
      state.data = action.payload; // Set selected item data to the payload received
    },
  },
});

// Extract the action creator from the slice
export const { setSelectedItem } = selectedItemSlice.actions;

// Selector function to retrieve the selected item state from the Redux store
export const selectSelectedItem = (state: RootState) => state.selectedItem;

// Define the selected item reducer
const selectedItemReducer = selectedItemSlice.reducer;

// Export the selected item reducer as the default export
export default selectedItemReducer;
