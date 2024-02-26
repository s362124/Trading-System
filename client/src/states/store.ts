// Import necessary functions and reducers from Redux slices
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import selectedItemReducer from './slices/selectedItemSlice';
import itemReducer from './slices/itemSlice';
import categoriesReducer from './slices/categoriesSlice';
import favoriteItemsReducer from './slices/favoriteItems';
import usersReducer from './slices/usersSlice';

// Create the Redux store using configureStore from @reduxjs/toolkit
export const store = configureStore({
  reducer: {
    user: userReducer,                     // User slice reducer
    auth: authReducer,                     // Authentication slice reducer
    selectedItem: selectedItemReducer,     // Selected item slice reducer
    item: itemReducer,                     // Item slice reducer
    categories: categoriesReducer,         // Categories slice reducer
    favorites: favoriteItemsReducer,       // Favorite items slice reducer
    users: usersReducer                    // Users slice reducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { user: UserState, auth: AuthState, selectedItem: SelectedItemState, item: ItemState, categories: CategoriesState, favorites: FavoriteItemsState, users: UsersState }
export type AppDispatch = typeof store.dispatch;
