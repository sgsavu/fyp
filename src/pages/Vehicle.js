import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as s from "../styles/globalStyles";
import { useLocation } from 'react-router-dom'
import { convertEthToWei, convertCurrencyToCurrency, convertWeiToEth, convertToDisplayCurrency } from './PricesCoinsExchange'
import { fetchAllData, refreshVehiclesForSale } from "../redux/data/dataActions";
import web3 from "web3";
import { use } from "chai";


const Vehicle = () => {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const location = useLocation()
    const [priceForSale, setPriceForSale] = useState(0);
    const vehicle = location.state?.metadata
    const myPrefferedCurrency = data.displayCurrency
    const [isAuction, setIsAuction] = useState(false);
    const [myBid, setMyBid] = useState(0);
    const [displayPrice, setDisplayPrice] = useState(0);

    const checkIfOwner = async () => {
        return (blockchain.account == await ownerOf(vehicle.injected.id))
    }

    const checkIfIsForSale = async () => {
        return await blockchain.smartContract.methods
            .isForSale(vehicle.injected.id)
            .call()
    }

    const getVehiclePrice = async () => {
        return await blockchain.smartContract.methods
            .getVehiclePrice(vehicle.injected.id)
            .call()
    }


    const checkIfIsAuction = async () => {

        return await blockchain.smartContract.methods
            .isAuction(vehicle.injected.id)
            .call()
    }


    const listAuction = async (price) => {

        blockchain.smartContract.methods
            .listAuction(vehicle.injected.id, await displayPriceToBlockchainPrice(price))
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
            .listForSale(vehicle.injected.id, await displayPriceToBlockchainPrice(price))
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

    const displayPriceToBlockchainPrice = async (price) => {
        const priceInCrypto = await convertCurrencyToCurrency(price, myPrefferedCurrency, "ETH")
        const priceInWei = convertEthToWei(priceInCrypto)
        return priceInWei
    }

    async function setVehiclePrice(price) {
        blockchain.smartContract.methods
            .setVehiclePrice(vehicle.injected.id, await displayPriceToBlockchainPrice(price))
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(refreshVehiclesForSale());
            });
    }

    async function buyVehicle() {

        let vehiclePrice = await getVehiclePrice()
        blockchain.smartContract.methods
            .buyVehicle(vehicle.injected.id)
            .send({ from: blockchain.account, value: vehiclePrice })
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
            .send({ from: blockchain.account, value: await displayPriceToBlockchainPrice(price) })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchAllData(blockchain.account));
            });
    }

    async function withdrawBid() {
        blockchain.smartContract.methods
            .withdrawBid(vehicle.injected.id)
            .send({ from: blockchain.account })
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

    async function getMyBid() {
        return await blockchain.smartContract.methods
            .getBid(vehicle.injected.id, blockchain.account)
            .call()
    }

    async function ownerOf(token) {
        return await blockchain.smartContract.methods
            .ownerOf(token)
            .call()
    }

    async function getTopBidder() {
        return await blockchain.smartContract.methods
            .getTopBidder(vehicle.injected.id)
            .call()
    }

    async function getContractBalance() {
        return await blockchain.smartContract.methods
            .getContractBalance()
            .call()
    }

    useEffect(async () => {
        setIsForSale(await checkIfIsForSale())
        setIsOwner(await checkIfOwner())
        if (await checkIfIsForSale())
        {   
            console.log("it is for sale")
            setDisplayPrice(await convertToDisplayCurrency(await getVehiclePrice()))
        }
        setSaleOption("INSTANT")
        setIsAuction(await checkIfIsAuction())
        setMyBid(await convertToDisplayCurrency(await getMyBid()))
        if (await checkIfIsAuction())
        {
            setTopBidder(await getTopBidder())
            console.log("topbidder",await getTopBidder())
        }
        console.log("ownerofvehicle",await ownerOf(vehicle.injected.id));
        console.log("con balance", await getContractBalance())
    }, [data])


    const [saleOption, setSaleOption] = useState("INSTANT")
    const [price, setPrice] = useState("")
    const [topBidder, setTopBidder] = useState("0x0")
    const [isForSale, setIsForSale] = useState(false)
    const [isOwner, setIsOwner] = useState(false)

    return (
        <div>
            
            {vehicle != undefined ?
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
                                            {topBidder!="0x0000000000000000000000000000000000000000"? <button onClick={(e) => {
                                                e.preventDefault()
                                                concludeAuction()
                                            }}>
                                                Finish Auction
                                            </button>: null }
                                           
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                removeFromSale()
                                            }}>
                                                Cancel Auction
                                            </button>
                                        </div> : <div>
                                            <div>
                                                <input type="number" value={price} onChange={(e) => { setPrice(e.target.value) }}></input>
                                                <label>{myPrefferedCurrency}</label>
                                            </div>
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setVehiclePrice(price)
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
                                            <label>{saleOption == "INSTANT" ? "Price: " : "Starting Price: "}</label>

                                            <input type="number" value={price} onChange={(e) => { setPrice(e.target.value) }}></input>
                                            <label>{myPrefferedCurrency}</label>
                                        </div>
                                        <div>
                                            <select onChange={(e) => { setSaleOption(e.target.value) }}>
                                                <option value="INSTANT">INSTANT</option>
                                                <option value="AUCTION">AUCTION</option>
                                            </select>
                                        </div>
                                        <div>

                                            {saleOption == "INSTANT" ?
                                                <button onClick={(e) => {
                                                    console.log("sale")
                                                    e.preventDefault()
                                                    if (price > 0) {
                                                        listForSale(price)
                                                    }
                                                }}>
                                                    List for sale
                                                </button>
                                                :
                                                <button onClick={(e) => {
                                                    console.log("auction")
                                                    e.preventDefault()
                                                    if (price > 0) {
                                                        listAuction(price)
                                                    }
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
                                            <input type="number" value={price} onChange={(e) => { setPrice(e.target.value) }}></input>
                                            <label>{myPrefferedCurrency}</label>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                bidVehicle(price)
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
                </div>
                : null

            }

            {myBid != 0 ?
                <div>
                    <p>Your bid: {myBid}</p>
                    {topBidder!=blockchain.account? <button onClick={(e) => {
                        e.preventDefault()
                        withdrawBid()
                    }}>
                        Withdraw Bid
                    </button> : null}
                    
                </div>
                : null}
        </div>
    );
}

export default Vehicle;