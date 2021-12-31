import React, { useEffect } from "react";
import '../../styles/modal.css';
import { useDispatch, useSelector } from "react-redux";
import { alerts, updateState } from "../../redux/blockchain/blockchainActions";
import Modal from "./Modal";


function CustomModal() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);


  const dismiss = () =>{
    dispatch(alerts())
  }

  const alertBox = () => {
    return (
      <div>
        <h1>Alert</h1>
        <p>{blockchain.alerts.at(-1)}</p>
        <button onClick={dismiss}>Dismiss</button>
      </div>
    );
  }

  return (
    blockchain.alerts.length != 0? <Modal content={alertBox}></Modal>: null
  );
}

export default CustomModal;