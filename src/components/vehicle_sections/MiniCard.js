import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import '../../styles/MiniCard.css';
import * as GameIcons from "react-icons/gi";
import * as MDIcons from "react-icons/md";
import * as RiIcons from 'react-icons/ri';
import { Avatar, Stack, Typography } from "@mui/material";
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

            <img
                style={{
                    width: "100%",
                    height: "100%"
                }}
                src={vehicle.image} />

            <div className="minicard-wrapper">
                <div className="minicard-info">
                    <svg className="minicard-corner" >
                        <path style={{ fill: "white" }} d="M 40 80 c 22 0 40 -22 40 -40 v 40 Z" />
                    </svg>
                    <Avatar>
                        <Jazzicon diameter={40} seed={jsNumberForAddress(vehicle.injected.owner)} />
                    </Avatar>

                    <Stack color="black">
                        <h3 style={{
                            fontSize: "1em",
                            margin: "0 0 .3em"
                        }} > {vehicle.attributes.company} {vehicle.attributes.model} {vehicle.attributes.year}</h3>
                        <p style={{ fontSize: "0.8em" }} >{vehicle.injected.display_price ? vehicle.injected.display_price + " " + data.displayCurrency : "Not listed."}</p>
                    </Stack>

                    <Stack spacing={2} display="flex" align-items="center" justify-content="center" direction="row">

                        {vehicle.injected.display_price && (vehicle.injected.owner == blockchain.account) ?

                            <GameIcons.GiHomeGarage></GameIcons.GiHomeGarage>
                            : null}

                        {blockchain.account ? vehicle.injected.topBidder == blockchain.account ?

                            <MDIcons.MdPriceCheck></MDIcons.MdPriceCheck>
                            : null : null}

                        {vehicle.injected.auction ?

                            <RiIcons.RiAuctionFill></RiIcons.RiAuctionFill>
                            : null}

                    </Stack>



                </div>
                <Typography sx={{
                    color: "black",
                    fontSize: "0.8rem",
                    padding: "0 1.5em 1.5em",
                    margin: "0"
                }} >{vehicle.attributes.transmission} - {vehicle.attributes.fuel} - {vehicle.attributes.color}
                </Typography>

            </div>

        </Link>
    );
}

export default MiniCard;