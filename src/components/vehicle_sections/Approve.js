import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIfIsTopBidder, callChainFunction, callViewChainFunction } from "../utils/GatewayParser";
import { myCurrencyToWei, weiToMyCurrency } from '../utils/Exchange'
import { alerts } from '../../redux/app/appActions';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';

import { getUserAccount } from '../../redux/reduxUtils';

import { GiMechanicGarage } from "react-icons/gi";
import Web3 from 'web3';
import { formatAccountAddress } from '../utils/Other';


/**
 * Component used for approving addresses as garages for the vehicle passed as prop
 * @param vehicle the vehicle for which we wish to approve
 */
function Approve({ vehicle }) {


    const dispatch = useDispatch();

    const app = useSelector((state) => state.app);
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    const [garageAddress, setGarageAddress] = useState("")
    const [alreadyApproved, setAlreadyApproved] = useState("")

    useEffect(async () => {
        var checkIfHasAnyApproved = await callViewChainFunction("getApprovedGarage", [vehicle.injected.id])
        if (checkIfHasAnyApproved != 0x0000000000000000000000000000000000000000) {
            setAlreadyApproved(checkIfHasAnyApproved)
        }
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


    function buttonOnOrOff() {
        if (garageAddress) {
            return "panel-button"
        }
        else {
            return "panel-button-disabled"
        }
    }


    return (



        <div className="panel">
            <div className="content">

                <div className={blockchain.pendingTx.length != 0 ? "circle-loading" : "circle"}>
                    <div className='circle-status'>
                        {blockchain.pendingTx.length != 0 ? <BsIcons.BsThreeDots /> : <GiMechanicGarage />}
                    </div>
                </div>

                <p className="panel-heading">Approve Vehicle</p>

                <p>
                    Approve your vehicle for a garage to modify it's data.
                </p>
                {alreadyApproved ? <p>
                    Approved garage: {formatAccountAddress(alreadyApproved)}
                </p> : null}

                <div className='panel-input'>
                    <p>Set garage address:</p>
                    <div>
                        <input placeholder='eg. 0xc1375A3812518208373474cCaB030CBb9cD9A499' type="text" value={garageAddress} onChange={(e) => { setGarageAddress(e.target.value) }}></input>
                    </div>
                </div>



            </div>
            <div className="panel-bottom-1">
                <div
                    className={buttonOnOrOff()}
                    onClick={approve} >
                    <FaIcons.FaCheck />
                </div>
            </div>
        </div>



    );
}

export default Approve;