import { RootState } from "../store";

// Selector to get the user information from the Redux state
export const selectUserInfo = (state: RootState) => state;
export const selectUserLoading = (state: RootState) => state;
export const selectUserError = (state: RootState) => state;
