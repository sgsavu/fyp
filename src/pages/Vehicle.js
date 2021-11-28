import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom'
import { EthToWei, myCurrencyToWei, currencyToCurrency, WeiToEth, weiToMyCurrency } from '../utils/PricesCoinsExchange'
import { fetchAllData, refresh } from "../redux/data/dataActions";
import { getVehicleHistory, ownerOf, getVehiclePrice, getContractBalance, getIfForSale, getIfAuction, getTopBidder, getTopBid, getIfExists } from "../redux/blockchain/blockchainUtils";


const Vehicle = () => {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const location = useLocation()
    const vehicle = location.state?.metadata
    const myPrefferedCurrency = data.displayCurrency

    const [exists, setExists] = useState(false)
    const [listingType, setListingType] = useState("INSTANT")
    const [isForSale, setIsForSale] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [topBidder, setTopBidder] = useState("0x0")
    const [isAuction, setIsAuction] = useState(false);
    const [topBid, setTopBid] = useState(0);
    const [displayPrice, setDisplayPrice] = useState(0);
    const [desiredPrice, setDesiredPrice] = useState(0)
    const [currentOwner, setCurrentOwner] = useState("");
    const [vehicleHistory, setVehicleHistory] = useState([]);

    const checkIfOwner = async () => {
        return (blockchain.account == await ownerOf(vehicle.injected.id))
    }

    const listAuction = async (price) => {

        blockchain.smartContract.methods
            .listAuction(vehicle.injected.id, await myCurrencyToWei(price))
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchAllData(blockchain.account));
            });
    }


    const listForSale = async (price) => {

        blockchain.smartContract.methods
            .listForSale(vehicle.injected.id, await myCurrencyToWei(price))
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchAllData(blockchain.account));
            });
    }

    const removeFromSale = () => {

        blockchain.smartContract.methods
            .removeFromSale(vehicle.injected.id)
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchAllData(blockchain.account));
            });
    }

    async function setVehiclePrice(price) {
        blockchain.smartContract.methods
            .setVehiclePrice(vehicle.injected.id, await myCurrencyToWei(price))
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(refresh("FORSALE_VEHICLES"));
            });
    }

    async function buyVehicle() {

        blockchain.smartContract.methods
            .buyVehicle(vehicle.injected.id)
            .send({ from: blockchain.account, value: await getVehiclePrice(vehicle.injected.id) })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchAllData(blockchain.account));
            });
    }

    async function bidVehicle(price) {
        blockchain.smartContract.methods
            .bidVehicle(vehicle.injected.id)
            .send({ from: blockchain.account, value: await myCurrencyToWei(price) })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchAllData(blockchain.account));
            });
    }


    async function concludeAuction() {
        blockchain.smartContract.methods
            .concludeAuction(vehicle.injected.id)
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchAllData(blockchain.account));
            });
    }



    useEffect(async () => {

        let exists = await getIfExists(vehicle.injected.id)
        setExists(await getIfExists(vehicle.injected.id))

        if (exists){
            let isForSale = await getIfForSale(vehicle.injected.id)
            let isOwner = await checkIfOwner()
            let isAuction = await getIfAuction(vehicle.injected.id)
            let topBid = await getTopBid(vehicle.injected.id)
            let vehicleHistory = await getVehicleHistory(vehicle.injected.id)
            setVehicleHistory(vehicleHistory)
            setIsForSale(isForSale)
            setIsAuction(isAuction)
            setCurrentOwner(await ownerOf(vehicle.injected.id))
            setIsOwner(isOwner)
            setListingType("INSTANT")
            setTopBid(await weiToMyCurrency(topBid))
            if (isForSale == true) {
                setDisplayPrice(await weiToMyCurrency(await getVehiclePrice(vehicle.injected.id)))
            }
            if (isAuction == true) {
                setTopBidder(await getTopBidder(vehicle.injected.id))
                console.log("topbidder", await getTopBidder(vehicle.injected.id))
            }
            console.log("con balance", await getContractBalance())
        }
        

    }, [data.myVehicles,data.vehiclesForSale,data.allVehicles])


    return (
        <div>

            {exists?
                <div>
                    <div>
                        <img
                            alt={vehicle.name}
                            src={vehicle.image}
                            width={150}
                        />
                        <p>Name: {vehicle.name}</p>
                        <p>Description: {vehicle.description}</p>
                        {vehicle.attributes.map((attribute, index) => {
                            return (
                                <div key={index}>
                                    <p>{attribute.trait_type}: {attribute.value}</p>
                                </div>
                            );
                        })}
                        <p>Current owner: {currentOwner}</p>
                        Vehicle History:
                        {vehicleHistory.map((owner,index)=>{
                            return (
                                <div key={owner,index}>
                                    <p>{owner}</p>
                                    </div>
                            )
                        })}

                    </div>
                    <div>
                        {isOwner
                            ? <div>


                                {isForSale ?

                                    <div>
                                        <p>
                                            {isAuction ? "Highest Bid: " : "Price: "}
                                            {displayPrice} {myPrefferedCurrency}</p>

                                        {isAuction ? <div>
                                            {topBidder != "0x0000000000000000000000000000000000000000" ? <button onClick={(e) => {
                                                e.preventDefault()
                                                concludeAuction()
                                            }}>
                                                Conclude Auction
                                            </button> : null}

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                removeFromSale()
                                            }}>
                                                Cancel Auction
                                            </button>
                                        </div> : <div>
                                            <div>
                                                <input type="number" value={desiredPrice} onChange={(e) => { setDesiredPrice(e.target.value) }}></input>
                                                <label>{myPrefferedCurrency}</label>
                                            </div>
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setVehiclePrice(desiredPrice)
                                            }}>
                                                Update Price
                                            </button>
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                removeFromSale()
                                            }}>
                                                Remove from sale
                                            </button>
                                        </div>}


                                    </div>
                                    :
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
                                                        listForSale(desiredPrice)
                                                    }
                                                }}>
                                                    List for sale
                                                </button>
                                                :
                                                <button onClick={(e) => {

                                                    e.preventDefault()

                                                    listAuction(desiredPrice)

                                                }}>
                                                    List auction
                                                </button>
                                            }

                                        </div>
                                    </div>}

                            </div>
                            : isForSale ?

                                <div>
                                    <p>
                                        {isAuction ? "Highest Bid: " : "Price: "}
                                        {displayPrice} {myPrefferedCurrency}</p>
                                    {isAuction ?
                                        <div>
                                            <input type="number" value={desiredPrice} onChange={(e) => { setDesiredPrice(e.target.value) }}></input>
                                            <label>{myPrefferedCurrency}</label>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                bidVehicle(desiredPrice)
                                            }}>
                                                Bid
                                            </button>

                                        </div> :
                                        <div>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                buyVehicle()
                                            }}>
                                                Buy
                                            </button>
                                        </div>
                                    }

                                </div>
                                : null



                        }
                    </div>
                    {topBidder == blockchain.account ?
                        <div>
                            <p>You are the top bidder with {topBid} {myPrefferedCurrency} </p>


                        </div>
                        : null}
                </div>

                : <div>
                    <p>Sorry, this vehicle does no longer exist</p>
                    <button onClick={()=> {
                        window.location.reload();
                        window.location.replace("/")
                    }}>Back To Home</button>
                </div>

            }
        </div>
    );
}

export default Vehicle;