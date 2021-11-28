import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { EthToWei, myCurrencyToWei, currencyToCurrency, WeiToEth, weiToMyCurrency } from '../../utils/PricesCoinsExchange'
import { getUserAccount, concludeAuction, setVehiclePrice, removeFromSale, getVehicleHistory, ownerOf, getVehiclePrice, getContractBalance, getIfForSale, getIfAuction, getTopBidder, getTopBid, getIfExists } from "../../redux/blockchain/blockchainUtils";
import { fetchAllData } from '../../redux/data/dataActions';


function ListedVehicleOptions({vehicle,settings}) {

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);
    const [listingType, setListingType] = useState("INSTANT")
    const [desiredPrice, setDesiredPrice] = useState(0)
    const isAuction = settings.isAuction
    const myPrefferedCurrency = settings.myCurrency
    const [displayPrice, setDisplayPrice] = useState(0);
    const [topBidder, setTopBidder] = useState("0x0")

    useEffect(async () => {
        setDisplayPrice(await weiToMyCurrency(await getVehiclePrice(vehicle.injected.id)))

        if (isAuction == true) {
            setTopBidder(await getTopBidder(vehicle.injected.id))
            console.log("topbidder", await getTopBidder(vehicle.injected.id))
        }

    }, [])

    return (
        <div>
            <p>
                {isAuction ? "Highest Bid: " : "Price: "}
                {displayPrice} {myPrefferedCurrency}</p>

            {isAuction ? 
            <div>
                {topBidder != "0x0000000000000000000000000000000000000000" ? <button onClick={(e) => {
                    e.preventDefault()
                    concludeAuction(vehicle.injected.id)
                }}>
                    Conclude Auction
                </button> : null}

            </div> : 
            <div>
                <div>
                    <input type="number" value={desiredPrice} onChange={(e) => { setDesiredPrice(e.target.value) }}></input>
                    <label>{myPrefferedCurrency}</label>
                    <button onClick={(e) => {
                    e.preventDefault()
                    setVehiclePrice(vehicle.injected.id,desiredPrice)
                }}>
                    Update Price
                </button>
                </div>
            </div>}
            <button onClick={() => {
                    removeFromSale(vehicle.injected.id).then((receipt) => {
                        console.log(receipt);
                        dispatch(fetchAllData(blockchain.account));
                    });
                }}>
                    Delist Vehicle
            </button>


        </div>
    );
}

export default ListedVehicleOptions;