import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const VehicleCard = ({vehicle}) => {

    const data = useSelector((state) => state.data);
    return (
        <div>
            <img
                alt={vehicle.attributes.year}
                src={vehicle.image}
                width={150}
            />
            <p>Year: {vehicle.attributes.year}</p>
            <p>Company: {vehicle.attributes.company}</p>
            <p>Model: {vehicle.attributes.model}</p>
            <p>{window.location.pathname=="/"? "Price: "+ vehicle.injected.display_price + " " + data.displayCurrency :null}</p>
            <Link to={{
                pathname: "/vehicle",
                state: { metadata: vehicle },
            }}>
                <p>VIEW </p>
            </Link>
            
        </div>
    );
}

export default VehicleCard;