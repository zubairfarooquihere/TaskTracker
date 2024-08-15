import React from "react";
import Modal from "../Modal/Modal";

import classes from "./ConfirmBox.module.scss";

function ConfirmBox(props) {
  const {title, message, okFunc, cancelFunc} = props;
  const cancel = () => {
    cancelFunc()
  }
  const ok = () => {
    okFunc();
  }

  return (
    <>
      <Modal onClose={cancelFunc} />
      <div className={classes.ConfirmBox}>
        <div className={classes.ConfirmBox__title}>{title}</div>
        <div className={classes.border} />
        <p className={classes.ConfirmBox__info}>{message}</p>
        <div className={classes.ConfirmBox__buttons}>
            <button onClick={cancel} className={`${classes['ConfirmBox__buttons--Cancel']} ${classes['ConfirmBox__buttons--btn']}`}>Cancel</button>
            <button onClick={ok} className={`${classes['ConfirmBox__buttons--Save']} ${classes['ConfirmBox__buttons--btn']}`}>Ok</button>
        </div>
      </div>
    </>
  );
}

export default ConfirmBox;
