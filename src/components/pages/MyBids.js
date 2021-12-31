import React, {useSelector} from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../vehicle_sections/VehicleCard';


const MyBids = () => {

    const data = useSelector((state) => state.data);
    const app = useSelector((state) => state.app);

    return (
        <div>
          {app.alerts.loading.length == 0 ? (
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

