import React from "react";
import '../../styles/Loading2.css';
import '../../styles/Loading4.css';
import { useSelector } from "react-redux";
import Modal from "../views/Modal";

function Loading() {

  const app = useSelector((state) => state.app);

  //        <div class="spinner"></div>


  const loadingBox = () => {
    return (
      <div className="jambula">
        <div>
          <h1>Loading</h1>
          <p>{app.alerts.loading.at(-1)}</p>
        </div>
      

        <div class="jambula">
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
        </div>

      </div>
    );
  }

  return (
    app.alerts.loading.length != 0 ? <Modal content={loadingBox}></Modal> : null
  );
}

export default Loading;