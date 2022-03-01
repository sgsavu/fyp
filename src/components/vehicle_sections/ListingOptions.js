import React, { useState, useEffect } from 'react';
import { listForSale, listAuction, callChainFunction, callViewChainFunction } from "../utils/BlockchainGateway";
import { useDispatch, useSelector } from 'react-redux';
import { alerts } from '../../redux/app/appActions';
import { myCurrencyToWei } from '../utils/PricesCoinsExchange';


function ListingOptions({ vehicle, settings }) {

    const dispatch = useDispatch();
    const myPrefferedCurrency = settings.myCurrency
    const blockchain = useSelector((state) => state.blockchain);
    const [listingType, setListingType] = useState("INSTANT")
    const [desiredPrice, setDesiredPrice] = useState(0)

    useEffect(() => {
    }, [])

    return (
        <div>
            <div>
                <label>{listingType == "INSTANT" ? "Price: " : "Starting Price: "}</label>
                <input type="number" value={desiredPrice} onChange={(e) => { setDesiredPrice(e.target.value) }}></input>
                <label>{myPrefferedCurrency}</label>
            </div>
            <div>
                <select onChange={(e) => { setListingType(e.target.value) }}>
                    <option value="INSTANT">INSTANT</option>
                    <option value="AUCTION">AUCTION</option>
                </select>
            </div>
            <div>
                {listingType == "INSTANT" ?
                    <button onClick={ async () => {
                        if (desiredPrice > 0) {
                            if (await callViewChainFunction("getApproved",[vehicle.injected.id]) != blockchain.smartContracts[0]._address)
                                await dispatch(callChainFunction("approve",[vehicle.injected.id]))
                            dispatch(callChainFunction("listInstant",[vehicle.injected.id, desiredPrice]))
                        }
                        else {
                            dispatch(alerts({ alert: "other", message: "Cannot set price to 0." }))
                        }
                    }}>
                        List for sale
                    </button>
                    :
                    <button onClick={async () => {
                        if (desiredPrice > 0) {
                            if (await callViewChainFunction("getApproved",[vehicle.injected.id]) != blockchain.smartContracts[0]._address)
                                await dispatch(callChainFunction("approve",[vehicle.injected.id]))
                            dispatch(callChainFunction("listAuction",[vehicle.injected.id, desiredPrice]))
                        }
                        else {
                            dispatch(alerts({ alert: "other", message: "Cannot set price to 0." }))
                        }
                    }}>
                        List auction
                    </button>
                }
            </div>
        </div>
    );
}

export default ListingOptions;