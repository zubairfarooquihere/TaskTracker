import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const LoginStateSlice = createSlice({
  name: "LoginState",
  initialState: {
    logIn: Cookies.get("token"),
    userName: Cookies.get("userName"),
  },
  reducers: {
    logIn(state, action) {
      const { token, expires, userName, userId } = action.payload;
      const cookieValue = JSON.stringify({ token, userName, userId });
      Cookies.set("token", cookieValue, { expires: expires / 24, secure: true, sameSite: "Strict" }); // 1 day / 24 hours.
      state.logIn = Cookies.get("token");
      //setTokenInLocalStorage(Cookies.get("token"), expires);
    },
    logOut(state) {
      Cookies.remove("token", { sameSite: "Strict" }); // Setting SameSite to Strict
      state.logIn = false;
    },
  },
});

export const LoginStateActions = LoginStateSlice.actions;
export default LoginStateSlice;
