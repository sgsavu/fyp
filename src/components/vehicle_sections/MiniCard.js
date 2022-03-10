import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import '../../styles/VehicleCard.css';

const MiniCard = ({ vehicle }) => {

    const data = useSelector((state) => state.data);
    return (
        <div>
            <li>
                <Link className="card" to={window.location.pathname == "/garage" ? {
                    pathname: "/edit",
                    state: { metadata: vehicle },
                } : {
                    pathname: "/vehicle",
                    state: { metadata: vehicle },
                }}>

                    <img className="card__image" src={vehicle.image} />

                    <div className="card__overlay">
                        <div className="card__header">
                            <svg className="card__arc" ><path /></svg>
                            <img className="card__thumb" src="https://cdn.mos.cms.futurecdn.net/xz4NVQhHaHShErxar7YLn.jpg" alt="" />
                            <div className="card__header-text">
                                <h3 className="card__title"> {vehicle.attributes.company} {vehicle.attributes.model} {vehicle.attributes.year}</h3>
                                <span className="card__status">{vehicle.injected.display_price ? vehicle.injected.display_price + " " + data.displayCurrency : "Not listed."}</span>
                            </div>
                            <div>
                            {vehicle.attributes.fuel}
                            </div>
                            <div>
                            {vehicle.attributes.transmission}
                            </div>
                            <div>
                            ⭐
                            </div>
                           
                        </div>
                        <p className="card__description">{vehicle.attributes.fuel} {vehicle.attributes.transmission} </p>
                    </div>

                </Link>
            </li>

        </div>
    );
}

export default MiniCard;