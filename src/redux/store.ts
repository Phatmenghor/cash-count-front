import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./features/rootReducer";
import loggerMiddleware from "./middleware/loggerMiddleware";

// Create and configure the Redux store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
