import { createSlice } from "@reduxjs/toolkit";

interface initialStateProps {}

/* Store Data to global State */
const initialState: initialStateProps = {};

const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* Login With Email */
    // builder
    //   .addCase(loginUpload.pending, (state, action) => {
    //     state.loading = true;
    //     state.errorLogin = undefined;
    //   })
    //   /* Add Data Response from Api */
    //   .addCase(loginUpload.fulfilled, (state, action) => {
    //     state.profileData = action.payload.data;
    //     state.errorLogin = action.payload.status;
    //     state.loading = false;
    //   })
    //   /* Add Data Response from Api When Error */
    //   .addCase(loginUpload.rejected, (state, action) => {
    //     state.errorLogin = action.payload;
    //     state.loading = false;
    //   });
    // /* Get Profile User */
    // builder
    //   .addCase(getProfile.pending, (state, action) => {
    //     state.loading = true;
    //   })
    //   /* Add Data Response from Api */
    //   .addCase(getProfile.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.profileData = action.payload;
    //   })
    //   /* Add Data Response from Api When Error */
    //   .addCase(getProfile.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   });
    // builder
    //   .addCase(setUpdateProfile.pending, (state, action) => {
    //     state.loading = true;
    //   })
    //   /* Add Data Response from Api */
    //   .addCase(setUpdateProfile.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.profileData = action.payload;
    //   })
    //   /* Add Data Response from Api When Error */
    //   .addCase(setUpdateProfile.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   });
    // // builder
    // //   .addCase(updateCurrentPassword.pending, (state, action) => {
    // //     state.loading = true;
    // //   })
    // //   /* Add Data Response from Api */
    // //   .addCase(updateCurrentPassword.fulfilled, (state, action) => {
    // //     state.loading = false;
    // //     state.profileData = action.payload;
    // //   })
    // //   /* Add Data Response from Api When Error */
    // //   .addCase(updateCurrentPassword.rejected, (state, action) => {
    // //     state.loading = false;
    // //     state.error = action.error.message;
    // //   });
  },
});

export const {} = loginSlice.actions;
export default loginSlice.reducer;
