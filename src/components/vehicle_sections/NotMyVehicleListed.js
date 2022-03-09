import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIfIsTopBidder, callChainFunction, callViewChainFunction } from "../utils/BlockchainGateway";
import { weiToMyCurrency } from '../utils/PricesCoinsExchange'
import { alerts } from '../../redux/app/appActions';

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

    useEffect(async () => {
        setDisplayPrice(await weiToMyCurrency(await callViewChainFunction("getVehiclePrice", [vehicle.injected.id])))
        if (isAuction) {
            setTopBidder(await callViewChainFunction("getTopBidder", [vehicle.injected.id]))
            setIsTopBidder(await getIfIsTopBidder(vehicle.injected.id))
        }
    }, [data])

    async function buyOrBid() {
        if (blockchain.account) {
            if (isAuction) {
                if (desiredPrice > displayPrice)
                    dispatch(callChainFunction("bid", [vehicle.injected.id, desiredPrice]))
                else
                    dispatch(alerts({ alert: "other", message: "Your price needs to be higher than the current top bid." }))
            }
            else {
                dispatch(callChainFunction("buy", [vehicle.injected.id]))
            }
        }
        else {
            dispatch(alerts({ alert: "other", message: "You need to login." }))
        }
    }

    return (


       
            <div class="phone">
                <div class="content">
                    <div className={blockchain.pendingTx.length != 0? "circle-loading" : "circle"}></div>
                    <p class="heading">{isAuction ? "Bid Vehicle" : "Purchase Vehicle"}</p>

                    <p>{isAuction ? topBidder != "0x0000000000000000000000000000000000000000"? "Top Bid: " : "Starting Price: " : "Price: "} {displayPrice} {myPrefferedCurrency}</p>

                    <div>
                        { isAuction && topBidder != "0x0000000000000000000000000000000000000000" ?
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
                        className="panel-button"
                        onClick={async () => {
                            await buyOrBid()
                        }} >
                    </div>
                </div>
            </div>
     


    );
}

export default PurchaseOptions;