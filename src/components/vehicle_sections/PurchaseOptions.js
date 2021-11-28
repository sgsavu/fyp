import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

import { getTopBid, getTopBidder, getVehiclePrice, buyVehicle, bidVehicle } from "../../redux/blockchain/blockchainUtils";
import { EthToWei, myCurrencyToWei, currencyToCurrency, WeiToEth, weiToMyCurrency } from '../../utils/PricesCoinsExchange'



function PurchaseOptions({vehicle, settings}) {

    const data = useSelector((state) => state.data);
    const [desiredPrice, setDesiredPrice] = useState(0)
    const [displayPrice, setDisplayPrice] = useState(0);
    const myPrefferedCurrency = settings.myCurrency
    const isAuction = settings.isAuction
    const [topBidder, setTopBidder] = useState("0x0")
    const [isTopBidder, setIsTopBidder] = useState(false)

    const [topBid, setTopBid] = useState(0);

    useEffect( async () => {
        setDisplayPrice(await weiToMyCurrency(await getVehiclePrice(vehicle.injected.id)))
        if (isAuction == true) {
            setTopBidder(await getTopBidder(vehicle.injected.id))
            console.log("topbidder", await getTopBidder(vehicle.injected.id))

            setIsTopBidder( await isTopBidder())
        }
        let topBid = await getTopBid(vehicle.injected.id)
        setTopBid(await weiToMyCurrency(topBid))

    }, [])

    return (
        <div>
            <p>
            {settings.isAuction ? "Highest Bid: " : "Price: "}
            {displayPrice} {myPrefferedCurrency}</p>

            {settings.isAuction ?
                <div>
                    <input type="number" value={desiredPrice} onChange={(e) => { setDesiredPrice(e.target.value) }}></input>
                    <label>{myPrefferedCurrency}</label>
                    <button onClick={(e) => {
                        e.preventDefault()
                        bidVehicle(vehicle.injected.id,desiredPrice)
                    }}>
                        Bid
                    </button>
                </div> :
                <div>
                    <button onClick={(e) => {
                        e.preventDefault()
                        buyVehicle(vehicle.injected.id)
                    }}>
                        Buy
                    </button>
                </div>
            }
            {isTopBidder ?
                        <div>
                            <p>You are the top bidder with {topBid} {myPrefferedCurrency} </p>
                        </div>
                        : null}
        </div>
    );
}

export default PurchaseOptions;