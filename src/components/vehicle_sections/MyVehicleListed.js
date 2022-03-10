import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { myCurrencyToWei, weiToMyCurrency } from '../utils/Exchange'
import { getVehiclePrice, getTopBidder, callChainFunction, callViewChainFunction } from "../utils/GatewayParser";
import { alerts } from '../../redux/app/appActions';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';

function MyVehicleListed({ vehicle }) {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);

    const [desiredPrice, setDesiredPrice] = useState(0)
    const [displayPrice, setDisplayPrice] = useState(0);
    const [topBidder, setTopBidder] = useState("0x0000000000000000000000000000000000000000")
    const [isAuction, setIsAuction] = useState(false)

    useEffect(async () => {

        var isForSale = await callViewChainFunction("isForSale", [vehicle.injected.id])
        var isAuction = await callViewChainFunction("isAuction", [vehicle.injected.id])
        setIsAuction(isForSale)
        setIsAuction(isAuction)

        if (isForSale) {
            setDisplayPrice(await weiToMyCurrency(await callViewChainFunction("getVehiclePrice", [vehicle.injected.id])))
            if (isAuction) {
                setTopBidder(await callViewChainFunction("getTopBidder", [vehicle.injected.id]))
            }
        }

        setDesiredPrice(0)
    }, [data])

    function delist() {
        if (isAuction)
            dispatch(callChainFunction("delistAuction", [vehicle.injected.id]))
        else
            dispatch(callChainFunction("delistInstant", [vehicle.injected.id]))
    }

    return (


        <div class="phone">
            <div class="content">

                <div className={blockchain.pendingTx.length != 0 ? "circle-loading" : "circle"}>
                    <div className='circle-status'>
                        {blockchain.pendingTx.length != 0 ? <BsIcons.BsThreeDots /> : <FaIcons.FaCheck />}
                    </div>
                </div>

                <div>
                    <p class="panel-heading">Vehicle Listed</p>
                </div>

                <div >
                    <p>Type: {isAuction ? "Auction" : "Instant"}</p>
                    <p>
                        {isAuction ? topBidder != "0x0000000000000000000000000000000000000000" ? "Highest Bid: " : "Starting Price: " : "Price: "}
                        {displayPrice} {data.displayCurrency}</p>
                    {topBidder != "0x0000000000000000000000000000000000000000" ? <p>Top Bidder: {topBidder}</p> : null}
                </div>


                {!isAuction
                    ?
                    <div className='panel-input'>
                        <p>Update Price:</p>
                        <div>
                            <input type="number" value={desiredPrice} onChange={(e) => { setDesiredPrice(e.target.value) }}></input>
                        </div>
                        <div>
                            <label>{data.displayCurrency}</label>
                        </div>
                    </div>
                    :
                    null
                }

            </div>
            <div className="panel-bottom-2">
                <p onClick={() => {
                    delist()
                }}>Delist</p>
                {isAuction
                    ?
                    topBidder != "0x0000000000000000000000000000000000000000"
                        ?
                        <div
                            className="panel-button"
                            onClick={() => {
                                dispatch(callChainFunction("concludeAuction", [vehicle.injected.id]))
                            }} >
                        </div>
                        :
                        null
                    :
                    desiredPrice > 0
                        ? <div
                            className={desiredPrice > 0 ? "panel-button" : "panel-button-disabled"}
                            onClick={async () => {
                                dispatch(callChainFunction("setVehiclePrice", [vehicle.injected.id, await myCurrencyToWei(desiredPrice)]))
                            }}>
                            <FaIcons.FaCheck />
                        </div>
                        : null
                }
            </div>
        </div>




    );
}

export default MyVehicleListed;