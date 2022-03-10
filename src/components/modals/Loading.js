import React from "react";
import '../../styles/Loading2.css';
import '../../styles/Loading4.css';
import { useSelector } from "react-redux";
import Modal from "./Modal";

function Loading() {

  const app = useSelector((state) => state.app);

  // <div className="spinner"></div>


  const loadingBox = () => {
    return (
      <div className="jambula">
        <div>
          <h1>Loading</h1>
          <p>{app.alerts.loading.at(-1)}</p>
        </div>
      

        <div className="jambula">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>

      </div>
    );
  }

  return (
    app.alerts.loading.length != 0 ? <Modal content={loadingBox}></Modal> : null
  );
}

export default Loading;