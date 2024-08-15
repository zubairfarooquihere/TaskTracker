import { createSlice } from "@reduxjs/toolkit";

const TodoListSlice = createSlice({
  name: "TodoLists",
  initialState: { TodoLists: [] }, // Make sure 'item' is initialized as an empty array
  reducers: {
    initializeTodoList(state, action) {
      state.TodoLists = [...action.payload];
    },
    clearAll(state, action){
      state.TodoLists = [];
    },
    deleteTodoLists(state, action) {
      const { TodoListIndex } = action.payload;
      const newArray = state.TodoLists;
      newArray.splice(TodoListIndex, 1);
      state.TodoLists = [...newArray];
    },
    addlist(state, action) {
      const { _id, text, status, TodoListIndex, TodoListId } = action.payload;
      //console.log(action.payload);
      state.TodoLists[TodoListIndex].list.push({
        _id: _id,
        text: text,
        status,
      });
      //throw Error('PROBLEM')
    },
    changeStatus(state, action) {
      const { status, TodoListIndex, listIndex } = action.payload;
      const newList = state.TodoLists[TodoListIndex].list;
      newList[listIndex] = {
        ...newList[listIndex], // Copying the properties of the original item
        status, // Updating the status
      };
      state.TodoLists[TodoListIndex].list = [...newList];
    },
    reorderList(state, action) {
      const { newItems, TodoListIndex } = action.payload;
      state.TodoLists[TodoListIndex].list = [...newItems];
    },
    delteItem(state, action) {
      const { TodoListIndex, listIndex } = action.payload;
      const newArray = state.TodoLists[TodoListIndex].list;
      newArray.splice(listIndex, 1);
      state.TodoLists[TodoListIndex].list = [...newArray];
    },
    addTeam(state, action) {
      const { TodoListIndex, myTeam } = action.payload;
      console.log(myTeam);
      state.TodoLists[TodoListIndex].myTeam = [...myTeam];
    }
  },
});

export const TodoListActions = TodoListSlice.actions;
export default TodoListSlice;
