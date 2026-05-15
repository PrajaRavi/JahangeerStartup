import { configureStore } from '@reduxjs/toolkit';
import { FileReducer } from '../Slice/Auth.slice';
export const store = configureStore({
  reducer: {
    Auth: FileReducer,
    // add other reducers here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;