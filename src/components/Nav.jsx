import React from "react";
import classes from "./Nav.module.scss";
import { useDispatch } from "react-redux";
import { LoginStateActions } from "../store/LoginState-slice";
import { TodoListActions } from "../store/TodoLists-slice";

function Nav({ logIN }) {
  const dispatch = useDispatch();

  const Logout = () => {
    if(logIN) {
      dispatch(LoginStateActions.logOut());
      dispatch(TodoListActions.clearAll());
    }
  }

  return (
    <div>
      <div className={classes.navbar}>
        {logIN ? (
          <>
            <div className={classes.navbar__user}>{JSON.parse(logIN).userName}</div>
            <div className={classes.navbar__button}>
              <button onClick={Logout} className={classes["navbar__button--btn"]}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <div className={classes.navbar__user}></div>
            <div className={classes.navbar__button}>
              <button className={classes["navbar__button--btn"]}>Signup</button>
              <button className={classes["navbar__button--btn"]}>Login</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
