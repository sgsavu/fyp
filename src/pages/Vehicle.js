import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as s from "../styles/globalStyles";
import { useLocation } from 'react-router-dom'
import { fetchData } from "../redux/data/dataActions";

const Vehicle = () => {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const location = useLocation()
    const vehicle = location.state?.metadata

    console.log(vehicle)
    const checkIfOwner = () => {
        return data.myVehicles.some(myVehicle => myVehicle.name === vehicle.name)
    }

    const checkIfIsForSale = () => {
        return data.vehiclesForSale.some(vehicleForSale => vehicleForSale.name === vehicle.name)
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
                dispatch(fetchData(blockchain.account));
            });
    }

    const buyVehicle = () => {

    }

    return (
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
                        <button onClick={(e) => {
                            buyVehicle()
                        }}>
                            Buy
                        </button>
                    : checkIfOwner() ?
                        <button onClick={(e) => {
                            setForSale(e, true)
                        }}>
                            List for sale
                        </button> : null
                }
            </div>
        </div>
    );
}

export default Vehicle;