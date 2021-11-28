import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom'
import { fetchAllData, refresh } from "../redux/data/dataActions";
import { getVehicleHistory, ownerOf, getVehiclePrice, getContractBalance, getIfForSale, getIfAuction, getTopBidder, getTopBid, getIfExists, getIfIsOwner } from "../redux/blockchain/blockchainUtils";
import History from "../components/vehicle_sections/History";
import PurchaseOptions from "../components/vehicle_sections/PurchaseOptions";
import ListingOptions from "../components/vehicle_sections/ListingOptions";
import ListedVehicleOptions from "../components/vehicle_sections/ListedVehicleOptions";

const Vehicle = () => {

    const location = useLocation()
    const vehicle = location.state?.metadata

    const data = useSelector((state) => state.data);
    const myPrefferedCurrency = data.displayCurrency

    const [exists, setExists] = useState(false)
    const [currentOwner, setCurrentOwner] = useState("");
    const [settings, setSettings] = useState({})


    useEffect(async () => {

        let exists = await getIfExists(vehicle.injected.id)
        setExists(exists)
        if (exists) {
            setCurrentOwner(await ownerOf(vehicle.injected.id))
            console.log("con balance", await getContractBalance())
            setSettings({
                isForSale: await getIfForSale(vehicle.injected.id),
                isAuction: await getIfAuction(vehicle.injected.id),
                isOwner: await getIfIsOwner(vehicle.injected.id),
                myCurrency: myPrefferedCurrency
            })
        }
    }, [data.myVehicles, data.vehiclesForSale, data.allVehicles])

    console.log("settings",settings)

    return (
        <div>

            {exists ?
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
                        <History vehicle={vehicle}></History>

                    </div>
                    <div>
                        {settings.isOwner
                            ?
                              settings.isForSale
                                ?
                                <ListedVehicleOptions vehicle={vehicle} settings={settings}>
                                </ListedVehicleOptions>
                                :
                                <ListingOptions vehicle={vehicle} settings={settings}>
                                </ListingOptions>
                            : settings.isForSale 
                                ?
                                <PurchaseOptions vehicle={vehicle} settings={settings}>
                                </PurchaseOptions>
                                : 
                                null
                        }
                    </div>
                        
                </div>

                : <div>
                    <p>Sorry, this vehicle does no longer exist</p>
                    <button onClick={() => {
                        window.location.reload();
                        window.location.replace("/")
                    }}>Back To Home</button>
                </div>

            }
        </div>
    );
}

export default Vehicle;