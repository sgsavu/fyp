import React, { useState, useEffect } from 'react';
import { listForSale, listAuction } from "../../utils/BlockchainGateway";
import { useDispatch } from 'react-redux';
import { fetchMyData } from '../../redux/data/dataActions';


function ListingOptions({ vehicle, settings }) {

    const dispatch = useDispatch();
    const myPrefferedCurrency = settings.myCurrency

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
                    <button onClick={() => {
                        if (desiredPrice > 0) {
                            listForSale(vehicle.injected.id, desiredPrice).then((receipt) => {
                                console.log(receipt);
                                dispatch(fetchMyData());
                            });
                        }
                    }}>
                        List for sale
                    </button>
                    :
                    <button onClick={() => {
                        if (desiredPrice > 0) {
                            listAuction(vehicle.injected.id, desiredPrice).then((receipt) => {
                                console.log(receipt);
                                dispatch(fetchMyData());
                            });
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