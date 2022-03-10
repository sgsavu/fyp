import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import '../../styles/Vehicle.css';

const BigCard = ({ vehicle }) => {

    return (
        <div className="cardwrapper">
            <div>
                <div className="card">
                    <img
                        className="card__image"
                        src={vehicle.image}
                    />
                    <div className="card__content">
                        <div className="card__date">{vehicle.attributes.vhcid}</div>
                        <span className="card__title">{vehicle.attributes.company}</span>
                        <div className="card__date">Make</div>
                        <span className="card__title">{vehicle.attributes.model}</span>
                        <div className="card__date">Model</div>
                        <span className="card__title">{vehicle.attributes.year}</span>
                        <div className="card__date">Year</div>
                    </div>

                    <div className="card__content2">
                        <span className="card__title2">{vehicle.attributes.color}</span>
                        <div className="card__date2">Color</div>
                        <span className="card__title2">{vehicle.attributes.body}</span>
                        <div className="card__date2">Body</div>
                        <span className="card__title2">{vehicle.attributes.transmission}</span>
                        <div className="card__date2">Transmission</div>
                        <span className="card__title2">{vehicle.attributes.fuel}</span>
                        <div className="card__date2">Fuel</div>
                        <span className="card__title2">{vehicle.attributes.engine}</span>
                        <div className="card__date2">Engine</div>
                        <span className="card__title2">{vehicle.attributes.driver_side}</span>
                        <div className="card__date2">Driver Side</div>
                        <div className="wow">
                            <div>
                                <span className="card__title3">{vehicle.attributes.doors}</span>
                                <div className="card__date3">Doors</div>
                            </div>
                            <div>
                                <span className="card__title3">{vehicle.attributes.seats}</span>
                                <div className="card__date3">Seats</div>
                            </div>

                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
}

export default BigCard;