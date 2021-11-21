import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as s from "../styles/globalStyles";
import { useLocation } from 'react-router-dom'
import { convertEthToWei, convertCurrencyToCurrency, convertWeiToEth } from './PricesCoinsExchange'
import { fetchAllData, refreshVehiclesForSale } from "../redux/data/dataActions";
import web3 from "web3";


const Vehicle = () => {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const location = useLocation()
    const [priceForSale, setPriceForSale] = useState(0);
    const vehicle = location.state?.metadata
    const myPrefferedCurrency = data.displayCurrency
    const [isAuction,setIsAuction] = useState(false);

    const checkIfOwner = () => {
        return data.myVehicles.some(myVehicle => myVehicle.name === vehicle.name)
    }

    const checkIfIsForSale = () => {
        return data.vehiclesForSale.some(vehicleForSale => vehicleForSale.name === vehicle.name)
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

    const delistAuction = async () => {

        blockchain.smartContract.methods
            .delistAuction(vehicle.injected.id)
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
            .payForVehicle(vehicle.injected.id)
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

    async function auctionEnd() {
        blockchain.smartContract.methods
            .auctionEnd(vehicle.injected.id)
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchAllData(blockchain.account));
            });
    }

    getMyBid()
    async function getMyBid() {
        console.log(await blockchain.smartContract.methods
            .getBidForAccount(vehicle.injected.id, blockchain.account)
            .call())
    }

    getConBalance()
    async function getConBalance() {
        console.log("conbalance", await blockchain.smartContract.methods
            .getConBalance()
            .call())
    }

    useEffect(async () => {
        console.log("thisis",await checkIfIsAuction())
        setSaleOption("INSTANT")
        setIsAuction(await checkIfIsAuction())
    }, [data])


    const [saleOption, setSaleOption] = useState("INSTANT")
    const [price, setPrice] = useState("")

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
                        {checkIfOwner()
                            ? <div>

                               
                                    {checkIfIsForSale() ?
                                        
                                        <div>
                                            <p>
                                            {isAuction ? "Highest Bid: " : "Price: "}
                                            {vehicle.injected.display_price} {myPrefferedCurrency}</p>
                                            {isAuction ? <div>

                                                <button onClick={(e) => {
                                                    e.preventDefault()
                                                    auctionEnd()
                                                }}>
                                                    Finish Auction
                                                </button>
                                                <button onClick={(e) => {
                                                    e.preventDefault()
                                                    delistAuction()
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
                            : checkIfIsForSale() ?

                                <div>
                                    <p>
                                            {isAuction ? "Highest Bid: " : "Price: "}
                                            {vehicle.injected.display_price} {myPrefferedCurrency}</p>
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
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                withdrawBid()
                                            }}>
                                                Withdraw Bid
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

        </div>
    );
}

export default Vehicle;