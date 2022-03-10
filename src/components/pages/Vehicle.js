import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom'
import { getIfIsOwner, callViewChainFunction } from "../utils/GatewayParser";
import History from "../vehicle_sections/History";
import NotMyVehicleListed from "../vehicle_sections/NotMyVehicleListed";
import MyVehicleNotListed from "../vehicle_sections/MyVehicleNotListed";
import MyVehicleListed from "../vehicle_sections/MyVehicleListed";

import '../../styles/Vehicle.css';
import BigCard from "../vehicle_sections/BigCard";


const Vehicle = () => {

    const location = useLocation()
    const vehicle = location.state?.metadata

    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);

    const [eexists, setEexists] = useState(false)
    const [isForSale, setIsForSale] = useState({})
    const [isOwner, setIsOwner] = useState({})

    const [pageToggle, setPageToggle] = useState(false)


    useEffect(async () => {

        if (blockchain.smartContracts.length != 0) {

            let eexists = await callViewChainFunction("exists", [vehicle.injected.id])
            setEexists(eexists)

            if (eexists) {
                const [isForSale, isOwner] = await Promise.all([callViewChainFunction("isForSale", [vehicle.injected.id]), getIfIsOwner(vehicle.injected.id)])
                setIsForSale(isForSale)
                setIsOwner(isOwner)
            }
        }


    }, [blockchain.smartContracts, data])

    return (
        <div>
            {eexists ?
                <div>

                    
                    <BigCard vehicle={vehicle}/>



                    <div className="cardwrapper2">
                        <div class="phone2">
                            <div class="content">
                                <div className="boss" onClick={() => setPageToggle(!pageToggle)}>
                                    <div className={pageToggle ? "toggle-right" : "toggle-left"}></div>
                                    <div class="options">
                                        <p className={pageToggle ? "optionOff" : "optionOn"}>History</p>
                                        <p className={pageToggle ? "optionOn" : "optionOff"}>Listing</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div>
                        {pageToggle ?
                            <div className="body">

                                {isOwner
                                    ?
                                    isForSale
                                        ?
                                        <MyVehicleListed vehicle={vehicle} />
                                        :
                                        <MyVehicleNotListed vehicle={vehicle} />
                                    : isForSale
                                        ?
                                        <NotMyVehicleListed vehicle={vehicle} />
                                        :
                                        <p>Vehicle not for sale.</p>
                                }
                            </div>
                            :
                            <div className="cardwrapper2">
                                <div>
                                    <History vehicle={vehicle}></History>
                                </div>
                            </div>
                        }
                    </div>


                </div>

                : <div>
                    <p>Sorry, this vehicle no longer exists.</p>
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