import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIfIsTopBidder, callChainFunction, callViewChainFunction } from "../utils/BlockchainGateway";
import { myCurrencyToWei, weiToMyCurrency } from '../utils/Exchange'
import { alerts } from '../../redux/app/appActions';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';

import { getUserAccount } from '../../redux/reduxUtils';

function PurchaseOptions({ vehicle, settings }) {


    const dispatch = useDispatch();
    const myPrefferedCurrency = settings.myCurrency
    const isAuction = settings.isAuction
    const app = useSelector((state) => state.app);
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    const [desiredPrice, setDesiredPrice] = useState(0)
    const [displayPrice, setDisplayPrice] = useState(0)
    const [topBidder, setTopBidder] = useState("0x0")
    const [isTopBidder, setIsTopBidder] = useState(false)
    const [myBalance, setMyBalance] = useState(0)
    const [canBuy, setCanBuy] = useState(false)

    useEffect(async () => {

        var myBalanceRaw = await blockchain.web3.eth.getBalance(await getUserAccount())
        setMyBalance(await weiToMyCurrency(myBalanceRaw))
        var vehiclePriceRaw = await callViewChainFunction("getVehiclePrice", [vehicle.injected.id])
        setDisplayPrice(await weiToMyCurrency(vehiclePriceRaw))

       
        if (parseInt(myBalanceRaw) > parseInt(vehiclePriceRaw))
        {   
     
            setCanBuy(true)
        }

        if (isAuction) {
            setTopBidder(await callViewChainFunction("getTopBidder", [vehicle.injected.id]))
            setIsTopBidder(await getIfIsTopBidder(vehicle.injected.id))
        }

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

    return (



        <div class="phone">
            <div class="content">
                <div className={blockchain.pendingTx.length != 0 ? "circle-loading" : "circle"}>
                    <div className='circle-status'>
                        {blockchain.pendingTx.length != 0 ? <BsIcons.BsThreeDots /> : <AiIcons.AiFillCar />}
                    </div>
                </div>

                <p class="panel-heading">{isAuction ? "Bid Vehicle" : "Purchase Vehicle"}</p>
                
                <p>
                    My Balance: {myBalance} {myPrefferedCurrency}
                </p>
                <p>{isAuction ? topBidder != "0x0000000000000000000000000000000000000000" ? "Top Bid: " : "Starting Price: " : "Price: "} {displayPrice} {myPrefferedCurrency}</p>

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
                    <div>
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
            <div className="panel-bottom-1">
                <div
                    className={canBuy ? "panel-button" : "panel-button-disabled"}
                    onClick={async () => {
                        
                        await buyOrBid()
                    }} >
                    <FaIcons.FaCheck />
                </div>
            </div>
        </div>



    );
}

export default PurchaseOptions;