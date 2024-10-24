import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice"

// Combine the reducers into a rootReducer
const rootReducer = combineReducers({
    user: userReducer,
});

export default rootReducer;
