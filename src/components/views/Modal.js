import React, { useEffect, useState } from "react";
import '../../styles/modal.css';
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "../../redux/blockchain/blockchainActions";




const Modal = ({ content }) => {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    const reload = () => {
        window.location.reload();
    }
    
    return (
        <div className="overlay" >
            <div className="popup">
                {content()}
            </div>
        </div>
    );
}

export default Modal;