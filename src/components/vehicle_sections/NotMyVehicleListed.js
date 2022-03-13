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

function NotMyVehicleListed({ vehicle }) {


    const dispatch = useDispatch();

    const app = useSelector((state) => state.app);
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    const [desiredPrice, setDesiredPrice] = useState(0)
    const [displayPrice, setDisplayPrice] = useState(9999)
    const [topBidder, setTopBidder] = useState("0x0")
    const [isForSale, setIsForSale] = useState(false)
    const [isAuction, setIsAuction] = useState(false)
    const [isTopBidder, setIsTopBidder] = useState(false)
    const [myBalance, setMyBalance] = useState(0)
    const [canBuy, setCanBuy] = useState(false)

    useEffect(async () => {

        var isForSale = await callViewChainFunction("isForSale", [vehicle.injected.id])
        var isAuction = await callViewChainFunction("isAuction", [vehicle.injected.id])
        setIsAuction(isAuction)

        if (isForSale) {
            var vehiclePriceRaw = await callViewChainFunction("getVehiclePrice", [vehicle.injected.id])
            setDisplayPrice(await weiToMyCurrency(vehiclePriceRaw))
            if (isAuction) {
                setTopBidder(await callViewChainFunction("getTopBidder", [vehicle.injected.id]))
                setIsTopBidder(await getIfIsTopBidder(vehicle.injected.id))
            }
        }

        if (blockchain.account) {
            var myBalanceRaw = await blockchain.web3.eth.getBalance(await getUserAccount())
            setMyBalance(await weiToMyCurrency(myBalanceRaw))

            if (parseInt(myBalanceRaw) > parseInt(vehiclePriceRaw)) {
                setCanBuy(true)
            }
        }

        setDesiredPrice(0)

    }, [data])



    async function buyOrBid() {
        if (canBuy)
            if (blockchain.account) {
                if (isAuction) {
                    if (desiredPrice > displayPrice)
                        dispatch(callChainFunction("bid", [vehicle.injected.id], { value: await myCurrencyToWei(desiredPrice) }))
                    else
                        dispatch(alerts({ alert: "other", message: "Your price needs to be higher than the current top bid." }))
                }
                else {
                    dispatch(callChainFunction("buy", [vehicle.injected.id], { value: await callViewChainFunction("getVehiclePrice", [vehicle.injected.id]) }))
                }
            }
            else {
                dispatch(alerts({ alert: "other", message: "You need to login." }))
            }
    }

    function buttonOnOrOff () {
        if (canBuy){
            if (isAuction){
                if (desiredPrice > displayPrice)
                {
                    return "panel-button"
                }
                else {
                    return "panel-button-disabled"
                }
            }
            else {
                return "panel-button"
            }
        }
        else {
            return "panel-button-disabled"
        }
    }


    return (



        <div className="phone">
            <div className="content">
                <div className={blockchain.pendingTx.length != 0 ? "circle-loading" : "circle"}>
                    <div className='circle-status'>
                        {blockchain.pendingTx.length != 0 ? <BsIcons.BsThreeDots /> : <AiIcons.AiFillCar />}
                    </div>
                </div>

                <p className="panel-heading">{isAuction ? "Bid Vehicle" : "Purchase Vehicle"}</p>

                <p>
                    My Balance: {myBalance} {data.displayCurrency}
                </p>
                <p>{isAuction ? topBidder != "0x0000000000000000000000000000000000000000" ? "Top Bid: " : "Starting Price: " : "Price: "} {displayPrice} {data.displayCurrency}</p>

                <div>
                    {isAuction && topBidder != "0x0000000000000000000000000000000000000000" ?
                        isTopBidder ?
                            <p>You are the top bidder.</p>
                            :
                            <p>Top Bidder: {topBidder}</p>

                        :
                        null
                    }
                </div>



                {isAuction ?
                    <div className='panel-input'>
                        <p>My Bid:</p>
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
            <div className="panel-bottom-1">
                <div
                    className={buttonOnOrOff}
                    onClick={async () => {
                        await buyOrBid()
                    }} >
                    <FaIcons.FaCheck />
                </div>
            </div>
        </div>



    );
}

export default NotMyVehicleListed;