import React,{ useEffect } from "react";
import classes from "./Modal.module.scss";

function Modal(props) {
  const { onClose } = props;

  useEffect(() => {
    document.body.style.overflowY = "initial";

    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  return (
    <div
      onClick={() => {
        onClose(false);
      }}
      className={classes.modal}
    />
  );
}

export default Modal;
