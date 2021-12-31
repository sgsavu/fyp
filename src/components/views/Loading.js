import React from "react";
import '../../styles/App.css';
import { useSelector } from "react-redux";
import Modal from "./Modal";
import { alerts } from "../../redux/app/appActions";

function Loading() {

  const app = useSelector((state) => state.app);


  const loadingBox = () => {
    return (
      <div>
        <h1>Loading</h1>
        <p>{app.alerts.loading.at(-1)}</p>
      </div>
    );
  }

  return (
    app.alerts.loading.length != 0? <Modal content={loadingBox}></Modal>: null
  );
}

export default Loading;