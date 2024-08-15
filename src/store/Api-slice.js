import { createSlice } from "@reduxjs/toolkit";

const ApiSlice = createSlice({
  name: "Api",
  initialState: {
    address: true ? 'http://localhost:8080/' : 'https://todo-backend-uai2.onrender.com/',
  },
  reducers: {
    changeName(state, action) {
      const { token, expires, userName, userId } = action.payload;
    },
  },
});

export const ApiSliceActions = ApiSlice.actions;
export default ApiSlice;
