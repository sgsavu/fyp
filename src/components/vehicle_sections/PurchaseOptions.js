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

    const [desiredPrice, setDesiredPrice] = useState(0)
    const [displayPrice, setDisplayPrice] = useState(0)
    const [topBidder, setTopBidder] = useState("0x0")
    const [isTopBidder, setIsTopBidder] = useState(false)

    useEffect(async () => {
        setDisplayPrice(await weiToMyCurrency(await callViewChainFunction("getVehiclePrice",[vehicle.injected.id])))
        if (isAuction) {
            setTopBidder(await callViewChainFunction("getTopBidder",[vehicle.injected.id]))
            setIsTopBidder(await getIfIsTopBidder(vehicle.injected.id))
        }
    }, [app.alerts.loading])

    return (
        <div>
            <p>{isAuction ? "Highest Bid: " : "Price: "} {displayPrice} {myPrefferedCurrency}</p>
            <div>
                {isAuction ?
                    <div>
                        <div>
                            <input type="number" value={desiredPrice} onChange={(e) => { setDesiredPrice(e.target.value) }}></input>
                            <label>{myPrefferedCurrency}</label>
                            <button onClick={() => {
                                if (desiredPrice > displayPrice)
                                    dispatch(callChainFunction("bidVehicle",[vehicle.injected.id, desiredPrice]))
                                else
                                    dispatch(alerts({ alert: "other", message: "Your price needs to be higher than the current top bid." }))

                            }}>
                                Bid
                            </button>
                        </div>
                        <div>
                            {topBidder != "0x0000000000000000000000000000000000000000" ?
                                isTopBidder ?
                                    <p>You are the top bidder.</p>
                                    :
                                    <p>Top Bidder: {topBidder}</p>

                                :
                                <p>No bids yet.</p>
                            }
                        </div>
                    </div>
                    :
                    <button onClick={() => {
                        if (blockchain.account) {
                            dispatch(callChainFunction("buyVehicle",[vehicle.injected.id]))
                        }
                        else {
                            dispatch(alerts({ alert: "other", message: "You need to login." }))
                        }
                    }}>
                        Buy
                    </button>
                }
            </div>

        </div>
    );
}

export default PurchaseOptions;