import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import '../../styles/VehicleCard.css';

const VehicleCard = ({ vehicle }) => {

    const data = useSelector((state) => state.data);
    return (
        <div>


 

            <li>
                <Link class="card" to={window.location.pathname == "/garage" ? {
                    pathname: "/edit",
                    state: { metadata: vehicle },
                } : {
                    pathname: "/vehicle",
                    state: { metadata: vehicle },
                }}>
                    
                    <img
                        alt={vehicle.attributes.year}
                        src={vehicle.image}

                        class="card__image" alt=""
                    />
                    <div class="card__overlay">
                        <div class="card__header">
                        <svg class="card__arc" ><path/></svg> 
                            <img class="card__thumb" src="https://cdn.mos.cms.futurecdn.net/xz4NVQhHaHShErxar7YLn.jpg" alt="" />
                            <div class="card__header-text">
                                <h3 class="card__title"> {vehicle.attributes.company} {vehicle.attributes.model} {vehicle.attributes.year}</h3>
                                <span class="card__status">{window.location.pathname == "/" ? vehicle.injected.display_price + " " + data.displayCurrency : null}</span>
                            </div>
                        </div>
                        <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
                    </div>
                </Link>
            </li>

        </div>
    );
}

export default VehicleCard;