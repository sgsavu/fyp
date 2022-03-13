import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import '../../styles/MiniCard.css';
import * as GameIcons from "react-icons/gi";
import * as MDIcons from "react-icons/md";

const MiniCard = ({ vehicle }) => {

    const data = useSelector((state) => state.data);
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
                    <img className="minicard-thumb" src="https://cdn.mos.cms.futurecdn.net/xz4NVQhHaHShErxar7YLn.jpg" />
                    <div className="minicard-text">
                        <h3 className="minicard-title"> {vehicle.attributes.company} {vehicle.attributes.model} {vehicle.attributes.year}</h3>
                        <span className="minicard-status">{vehicle.injected.display_price ? vehicle.injected.display_price + " " + data.displayCurrency : "Not listed."}</span>
                    </div>
                    {vehicle.injected.display_price && vehicle.injected.mine ? 
                    <div>
                        <GameIcons.GiHomeGarage></GameIcons.GiHomeGarage>
                    </div> : null}
                    {vehicle.injected.bid ? 
                    <div>
                        <MDIcons.MdPriceCheck></MDIcons.MdPriceCheck>
                    </div> : null}


                </div>
                <p className="minicard-description">{vehicle.attributes.fuel} {vehicle.attributes.transmission} </p>
            </div>

        </Link>
    );
}

export default MiniCard;