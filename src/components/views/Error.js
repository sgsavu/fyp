import React, { useEffect } from "react";
import '../../styles/modal.css';
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { alerts } from "../../redux/app/appActions";



function Error() {

  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);

  const reload = () =>{
    window.location.reload();
  }

  const dismiss = () =>{
    dispatch(alerts({ alert: "error" }))
  }

  const errorBox = () => {
    return (
      <div>
        <h1>Error</h1>
        <p>{app.alerts.error.at(-1)}</p>
        <button onClick={dismiss}>Dismiss</button>
      </div>
    );
  }

  return (
    app.alerts.error.length != 0? <Modal content={errorBox}></Modal>: null
  );
}

export default Error;