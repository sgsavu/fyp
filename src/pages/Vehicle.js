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

    const checkIfOwner = () => {
        return data.myVehicles.some(myVehicle => myVehicle.name === vehicle.name)
    }

    const checkIfIsForSale = () => {
        return data.vehiclesForSale.some(vehicleForSale => vehicleForSale.name === vehicle.name)
    }

    const getVehiclePrice = async (e) => {
        return await blockchain.smartContract.methods
            .getVehiclePrice(vehicle.injected.id)
            .call()
    }

    const setForSale = (e, value) => {
        e.preventDefault()
        blockchain.smartContract.methods
            .setForSale(vehicle.injected.id, value)
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(fetchAllData(blockchain.account));
            });
    }

    async function setVehiclePrice(price,fiat) {

        const priceInCrypto = await convertCurrencyToCurrency(price,fiat,"ETH")
        const priceInWei = convertEthToWei(priceInCrypto)
        blockchain.smartContract.methods
            .setVehiclePrice(vehicle.injected.id, priceInWei)
            .send({ from: blockchain.account })
            .once("error", (err) => {
                console.log(err);
            })
            .then((receipt) => {
                console.log(receipt);
                dispatch(refreshVehiclesForSale());
            });
    }

    async function buyVehicle(e) {

        e.preventDefault()
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


    return (
        <div>
            {vehicle!=undefined?
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
                {checkIfIsForSale()
                    ? checkIfOwner() ?
                        <button onClick={(e) => {
                            setForSale(e, false)
                        }}>
                            Remove from sale
                        </button> :
                        <div>
                            <p>{vehicle.injected.display_price} {myPrefferedCurrency}</p>
                            <button onClick={(e) => {
                                buyVehicle(e)
                            }}>
                                Buy
                            </button>
                        </div>
                    : checkIfOwner() ?
                        <button onClick={(e) => {
                            setForSale(e, true)
                            setVehiclePrice(2000,myPrefferedCurrency)
                        }}>
                            List for sale
                        </button> : null
                }
            </div>
            </div>
            :null
            
            }
            
        </div>
    );
}

export default Vehicle;