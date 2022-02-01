import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { weiToMyCurrency } from '../utils/PricesCoinsExchange'
import { getUserAccount, concludeAuction, setVehiclePrice, removeFromSale, getVehicleHistory, ownerOf, getVehiclePrice, getContractBalance, getIfForSale, getIfAuction, getTopBidder } from "../utils/BlockchainGateway";
import { alerts } from '../../redux/app/appActions';


function ListedVehicleOptions({ vehicle, settings }) {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);
    const isAuction = settings.isAuction
    const myPrefferedCurrency = settings.myCurrency

    const [desiredPrice, setDesiredPrice] = useState(0)
    const [displayPrice, setDisplayPrice] = useState(0);
    const [topBidder, setTopBidder] = useState("0x0")

    useEffect(async () => {

        setDisplayPrice(await weiToMyCurrency(await getVehiclePrice(vehicle.injected.id)))
        if (isAuction) {
            setTopBidder(await getTopBidder(vehicle.injected.id))
        }
    }, [])

    return (
        <div>
            <p>
                {isAuction ? topBidder != "0x0000000000000000000000000000000000000000" ? "Highest Bid: " : "Starting price: " : "Price: "}
                {displayPrice} {myPrefferedCurrency}</p>

            {isAuction ?
                <div>
                    {topBidder != "0x0000000000000000000000000000000000000000" ?
                        <button onClick={() => {
                            dispatch(concludeAuction(vehicle.injected.id))
                        }}>
                            Conclude Auction
                        </button>
                        :
                        null
                    }

                </div>
                :
                <div>
                    <div>
                        <input type="number" value={desiredPrice} onChange={(e) => { setDesiredPrice(e.target.value) }}></input>
                        <label>{myPrefferedCurrency}</label>
                        <button onClick={() => {
                            if (desiredPrice > 0) {
                                dispatch(setVehiclePrice(vehicle.injected.id, desiredPrice))
                            }
                            else {
                                dispatch(alerts({ alert: "other", message: "Cannot set price to 0." }))
                            }
                        }}>
                            Update Price
                        </button>
                    </div>
                </div>
            }
            <button onClick={() => {
                dispatch(removeFromSale(vehicle.injected.id))
            }}>
                Delist Vehicle
            </button>


        </div>
    );
}

export default ListedVehicleOptions;