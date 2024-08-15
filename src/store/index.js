import { configureStore } from "@reduxjs/toolkit";

import TodoListSlice from "./TodoLists-slice";
import LoginStateSlice from "./LoginState-slice";
import ApiSlice from "./Api-slice";

const store = configureStore({
  reducer: {
    TodoListSlice: TodoListSlice.reducer,
    LoginStateSlice: LoginStateSlice.reducer,
    ApiSlice: ApiSlice.reducer
  },
});

export default store;
