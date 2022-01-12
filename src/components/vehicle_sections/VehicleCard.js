import React from "react";
import { Link } from 'react-router-dom';

const VehicleCard = ({vehicle}) => {
    
    return (
        <div>
            <img
                alt={vehicle.attributes.year}
                src={vehicle.image}
                width={150}
            />
            <p>{vehicle.attributes.year}</p>
            <p>{vehicle.attributes.company}</p>
            <p>{vehicle.attributes.model}</p>
            <p>{window.location.pathname=="/"?vehicle.injected.display_price:null}</p>
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