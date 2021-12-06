import React, {useSelector} from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../components/vehicle_sections/VehicleCard';


const MyBids = () => {

    const data = useSelector((state) => state.data);

    return (
        <div>
          {data.loading ? (
            <p>loading...</p>
          ) : (
            data.myBids.map((vehicle, index) => {
              return (
                <VehicleCard key={index} vehicle={vehicle}></VehicleCard>
              );
            })
          )}
        </div>
      );
}

export default MyBids;

