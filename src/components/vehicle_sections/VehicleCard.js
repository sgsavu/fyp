import React from "react";
import { Link } from 'react-router-dom';

const VehicleCard = ({vehicle}) => {

    /*

    <p>{pageType == "instant" ? "Price: " : "Highest Bid: "}{
                    vehicle?.injected.display_price
                  } {myPrefferedCurrency}</p>

    */

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
            <p>{vehicle.injected.hasOwnProperty('display_price')?vehicle.injected.display_price:null}</p>
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