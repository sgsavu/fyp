import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom'
import { getIfIsOwner, callViewChainFunction } from "../utils/BlockchainGateway";
import History from "../vehicle_sections/History";
import PurchaseOptions from "../vehicle_sections/PurchaseOptions";
import ListingOptions from "../vehicle_sections/ListingOptions";
import ListedVehicleOptions from "../vehicle_sections/ListedVehicleOptions";

const Vehicle = () => {

    const location = useLocation()
    const vehicle = location.state?.metadata

    const data = useSelector((state) => state.data);
    const app = useSelector((state) => state.app);
    const blockchain = useSelector((state) => state.blockchain);
    const myPrefferedCurrency = data.displayCurrency

    const [eexists, setEexists] = useState(false)
    const [currentOwner, setCurrentOwner] = useState("");
    const [odometerValue, setOdometerValue] = useState(0);
    const [settings, setSettings] = useState({})

    useEffect(async () => {

        if (blockchain.smartContract) {

            let eexists = await callViewChainFunction("exists",[vehicle.injected.id])
            setEexists(eexists)
            setOdometerValue(await callViewChainFunction("getOdometerValue",[vehicle.injected.id]))
            if (eexists) {
                setCurrentOwner(await callViewChainFunction("ownerOf",[vehicle.injected.id]))
                const [isForSale, isAuction, isOwner] = await Promise.all([callViewChainFunction("isForSale",[vehicle.injected.id]), callViewChainFunction("isAuction",[vehicle.injected.id]), getIfIsOwner(vehicle.injected.id)])
                setSettings({
                    isForSale: isForSale,
                    isAuction: isAuction,
                    isOwner: isOwner,
                    myCurrency: myPrefferedCurrency
                })
            }
        }


    }, [blockchain.smartContract,app.alerts.loading])

    return (
        <div>
            {eexists ?
                <div>
                    <div>
                        <img
                            alt={vehicle.name}
                            src={vehicle.image}
                            width={150}
                        />
                        {Object.keys(vehicle.attributes).map((key, index) => {
                            return (
                                <p key={index}>{key}: {vehicle.attributes[key]}</p>
                            );
                        })}
                        <p>Current owner: {currentOwner}</p>
                        <History vehicle={vehicle}></History>
                        <p>Odometer: {odometerValue} km</p>

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