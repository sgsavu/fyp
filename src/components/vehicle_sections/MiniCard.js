import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import '../../styles/MiniCard.css';
import * as GameIcons from "react-icons/gi";
import * as MDIcons from "react-icons/md";
import * as RiIcons from 'react-icons/ri';
import { Avatar, Stack } from "@mui/material";
import { Box } from "@mui/system";

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { callViewChainFunction } from "../utils/GatewayParser";


const MiniCard = ({ vehicle }) => {

    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);


    return (

        <Link className="minicard" to={window.location.pathname == "/garage" ? {
            pathname: "/edit",
            state: { metadata: vehicle },
        } : {
            pathname: "/vehicle",
            state: { metadata: vehicle },
        }}>

            <img className="minicard-image" src={vehicle.image} />

            <div className="minicard-overlay">
                <div className="minicard-header">
                    <svg className="minicard-arc" ><path /></svg>
                    <Avatar>
                        <Jazzicon diameter={40} seed={jsNumberForAddress(vehicle.injected.owner)} />
                    </Avatar>
                    <div className="minicard-text">
                        <h3 className="minicard-title"> {vehicle.attributes.company} {vehicle.attributes.model} {vehicle.attributes.year}</h3>
                        <span className="minicard-status">{vehicle.injected.display_price ? vehicle.injected.display_price + " " + data.displayCurrency : "Not listed."}</span>
                    </div>
                    <Stack spacing={2} display="flex" align-items="center" justify-content="center" direction="row">


                        {vehicle.injected.display_price && (vehicle.injected.owner == blockchain.account) ?

                            <GameIcons.GiHomeGarage></GameIcons.GiHomeGarage>
                            : null}

                        {(vehicle.injected.topBidder == blockchain.account) ?

                            <MDIcons.MdPriceCheck></MDIcons.MdPriceCheck>
                            : null}

                        {vehicle.injected.auction ?

                            <RiIcons.RiAuctionFill></RiIcons.RiAuctionFill>
                            : null}


                    </Stack>



                </div>
                <p className="minicard-description">{vehicle.attributes.transmission} - {vehicle.attributes.fuel} - {vehicle.attributes.color} </p>
            </div>

        </Link>
    );
}

export default MiniCard;