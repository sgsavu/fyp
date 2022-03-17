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
import { Card, CardActions, CardContent, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Box } from "@mui/system";


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

    const [tab, setTab] = React.useState('History');

    const handleChange = (event, newAlignment) => {
        setTab(newAlignment);
    };

    return (
        <div>
            {eexists ?
                <Stack display="flex" alignItems="center" justifyContent="center" >

                    <BigCard vehicle={vehicle} />

                    <ToggleButtonGroup
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 300,
                            '& .MuiButtonBase-root': {
                                borderRadius: '200px',
                            },
                        }}
                        value={tab}
                        exclusive
                        onChange={handleChange}
                    >
                        <ToggleButton value="History">History</ToggleButton>
                        <ToggleButton value="Listing">Listing</ToggleButton>
                        <ToggleButton value="Approve">Approve</ToggleButton>
                    </ToggleButtonGroup>





                    {tab == "Listing" ?
                        isOwner
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
                        :
                        <div>
                            <History vehicle={vehicle}></History>
                        </div>
                    }



                </Stack>

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