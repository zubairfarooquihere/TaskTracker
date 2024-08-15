import { TodoListActions } from "./TodoLists-slice";
import { LoginStateActions } from "./LoginState-slice";
import axios from "axios";
import Cookies from "js-cookie";

//From nodejs call data here, and send to redux to fill it. 
export const fetchTodoList = (logIN, apiAddress) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const axiosConfig = config(logIN);
      const response = await fetch(`${apiAddress}todo/getTodos`, 
        axiosConfig // Passing headers directly here
      );
      if (!response.ok) {
        throw new Error("Could not fetch cart data!");
      }
      const data = await response.json();
      return data;
    };
    try {
      if (Cookies.get("token")) {
        let TodoListObj = await fetchData();
        dispatch(
          TodoListActions.initializeTodoList([...TodoListObj.todoLists])
        );
      } else {
        dispatch(LoginStateActions.logOut());
      }
    } catch (error) {
      console.error("Error fetching todo lists:", error);
      throw error;
    }
  };
};

export const addTodoAction = (logIN, apiAddress) => {
  return async (dispatch) => {
    try {
      if (Cookies.get("token")) {
        const axiosConfig = config(logIN);
        const res = await axios.post(
          `${apiAddress}todo/createTodo`,
          {},
          axiosConfig
        );
        const todoList = res.data.todoList; //_id, list, title
        dispatch(TodoListActions.initializeTodoList(todoList));
      } else {
        dispatch(LoginStateActions.logOut());
      }
    } catch (error) {
      console.error("Error fetching todo lists:", error);
      throw error;
    }
  };
};

export const deleteTodoAction = (TodoListId, logIN, apiAddress) => {
  return async (dispatch) => {
    try {
      if (Cookies.get("token")) {
        const axiosConfig = config(logIN);
        const res = await axios.delete(
          `${apiAddress}todo/deleteTodo/${TodoListId}`,
          axiosConfig
        );
        //console.log(res);
        const index = res.data.index;
        dispatch(TodoListActions.deleteTodoLists({TodoListIndex: index}));
      } else {
        dispatch(LoginStateActions.logOut());
      }
    } catch (error) {
      console.error("Error fetching todo lists:", error);
      throw error;
    }
  };
};

export const deleteListAction = (listId, listIndex, TodoListIndex, logIN, apiAddress) => {
  return async (dispatch) => {
    try {
      if (Cookies.get("token")) {
        const axiosConfig = config(logIN);
        const res = await axios.delete(
          `${apiAddress}todo/deleteList/${listId}`,
          axiosConfig
        );
        const list = res.data.list; //_id, list, title
        const index = res.data.index;
        dispatch(
          TodoListActions.delteItem({
            TodoListIndex: TodoListIndex,
            listIndex: index,
          })
        );
      } else {
        dispatch(LoginStateActions.logOut());
      }
    } catch (error) {
      console.error("Error fetching todo lists:", error);
      throw error;
    }
  };
};

export const addList = (task, TodoListId, TodoListIndex, logIN, apiAddress) => {
  return async (dispatch) => {
    try {
      if (Cookies.get("token")) {
        const axiosConfig = config(logIN);
        const res = await axios.post(
          `${apiAddress}todo/createList/${TodoListId}`,
          { text: task, userId: JSON.parse(logIN).userId },
          axiosConfig
        );
        const list = res.data.list;
        list["TodoListIndex"] = TodoListIndex;
        dispatch(TodoListActions.addlist(list));
      } else {
        dispatch(LoginStateActions.logOut());
      }
    } catch (error) {
      console.error("Error fetching todo lists:", error);
      throw error;
    }
  };
};

export const changeStatusAction = (listId, TodoListIndex, listIndex, logIN, apiAddress) => {
  return async (dispatch) => {
    try {
      if (Cookies.get("token")) {
        const axiosConfig = config(logIN);
        const res = await axios.put(
          `${apiAddress}todo/changeStatus/${listId}`,
          {}, 
          axiosConfig
        );
        const status = res.data.status;
        dispatch(TodoListActions.changeStatus({status, TodoListIndex, listIndex}));
      } else {
        dispatch(LoginStateActions.logOut());
      }
    } catch (error) {
      console.error("Error fetching todo lists:", error);
      throw error;
    }
  };
};

export const reorderListAction = (newItems, TodoListIndex, TodoListId, logIN, apiAddress) => {
  return async (dispatch) => {
    try {
      if (Cookies.get("token")) {
        const axiosConfig = config(logIN);
        const res = await axios.put(
          `${apiAddress}todo/reorderList/${TodoListId}`,
          {newItems}, 
          axiosConfig
        );
        const todoList = res.data.todoList;
        //console.log(todoList);
        dispatch(TodoListActions.reorderList({newItems, TodoListIndex}));
      } else {
        dispatch(LoginStateActions.logOut());
      }
    } catch (error) {
      console.error("Error fetching todo lists:", error);
      throw error;
    }
  };
};

export const socketAddList = (list, TodoListIndex) => {
  return async (dispatch) => {
    list["TodoListIndex"] = TodoListIndex;
    dispatch(TodoListActions.addlist(list));
  };
};

const config = (logIN) => {
  let token = JSON.parse(logIN).token 
  return {
    headers: {
      Authorization: "Bearer " + token, // Assuming logIN contains your token
    },
  };
};
