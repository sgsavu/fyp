import React from "react";
import '../../styles/App.css';
import { useSelector } from "react-redux";
import Modal from "./Modal";

function Loading() {

  const blockchain = useSelector((state) => state.blockchain);

  const loadingBox = () => {
    return (
      <div>
        <h1>Loading</h1>
        <p>{blockchain.loading[blockchain.loading.length-1]}</p>
      </div>
    );
  }

  return (
    blockchain.loading.length != 0? <Modal content={loadingBox}></Modal>: null
  );
}

export default Loading;