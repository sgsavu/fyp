import React, { useEffect } from "react";
import '../../styles/modal.css';
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { alerts } from "../../redux/app/appActions";


function CustomModal() {

  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);


  const dismiss = () =>{
    dispatch(alerts("other"))
  }

  const alertBox = () => {
    return (
      <div>
        <h1>Alert</h1>
        <p>{app.alerts.other.at(-1)}</p>
        <button onClick={dismiss}>Dismiss</button>
      </div>
    );
  }

  return (
    app.alerts.other.length != 0? <Modal content={alertBox}></Modal>: null
  );
}

export default CustomModal;