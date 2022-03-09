import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom'
import { getIfIsOwner, callViewChainFunction } from "../utils/BlockchainGateway";
import History from "../vehicle_sections/History";
import NotMyVehicleListed from "../vehicle_sections/NotMyVehicleListed";
import MyVehicleNotListed from "../vehicle_sections/MyVehicleNotListed";
import MyVehicleListed from "../vehicle_sections/MyVehicleListed";

import '../../styles/Vehicle.css';


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

    const [pageToggle, setPageToggle] = useState(false)
    const [typeToggle, setTypeToggle] = useState(false)

    useEffect(async () => {

        if (blockchain.smartContracts.length != 0) {

            let eexists = await callViewChainFunction("exists", [vehicle.injected.id])
            setEexists(eexists)
            setOdometerValue(await callViewChainFunction("getOdometerValue", [vehicle.injected.id]))
            if (eexists) {
                setCurrentOwner(await callViewChainFunction("ownerOf", [vehicle.injected.id]))
                const [isForSale, isAuction, isOwner] = await Promise.all([callViewChainFunction("isForSale", [vehicle.injected.id]), callViewChainFunction("isAuction", [vehicle.injected.id]), getIfIsOwner(vehicle.injected.id)])
                setSettings({
                    isForSale: isForSale,
                    isAuction: isAuction,
                    isOwner: isOwner,
                    myCurrency: myPrefferedCurrency
                })
            }
        }


    }, [blockchain.smartContracts, data])

    return (
        <div>
            {eexists ?
                <div>

                    <div className="cardwrapper">
                        <div>
                            <div class="card">
                                <img src="https://cdn.pocket-lint.com/r/s/970x/assets/images/144304-cars-review-tesla-model-x-review-lead-image1-vdycmknzck-jpg.webp" class="card__image" alt="brown couch" />
                                <div class="card__content">
                                    <time datetime="2021-03-30" class="card__date">{vehicle.attributes.vhcid}</time>
                                    <span class="card__title">{vehicle.attributes.company}</span>
                                    <time datetime="2021-03-30" class="card__date">Make</time>
                                    <span class="card__title">{vehicle.attributes.model}</span>
                                    <time datetime="2021-03-30" class="card__date">Model</time>
                                    <span class="card__title">{vehicle.attributes.year}</span>
                                    <time datetime="2021-03-30" class="card__date">Year</time>

                                </div>

                                <div class="card__content2">
                                    <span class="card__title2">Black</span>
                                    <time datetime="2021-03-30" class="card__date2">Color</time>
                                    <span class="card__title2">Hatchback</span>
                                    <time datetime="2021-03-30" class="card__date2">Body</time>
                                    <span class="card__title2">Automatic</span>
                                    <time datetime="2021-03-30" class="card__date2">Transmission</time>
                                    <span class="card__title2">Electric</span>
                                    <time datetime="2021-03-30" class="card__date2">Fuel</time>
                                    <span class="card__title2">AWD 60D</span>
                                    <time datetime="2021-03-30" class="card__date2">Engine</time>
                                    <span class="card__title2">Left</span>
                                    <time datetime="2021-03-30" class="card__date2">Driver Side</time>
                                    <div className="wow">
                                        <div>
                                            <span class="card__title3">5</span>
                                            <time datetime="2021-03-30" class="card__date3">Doors</time>
                                        </div>
                                        <div>
                                            <span class="card__title3">7</span>
                                            <time datetime="2021-03-30" class="card__date3">Seats</time>
                                        </div>

                                    </div>

                                </div>
                            </div>


                        </div>
                    </div>




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

                                {settings.isOwner
                                    ?
                                    settings.isForSale
                                        ?
                                        <MyVehicleListed vehicle={vehicle} settings={settings} />
                                        :
                                        <MyVehicleNotListed vehicle={vehicle} settings={settings} />
                                    : settings.isForSale
                                        ?
                                        <NotMyVehicleListed vehicle={vehicle} settings={settings} />
                                        :
                                        <p>Vehicle not for sale.</p>
                                }
                            </div>
                            :
                            <div className="cardwrapper2">
                                <div>
                                    <p>Total distance traveled: {odometerValue} km</p>
                                    <History vehicle={vehicle}></History>
                                </div>
                            </div>
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