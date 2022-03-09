import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { weiToMyCurrency } from '../utils/PricesCoinsExchange'
import { getVehiclePrice, getTopBidder, callChainFunction, callViewChainFunction } from "../utils/BlockchainGateway";
import { alerts } from '../../redux/app/appActions';

function ListedVehicleOptions({ vehicle, settings }) {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);
    const isAuction = settings.isAuction
    const myPrefferedCurrency = settings.myCurrency

    const [desiredPrice, setDesiredPrice] = useState(0)
    const [displayPrice, setDisplayPrice] = useState(0);
    const [topBidder, setTopBidder] = useState("0x0000000000000000000000000000000000000000")
    const [typeToggle, setTypeToggle] = useState(false)

    useEffect(async () => {

        setDisplayPrice(await weiToMyCurrency(await callViewChainFunction("getVehiclePrice", [vehicle.injected.id])))
        if (isAuction) {
            setTopBidder(await callViewChainFunction("getTopBidder", [vehicle.injected.id]))
        }
    }, [])

    return (


        <div class="phone">
            <div class="content">
                <div className={blockchain.pendingTx.length != 0? "circle-loading" : "circle"}></div>
                <p class="heading">Vehicle Listed</p>
                <p> Listing Type: {isAuction ? "Auction" : "Instant"}</p>
                <p>
                    {isAuction ? topBidder != "0x0000000000000000000000000000000000000000" ? "Highest Bid: " : "Starting Price: " : "Price: "}
                    {displayPrice} {myPrefferedCurrency}</p>
                {topBidder != "0x0000000000000000000000000000000000000000" ? <p>Top Bidder: {topBidder}</p> : null}

                {!isAuction ?
                    <div>
                        <p>Update Price:</p>
                        <div>
                            <input type="number" value={desiredPrice} onChange={(e) => { setDesiredPrice(e.target.value) }}></input>
                        </div>
                        <div>
                            <label>{myPrefferedCurrency}</label>
                        </div>
                    </div>
                    :
                    null
                }

            </div>
            <div className={settings.isForSale && settings.isOwner ? "panel-bottom-2" : "panel-bottom-1"}>
                <p onClick={() => {
                    if (isAuction)
                        dispatch(callChainFunction("delistAuction", [vehicle.injected.id]))
                    else
                        dispatch(callChainFunction("delistInstant", [vehicle.injected.id]))
                }}>Delist</p>
                {isAuction ?
                    topBidder != "0x0000000000000000000000000000000000000000" ?
                        <div
                            className="panel-button"
                            onClick={() => {
                                dispatch(callChainFunction("concludeAuction", [vehicle.injected.id]))
                            }} ></div> : null
                    :
                    <div
                        className="panel-button"
                        onClick={() => {
                            if (desiredPrice > 0) {
                                dispatch(callChainFunction("setVehiclePrice", [vehicle.injected.id, desiredPrice]))
                            }
                            else {
                                dispatch(alerts({ alert: "other", message: "Cannot set price to 0." }))
                            }
                        }} ></div>

                }
            </div>
        </div>




    );
}

export default ListedVehicleOptions;