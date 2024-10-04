// // store/actions/userActions.ts
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import apiService from "../services/apiService";

// // Async thunk for fetching user data
// export const fetchUserData = createAsyncThunk(
//   "user/fetchUserData",
//   async (userId: string, { rejectWithValue }) => {
//     try {
//       const response = await apiService.get(`/users/${userId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
