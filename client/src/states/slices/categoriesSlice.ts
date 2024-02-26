// Import necessary functions and types from Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store'; // Import RootState type from the store
import { ItemCategory } from '../../types/ItemCategory'; // Import ItemCategory type

// Define a type for the slice state
type CategoriesState = {
  data: ItemCategory[]; // Array of item categories
  loadingCategories: boolean; // Loading state for item categories
  errorCategories: string | null; // Error message for item categories
};

// Define the initial state using that type
const initialState: CategoriesState = {
  data: [], // Initialize item categories data as an empty array
  errorCategories: null, // Initialize error message as null
  loadingCategories: false, // Initialize loading state as false
};

// Create a slice of the Redux store for managing item categories
export const categoriesSlice = createSlice({
  name: 'categories', // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer function to set item categories in the state
    setCategories: (state, action: PayloadAction<ItemCategory[]>) => {
      state.data = action.payload; // Set item categories data to the payload received
    },
    // Reducer function to set loading state for item categories
    setLoadingCategories: (state, action: PayloadAction<boolean>) => {
      state.loadingCategories = action.payload; // Set loading state to the payload received
    },
    // Reducer function to set error message for item categories
    setErrorCategories: (state, action: PayloadAction<string>) => {
      state.errorCategories = action.payload; // Set error message to the payload received
    },
  },
});

// Extract the action creators from the slice
export const { setCategories, setErrorCategories, setLoadingCategories } = categoriesSlice.actions;

// Selector function to retrieve item categories state from the Redux store
export const selectCategories = (state: RootState) => state.categories;

// Define the item categories reducer
const categoriesReducer = categoriesSlice.reducer;

// Export the item categories reducer as the default export
export default categoriesReducer;
