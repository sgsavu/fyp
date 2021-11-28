import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { listForSale, listAuction, setVehiclePrice, removeFromSale, getVehicleHistory, ownerOf, getVehiclePrice, getContractBalance, getIfForSale, getIfAuction, getTopBidder, getTopBid, getIfExists } from "../../redux/blockchain/blockchainUtils";

function ListingOptions({vehicle,settings}) {

    const data = useSelector((state) => state.data);

    const [listingType, setListingType] = useState("INSTANT")
    const [desiredPrice, setDesiredPrice] = useState(0)
    const myPrefferedCurrency = settings.myCurrency

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
                    <button onClick={(e) => {

                        e.preventDefault()
                        if (desiredPrice > 0) {
                            listForSale(vehicle.injected.id,desiredPrice)
                        }
                    }}>
                        List for sale
                    </button>
                    :
                    <button onClick={(e) => {

                        e.preventDefault()

                        listAuction(vehicle.injected.id,desiredPrice)

                    }}>
                        List auction
                    </button>
                }

            </div>
        </div>
    );
}

export default ListingOptions;