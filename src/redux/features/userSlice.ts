import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserManagementService from "../service/userManagementService";
import { UserProfile } from "../models/userManagement/UserProfileModel";
import { handleError } from "@/constants/handleError";

interface UserState {
  userData: UserProfile | null;
  loading: boolean;
  error: string | null;
  isOpenLogout: boolean;
}

const initialState: UserState = {
  userData: null,
  loading: false,
  error: null,
  isOpenLogout: false,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOpenModalLogout: (state) => {
      state.isOpenLogout = true;
    },
    setCloseModalLogout: (state) => {
      state.isOpenLogout = false;
    },
    setUpdateUserData: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UserManagementService.getUserByToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        UserManagementService.getUserByToken.fulfilled,
        (state, action) => {
          state.userData = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        UserManagementService.getUserByToken.rejected,
        (state, action) => {
          state.error = action.payload || handleError.UNKNOWN;
          state.loading = false;
        }
      );
  },
});

export const { setOpenModalLogout, setCloseModalLogout, setUpdateUserData } =
  userSlice.actions;
export default userSlice.reducer;
