import React, { useState, useEffect } from "react";
import classes from "./TodoInfo.module.scss";
import Modal from "../ui/Modal/Modal";
import AddTeam from "./AddTeam";
import { useQuery, useMutation } from "@apollo/client";
import { MdOutlineCancel } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getComments, addComment, deleteComment } from '../../graphql/user';
import io from "socket.io-client"

function TodoInfo(props) {
  const dispatch = useDispatch();
  const apiAddress = useSelector((state) => state.ApiSlice.address);
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  const { onClose, TodoListIndex, TodoListId, myTeam, userId, data } = props;
  const [addTeam, setAddTeam] = useState(false);
  const { loading: l1, error: e1, data: cmt, refetch: refetchComments } = useQuery(getComments, {
    variables: { todoId: TodoListId },
  });
  const [addCommentMutation, { loading: loading2, error: error2 }] = useMutation(addComment);
  const [message, setMessage] = useState("");

  useEffect(()=>{
    const socket = io.connect(`${apiAddress}`);
    if(logIN){
      socket.on(`comment_update_${TodoListId}`, (updatedItem) => {
        if(updatedItem.userId !== JSON.parse(logIN).userId){
          refetchComments();
        }
      });
    }
    return () => {
      socket.disconnect();
    };
  },[]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && message.trim().length !== 0) {
      addCommentMutation({
        variables: {
          todoId: TodoListId,
          comment: message,
          userId: JSON.parse(logIN).userId,
        },
        refetchQueries: [
          {
            query: getComments,
            variables: {
              todoId: TodoListId, // Add the necessary variables here
            },
          },
        ],
      });
      console.log(message); // This will print the message to the console
      setMessage(""); // Clear the input field after pressing Enter
    }
  };
  //console.log(cmt);
  return (
    <>
      <Modal onClose={onClose} />
      {addTeam && (
        <AddTeam
          myTeams={myTeam}
          TodoListIndex={TodoListIndex}
          TodoListId={TodoListId}
          userId={userId}
          onClose={setAddTeam}
        />
      )}
      <div className={classes.todoinfo}>
        <div className={classes.todoinfo__header}>
          <div className={classes["todoinfo__header--title"]}>
            My List (
            {data && data.getMemberInfo
              ? data.getMemberInfo.owner
                ? "Owner"
                : data.getMemberInfo.readAndWrite
                ? "Read and write"
                : "Read Only"
              : null}
            )
          </div>
          <div className={classes["todoinfo__header--actionbtn"]}>
            <MdOutlineCancel />
          </div>
        </div>
        <div className={classes.linebreak} />
        <div className={classes.details}>
          <div className={classes.details__first}>
            <div className={classes["details__first--owner"]}>
              <div className={classes["details__first--owner--title"]}>
                Owner:
              </div>
              <div className={classes["details__first--owner--name"]}>
                {data && data.getMemberInfo.ownerName}
              </div>
            </div>
            <div className={classes["details__first--team"]}>
              <div className={classes["details__first--team--title"]}>
                Team{" "}
                <div
                  onClick={() => {
                    setAddTeam(true);
                  }}
                >
                  {data && data.getMemberInfo.readAndWrite && <FaUserPlus />}
                </div>
              </div>
              <div className={classes["details__first--team--list"]}>
                {myTeam.map((team) => {
                  return <div key={team._id}>{team.user.name}</div>;
                })}
              </div>
            </div>
            <div className={classes["details__first--notification"]}>
              <div className={classes["details__first--notification--title"]}>
                Notification
              </div>
              <div className={classes["details__first--notification--place"]}>
                <div className={classes["details__first--notification--msg"]}>
                  This is my notification
                </div>
              </div>
            </div>
          </div>
          <div className={classes.details__second}>
            <input
              className={classes.commentBox}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
            />
            <div className={`${classes.comments}`}>
              {cmt &&
                cmt.getComments.map((commentObj) => {
                  //console.log(commentObj);
                  //console.log(JSON.parse(logIN).userId);
                  if (commentObj.userId._id === JSON.parse(logIN).userId) {
                    return (
                      <div
                        key={commentObj._id}
                        className={`${classes.comments__comment} ${classes["comments__comment--me"]}`}
                      >
                        {commentObj.comment}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={commentObj._id}
                        className={`${classes.comments__comment} ${classes["comments__comment--sender"]}`}
                      >
                        {commentObj.userId.name}: {commentObj.comment}
                      </div>
                    );
                  }
                })}
              {/* <div className={`${classes.comments__comment} ${classes['comments__comment--me']}`}>Sender is Me</div>
              <div className={`${classes.comments__comment} ${classes['comments__comment--sender']}`}>Sender is Other</div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoInfo;
