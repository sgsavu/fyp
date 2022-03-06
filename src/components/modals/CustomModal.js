import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../views/Modal";
import { alerts } from "../../redux/app/appActions";


function CustomModal() {

  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);


  const dismiss = () =>{
    dispatch(alerts({ alert: "other" }))
  }

  const alertBox = () => {
    return (
      <div>
        <h1>Alert</h1>
        <p>{app.alerts.other.at(-1).message}</p>
        {app.alerts.other.at(-1).url? <a href={app.alerts.other.at(-1).url} target="_blank">View 🔗</a> : null }
        <div>
        <button onClick={dismiss}>Dismiss</button>
        </div>
      </div>
    );
  }

  return (
    app.alerts.other.length != 0? <Modal content={alertBox}></Modal>: null
  );
}

export default CustomModal;