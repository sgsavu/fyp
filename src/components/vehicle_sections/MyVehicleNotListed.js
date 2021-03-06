import React, { useState, useEffect } from 'react';
import { listForSale, listAuction, callChainFunction, callViewChainFunction, getContractFor } from "../utils/GatewayParser";
import { useDispatch, useSelector } from 'react-redux';
import { alerts } from '../../redux/app/appActions';
import { myCurrencyToWei } from '../utils/Exchange';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';
import { Stack } from '@mui/material';

/**
 * Component to display the view of the management tab for when the vehicle
 * you are seeing is yours and not listed.
 * @param vehicle the vehicle in question
 */
function MyVehicleNotListed({ vehicle }) {

    const dispatch = useDispatch();
 
    const app = useSelector((state) => state.app);
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [desiredPrice, setDesiredPrice] = useState(0)
    const [typeToggle, setTypeToggle] = useState(false)
    const [approved, setApproved] = useState(false)

    useEffect(async () => {
        if (await callViewChainFunction("getApproved", [vehicle.injected.id]) == (await getContractFor("methods", "buy"))._address) {
            setApproved(true)
        }
    }, [data.approval])


    async function listVehicle() {
        if (desiredPrice > 0) {
            var convertedPrice = await myCurrencyToWei(desiredPrice)
            var marketContractAddress = (await getContractFor("methods", "buy"))._address

            if (await callViewChainFunction("getApproved", [vehicle.injected.id]) != marketContractAddress) {
                await dispatch(callChainFunction("approve", [marketContractAddress, vehicle.injected.id]))
            }

            if (!typeToggle) {
                dispatch(callChainFunction("listInstant", [vehicle.injected.id, convertedPrice]))
            }
            else {
                dispatch(callChainFunction("listAuction", [vehicle.injected.id, convertedPrice]))
            }
        }
    }

    return (


        <div className="panel">
            <div className="content">
                <div className={blockchain.pendingTx.length != 0 ? "circle-loading" : "circle"}>
                    <div className='circle-status'>
                        {blockchain.pendingTx.length != 0 ? <BsIcons.BsThreeDots /> : typeToggle ? <RiIcons.RiAuctionFill /> : <IoIcons.IoIosCash />}
                    </div>
                </div>
                <p className="panel-heading">List your vehicle</p>
                <p>Simply select the type of listing and set a price.</p>
                <div className="toggler" onClick={() => setTypeToggle(!typeToggle)}>
                    <div className={typeToggle ? "toggle-right" : "toggle-left"}></div>
                    <div 
                    className='options'>
                        <p className={typeToggle ? "optionOff" : "optionOn"}>Instant</p>
                        <p className={typeToggle ? "optionOn" : "optionOff"}>Auction</p>
                    </div>
                </div>
                <div>
                    <label>{!typeToggle ? "Price: " : "Starting Price: "}</label>
                    <div>
                        <input type="number" value={desiredPrice} onChange={(e) => { setDesiredPrice(e.target.value) }}></input>
                    </div>
                    <div>
                        <label>{data.displayCurrency}</label>
                    </div>
                </div>

                <Stack marginTop="60px" flexDirection="row" display="flex" justifyContent="space-between" alignItems="center" >
                    <div className={approved? 'mark-on' : 'mark-off' }>
                        1. Approve
                    </div>
                    <div className="mark"></div>
                    <div className='mark-off'>
                        2. ListVHC
                    </div>
                </Stack>


            </div>
            <div className="panel-bottom-1">
                <div
                    className={desiredPrice > 0 ? "panel-button" : "panel-button-disabled"}
                    onClick={async () => {
                        await listVehicle()
                    }}>
                    <FaIcons.FaCheck />
                </div>
            </div>
        </div>




    );
}

export default MyVehicleNotListed;