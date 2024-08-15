import React, { useState, useEffect } from "react";
import classes from "./AddTeam.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation } from "@apollo/client";
import { TodoListActions } from "../../store/TodoLists-slice";
import { getUsers, addUserToTodoGQL, deleteUserToTodoGQL } from '../../graphql/user';
import Modal from "../ui/Modal/Modal";

function AddTeam(props) {
  const { onClose, TodoListIndex, TodoListId, myTeams, userId } = props;
  const dispatch = useDispatch();
  const logIN = useSelector((state) => state.LoginStateSlice.logIn);
  const [searchValue, setSearchValue] = useState("");
  const [newTeam, setNewTeam] = useState([]);
  const [myTeam, setMyTeam] = useState([...myTeams]);
  // Use useQuery hook to fetch data
  const { loading, error, data } = useQuery(getUsers, {
    skip: !searchValue, // Skip the query if searchValue is falsy
    variables: { email: searchValue, userId: userId },
  });
  const [addUserToTodo, { loading: loading2, error: error2 }] = useMutation(addUserToTodoGQL);
  const [deleteUserToTodo, { loading: deleteLoading, error: deleteError }] = useMutation(deleteUserToTodoGQL);

  // Log data and errors
  if (error2) {
    console.error("Error fetching data:", error2);
  }

  const handleInputChange = (event) => {
    setSearchValue(event.target.value); // Update the searchValue state with the input value
  };

  const addInTeam = (user) => {
    const { __typename ,...userv2 } = user;
    setNewTeam((prev) => {
      return [...prev, {
        _id: user._id,
        readAndWrite: true,
        readOnly: false,
        user: userv2,
      }];
    });
  };

  function isUserInTeam(user) {
    const res = myTeam.some((teamMember) => teamMember.user._id === user._id);
    const res2 = newTeam.some((teamMember) => teamMember._id === user._id);
    if (res || res2) {
      return true;
    }
    return false;
  }
  
  const save = () => {
      addUserToTodo({
        variables: {
          currentTeam: myTeam,
          newTeam: newTeam,
          todoId: TodoListId,
          userId: JSON.parse(logIN).userId,
        },
      })
        .then((response) => {
          dispatch(
            TodoListActions.addTeam({
              TodoListIndex,
              myTeam: [...myTeam, ...newTeam],
            })
          );
        })
        .catch((error) => {
          console.error("Failed to add user to todo:", error);
        });
  };

  const deleteMyTeam = (email) => {
    deleteUserToTodo({
      variables: {
        email,
        todoId: TodoListId,
        userId: JSON.parse(logIN).userId,
      },
    })
      .then((response) => {
        dispatch(
          TodoListActions.addTeam({
            TodoListIndex,
            myTeam: [...response.data.deleteUserToTodo],
          })
        );
      })
      .catch((error) => {
        console.error("Failed to add user to todo:", error);
      });
  };

  return (
    <>
      <Modal onClose={onClose} />
      <div className={classes.layout}>
        <div className={classes.search}>
          <input
            className={classes.search__input}
            type="text"
            id="search"
            placeholder="Search..."
            value={searchValue}
            onChange={handleInputChange}
          />
          {searchValue && (
            <div className={classes.search__result}>
              <ul>
                {data &&
                  data.findUser.map((user) => {
                    // Check if user is not in current team
                    if (!isUserInTeam(user)) {
                      return (
                        <li
                          onClick={() => {
                            addInTeam(user);
                          }}
                          key={user._id}
                        >
                          {user.email}
                        </li>
                      );
                    } else {
                      return null; // Exclude the user from rendering if their ID matches
                    }
                  })}
              </ul>
            </div>
          )}
          <button type="submit">Search</button>
        </div>
        <div className={classes.table}>
          <div className={`${classes.row}`}>
            <div className={`${classes.cell}`}>Email</div>
            <div className={`${classes.cell}`}>
              {/* <input type="radio" name="option" id="option1" /> */}
              <label htmlFor="option1">Read and write</label>
            </div>
            <div className={`${classes.cell}`}>
              {/* <input type="radio" name="option" id="option2" /> */}
              <label htmlFor="option2">Read only</label>
            </div>
            <div className={`${classes.cell}`}>Delete</div>
          </div>
          {myTeam.map((team, index) => {
            return (
              <div key={team._id} className={`${classes.row}`}>
                <div className={`${classes.cell}`}>{team.user.email}</div>
                <div className={`${classes.cell}`}>
                  <label hidden={true} htmlFor={`${team.user._id}-readWrite`}>
                    Read & Write
                  </label>
                  <input
                    defaultChecked={Boolean(team.readAndWrite)}
                    onChange={(event) => setMyTeam(prev => prev.map((item, i) => i === index ? { ...item, readAndWrite: true, readOnly: false } : item))}
                    type="radio"
                    name={`${team.user._id}-options`}
                    id={`${team.user._id}-readWrite`}
                  />
                </div>
                <div className={`${classes.cell}`}>
                  <label hidden={true} htmlFor={`${team.user._id}-readOnly`}>Read Only</label>
                  <input
                    defaultChecked={Boolean(team.readOnly)}
                    onChange={(event) => setMyTeam(prev => prev.map((item, i) => i === index ? { ...item, readOnly: true, readAndWrite: false } : item))}
                    type="radio"
                    name={`${team.user._id}-options`}
                    id={`${team.user._id}-readOnly`}
                  />
                </div>
                <div className={`${classes.cell}`}>
                  <div onClick={()=>{deleteMyTeam(team.user.email)}} style={{cursor: 'pointer'}}>X</div>
                </div>
              </div>
            );
          })}

          {newTeam.map((team, index) => {
            return (
              <div key={team._id} className={`${classes.row}`}>
                <div className={`${classes.cell}`}>{team.user.email}</div>
                <div className={`${classes.cell}`}>
                  <label hidden={true} htmlFor={`${team.user._id}-readWrite`}>
                    Read & Write
                  </label>
                  <input
                    defaultChecked={Boolean(team.readAndWrite)}
                    onChange={(event) => setNewTeam(prev => prev.map((item, i) => i === index ? { ...item, readAndWrite: true, readOnly: false } : item))}
                    type="radio"
                    name={`${team.user._id}-options`}
                    id={`${team.user._id}-readWrite`}
                  />
                </div>
                <div className={`${classes.cell}`}>
                  <label hidden={true} htmlFor={`${team.user._id}-readOnly`}>Read Only</label>
                  <input
                    defaultChecked={Boolean(team.readOnly)}
                    onChange={(event) => setNewTeam(prev => prev.map((item, i) => i === index ? { ...item, readOnly: true, readAndWrite: false } : item))}
                    type="radio"
                    name={`${team.user._id}-options`}
                    id={`${team.user._id}-readOnly`}
                  />
                </div>
                <div className={`${classes.cell}`}>
                  <div style={{cursor: 'pointer'}}>X</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* <div className={classes.team}>
          <div className={classes.team__header}>My Team</div>
          <ul className={classes.team__persons}>
            {myTeam.map((team) => {
              return (
                <li
                  className={classes["team__persons--details"]}
                  key={team._id}
                >
                  <div>{team.user.email}</div>
                  <div>
                    <div style={{cursor: 'pointer'}} onClick={()=>{deleteMyTeam(team.user.email)}}>X</div>
                  </div>
                </li>
              );
            })}
            {newTeam.map((team) => {
              return (
                <li
                  className={classes["team__persons--details"]}
                  key={team._id}
                >
                  <div>{team.email}</div>
                  <div>
                    <div>X</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div> */}
        <div className={classes.button}>
          <div
            onClick={() => {
              onClose(false);
            }}
            className={classes.button__cancel}
          >
            Cancel
          </div>
          <div onClick={save} className={classes.button__save}>
            Save
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTeam;
