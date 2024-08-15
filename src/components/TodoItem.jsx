import React, { useState, useEffect } from "react";
import classes from "./TodoItem.module.scss";

import TodoInfo from "./TodoInfo/TodoInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTodoAction,
  addList,
  deleteListAction,
  changeStatusAction,
  reorderListAction,
  socketAddList
} from "../store/TodoLists-actions";
import { Reorder } from "framer-motion";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { useQuery, useMutation } from "@apollo/client";
import ConfirmBox from "./ui/ConfirmBox/ConfirmBox";
import io from "socket.io-client";
import { getMemberInfo } from '../graphql/user';

function TodoItem(props) {
  const dispatch = useDispatch();
  const apiAddress = useSelector((state) => state.ApiSlice.address);
  const { TodoListId, TodoListIndex, title, list, myTeam, userId } = props;
  const [infoMdl, setInfoMdl] = useState(false);
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  const [task, setTask] = useState("");
  const [confirmbox, setConfirmbox] = useState({title: '', message: '', okFunc: ()=>{}, cancelFunc: ()=>{}, openBox: false});
  const { loading, error, data } = useQuery(getMemberInfo, {
    variables: { todoId: TodoListId, userId: JSON.parse(logIN).userId },
  });
  useEffect(()=>{
    const socket = io.connect(`${apiAddress}`);
    if(logIN){
      socket.on(`list_update_${TodoListId}`, (updatedItem) => {
        if(updatedItem.userId !== JSON.parse(logIN).userId){
          dispatch(socketAddList(updatedItem.list, TodoListIndex));
        }
      });
    }
    return () => {
      // Close the socket connection
      socket.disconnect();
    };
  },[]);

  const handleInputChange = (event) => {
    setTask(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addItem(task);
    }
  };

  const changeStatus = (listId, listIndex) => {
    if (logIN) {
      dispatch(changeStatusAction(listId, TodoListIndex, listIndex, logIN, apiAddress));
    }
  };

  const delteItem = (listId, listIndex) => {
    if (logIN) {
      dispatch(deleteListAction(listId, listIndex, TodoListIndex, logIN, apiAddress));
    }
  };

  const delteTodoList = () => {
    // if (logIN) {
    //   dispatch(deleteTodoAction(TodoListId, logIN));
    // }
    setConfirmbox((prev) => ({
      ...prev,
      title: 'Delete Todolist?',
      message: 'Are you sure you want to delete this todolist?',
      okFunc: () => {
        if (logIN) {
          dispatch(deleteTodoAction(TodoListId, logIN, apiAddress));
        }
      },
      cancelFunc: () => (
        setConfirmbox({
          ...prev,
          openBox: false
        })
      ),
      openBox: true
    }));
  };

  const addItem = (task) => {
    if (logIN && task.trim() !== "") {
      dispatch(addList(task, TodoListId, TodoListIndex, logIN, apiAddress));
    }
    setTask("");
  };

  const changeList = (newItems) => {
    if (logIN) {
      dispatch(reorderListAction(newItems, TodoListIndex, TodoListId, logIN, apiAddress));
    }
  };

  return (
    <>
    {confirmbox.openBox && <ConfirmBox title={confirmbox.title} message={confirmbox.message} okFunc={confirmbox.okFunc} cancelFunc={confirmbox.cancelFunc} />}
    {infoMdl && <TodoInfo onClose={setInfoMdl} TodoListIndex={TodoListIndex} TodoListId={TodoListId} myTeam={myTeam} userId={userId} data={data} />}
      <div className={classes["todo-app"]}>
        <div className={classes["app-title"]}>
          <h2>{title}</h2>
          <div className={classes.iconBtn}>
            <div onClick={()=>{setInfoMdl(true)}}>
              <IoInformationCircleOutline />
            </div>
            {/* <div className={classes['iconBtn--cancel']} onClick={delteTodoList}> */}
            {data && data.getMemberInfo.readAndWrite && <div className={classes['iconBtn--cancel']} onClick={delteTodoList}>
              <MdOutlineCancel />
            </div>}
          </div>
        </div>
        <div className={classes.row}>
          <input
            type="text"
            id={classes["input-box"]}
            placeholder="add your tasks"
            value={task}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={!(data && data.getMemberInfo.readAndWrite)}
          />
          <button
            onClick={() => {
              addItem(task);
            }}
          >
            Add
          </button>
        </div>
        {/* <ul id={classes["list-container"]}> */}
        <Reorder.Group
          axis="y"
          values={list}
          onReorder={(newItems) => {
            if(data && data.getMemberInfo.readAndWrite) {
              changeList(newItems);
            }
          }}
        >
          {list.map((item, listIndex) => (
            <Reorder.Item
              className={`${
                item.status === "completed"
                  ? `${classes.checked} ${classes.ulItem}`
                  : classes.ulItem
              }`}
              key={item._id}
              value={item}
              onDoubleClick={() => {
                if(data && data.getMemberInfo.readAndWrite) {
                  changeStatus(item._id, listIndex);
                }
              }}
            >
              {item.text}
              {data && data.getMemberInfo.readAndWrite && <span
                onClick={(event) => {
                  event.stopPropagation();
                  delteItem(item._id, listIndex);
                }}
              >
                x
              </span>}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </>
  );
}

export default TodoItem;
