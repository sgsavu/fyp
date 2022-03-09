import React, { useState, useEffect } from 'react';
import { listForSale, listAuction, callChainFunction, callViewChainFunction, getContractFor } from "../utils/BlockchainGateway";
import { useDispatch, useSelector } from 'react-redux';
import { alerts } from '../../redux/app/appActions';
import { myCurrencyToWei } from '../utils/PricesCoinsExchange';


function ListingOptions({ vehicle, settings }) {

    const dispatch = useDispatch();
    const myPrefferedCurrency = settings.myCurrency
    const blockchain = useSelector((state) => state.blockchain);
    const [desiredPrice, setDesiredPrice] = useState(0)
    const [typeToggle, setTypeToggle] = useState(false)

    useEffect(() => {
    }, [])


    async function listVehicle() {
        if (desiredPrice > 0) {
            if (await callViewChainFunction("getApproved", [vehicle.injected.id]) != (await getContractFor("methods","buy"))._address) {
                await dispatch(callChainFunction("approve", [vehicle.injected.id]))
            }

            if (!typeToggle) {
                dispatch(callChainFunction("listInstant", [vehicle.injected.id, desiredPrice]))
            }
            else {
                dispatch(callChainFunction("listAuction", [vehicle.injected.id, desiredPrice]))
            }
        }
        else {
            dispatch(alerts({ alert: "other", message: "Cannot set price to 0." }))
        }
    }

    return (

        
            <div class="phone">
                <div class="content">
                    <div className={blockchain.pendingTx.length != 0? "circle-loading" : "circle"}></div>
                    <p class="heading">List your vehicle</p>
                    <p>Simply select the type of listing and set a price.</p>
                    <div className="boss" onClick={() => setTypeToggle(!typeToggle)}>
                        <div className={typeToggle ? "toggle-right" : "toggle-left"}></div>
                        <div class="options">
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
                            <label>{myPrefferedCurrency}</label>
                        </div>
                    </div>
                </div>
                <div className="panel-bottom-1">
                    <div
                        className="panel-button"
                        onClick={async () => {
                            await listVehicle()
                        }}>
                    </div>
                </div>
            </div>
       



    );
}

export default ListingOptions;