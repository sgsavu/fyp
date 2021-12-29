import React, { useEffect } from "react";
import '../../styles/modal.css';
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "../../redux/blockchain/blockchainActions";
import Modal from "./Modal";



function Error() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const reload = () =>{
    window.location.reload();
  }

  const dismiss = () =>{
    dispatch(updateState({ field: "errorMsg", value: "" }))
  }

  const errorBox = () => {
    return (
      <div>
        <h1>Error</h1>
        <p>{blockchain.errorMsg}</p>
        <button onClick={dismiss}>Dismiss</button>
      </div>
    );
  }

  return (
      blockchain.errorMsg ? <Modal content={errorBox}></Modal>: null
  );
}

export default Error;