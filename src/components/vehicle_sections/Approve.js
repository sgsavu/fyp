import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callChainFunction, callViewChainFunction } from "../utils/GatewayParser";
import { alerts } from '../../redux/app/appActions';
import * as FaIcons from 'react-icons/fa';
import * as BsIcons from 'react-icons/bs';
import { GiMechanicGarage } from "react-icons/gi";
import Web3 from 'web3';
import { formatAccountAddress } from '../utils/Other';

function Approve({ vehicle }) {
    const dispatch = useDispatch();

    const blockchain = useSelector((state) => state.blockchain);

    const [garageAddress, setGarageAddress] = useState("")
    const [alreadyApproved, setAlreadyApproved] = useState("")

    useEffect(() => {
        const checkAnyApproved = async () => {
            var checkIfHasAnyApproved = await callViewChainFunction("getApprovedGarage", [vehicle.injected.id])
            if (checkIfHasAnyApproved !== 0x0000000000000000000000000000000000000000) {
                setAlreadyApproved(checkIfHasAnyApproved)
            }
        }
        checkAnyApproved()
    }, [])

    async function approve() {
        if (garageAddress) {
            if (Web3.utils.isAddress(garageAddress)) {
                dispatch(await callChainFunction("setApprovedGarage", [vehicle.injected.id, garageAddress]))
            }
            else {
                dispatch(alerts({ alert: "error", message: "Address is invalid." }))
            }
        }
    }

    const buttonClass = garageAddress ? "panel-button" : "panel-button-disabled"
    const circleClass = blockchain.pendingTx.length !== 0 ? "circle-loading" : "circle"

    return (
        <div className="panel">
            <div className="content">
                <div className={circleClass}>
                    <div className='circle-status'>
                        {blockchain.pendingTx.length !== 0 ? <BsIcons.BsThreeDots /> : <GiMechanicGarage />}
                    </div>
                </div>

                <p className="panel-heading">Approve Vehicle</p>
                <p>Approve your vehicle for a garage to modify it's data.</p>

                {alreadyApproved
                    ? (<p>
                        Approved garage: {formatAccountAddress(alreadyApproved)}
                    </p>)
                    : null
                }

                <div className='panel-input'>
                    <p>Set garage address:</p>
                    <div>
                        <input
                            placeholder='eg. 0xc1375A3812518208373474cCaB030CBb9cD9A499'
                            type="text"
                            value={garageAddress}
                            onChange={(e) => { setGarageAddress(e.target.value) }}
                        />
                    </div>
                </div>
            </div>
            
            <div className="panel-bottom-1">
                <div
                    className={buttonClass}
                    onClick={approve}
                >
                    <FaIcons.FaCheck />
                </div>
            </div>
        </div>
    );
}

export default Approve;