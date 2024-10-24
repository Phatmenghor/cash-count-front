import { createSlice } from "@reduxjs/toolkit";
import { fetchUserData } from "../service/userService";
import { UserProfile } from "../models/userManagement/UserProfile";
import { handleError } from "@/constants/handleError";

interface UserState {
  userData: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload || handleError.UNKNOWN;
        state.loading = false;
      });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
